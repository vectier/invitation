import { Octokit } from '@octokit/core';
import * as os from 'os';

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

let orgUsername: string = '';
let cacheMembers: string[] = [];

/**
 * Set an organization name to manage a member.
 * 
 * @param username - A GitHub organization username
 */
export const organization = (username: string) => {
  orgUsername = username;
};

/**
 * Get a list of GitHub usernames of the organization.
 * 
 * @returns An array of GitHub usernames
 */
export const getMembers = async () => {
  if (cacheMembers.length !== 0) return cacheMembers;

  const response = await octokit.request('GET /orgs/{org}/members', {
    org: orgUsername,
  });
  
  const usernames = response.data.map((data) => data.login);
  return usernames;
};

/**
 * Add a member to the organization by specific GitHub username.
 * 
 * @param username - A GitHub username
 */
export const member = async (username: string) => {
  try {
    const members = await getMembers();

    if (members.includes(username)) return;

    await octokit.request('PUT /orgs/{org}/memberships/{username}', {
      org: orgUsername,
      username: username,
      role: 'member',
    });
  } catch (error: Error | unknown) {
    if (!(error instanceof Error)) return;
    setFailed(error.message);
  }
};

export const setFailed = (message: string) => {
  process.exitCode = 1;
  process.stdout.write(message + os.EOL);
};
