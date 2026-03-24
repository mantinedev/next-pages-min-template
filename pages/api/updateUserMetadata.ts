import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = req.query.user;
  if (!user || Array.isArray(user)) {
    return res.status(400).json({ error: 'Invalid user query param' });
  }

  const { userId, sessionClaims } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing Graph credentials' });
  }

  const formdata = new URLSearchParams();
  formdata.append('grant_type', 'client_credentials');
  formdata.append('client_id', clientId);
  formdata.append('client_secret', clientSecret);
  formdata.append('resource', 'https://graph.microsoft.com/');

  const tokenResponse = await fetch(
    'https://login.microsoftonline.com/ed76ab48-efcd-4ee8-9a0b-02284511985d/oauth2/token',
    {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    },
  );
  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text();
    return res.status(502).json({ error: 'Token request failed', detail });
  }
  const token = (await tokenResponse.json()).access_token as string | undefined;
  if (!token) {
    return res.status(502).json({ error: 'Missing access token' });
  }

  const userProfileResponse = await fetch(
    `https://graph.microsoft.com/v1.0/users/${user}/?$select=jobTitle,department`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ConsistencyLevel: 'eventual',
      },
      redirect: 'follow',
    },
  );
  if (!userProfileResponse.ok) {
    const detail = await userProfileResponse.text();
    return res.status(502).json({ error: 'User profile request failed', detail });
  }
  const userProfile = await userProfileResponse.json();
  const { jobTitle, department } = userProfile ?? {};

  const metadata = {
    publicMetadata: {
      ...(sessionClaims?.metadata ?? {}),
      jobTitle: jobTitle,
      department: department,
    },
  };

  // Send updated metadata to Clerk
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, metadata);

  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${user}/photo/$value`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ConsistencyLevel: 'eventual',
    },
    redirect: 'follow',
  });

  if (response.status === 404) {
    return res.status(204).end();
  }

  if (!response.ok) {
    const detail = await response.text();
    return res.status(502).json({ error: 'Photo request failed', detail });
  }

  const blob = await response.blob();

  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const contentLength = response.headers.get('content-length') || String(blob.size);

  // converting blob to raw buffer for transferring
  // (other formats including blob was not working)
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return res
    .status(200)
    .setHeader('Content-Type', contentType)
    .setHeader('Content-Length', contentLength)
    .send(buffer);
}
