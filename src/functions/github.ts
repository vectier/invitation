import { Octokit } from '@octokit/core';

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

let orgUsername: string = '';

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
  const response = await octokit.request('GET /orgs/{org}/members', {
    org: orgUsername,
  });
  
  const usernames = response.data.map((data) => data.login);
  return usernames
};

/**
 * Add a member to the organization by specific GitHub username.
 * 
 * @param username - A GitHub username
 */
export const member = async (username: string) => {
  const response = await octokit.request('PUT /orgs/{org}/memberships/{username}', {
    org: orgUsername,
    username: username,
    role: 'member',
  });
  console.log(response);
};
