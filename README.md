# airtable-post-social-media
Post to Social Media in Airtable for either individual accounts or multiple client businesses

## Airtable Script
An example of automatically posting to linked social media accounts in Airtable using Ayrshare.
This example allows you to post to either a single profile or multiple client profiles and their linked social networks.

Get your free API Key at [Ayrshare's Dashbboard](https://www.ayrshare.com) and enter in the script the key API_KEY = "API Key";

The script expects a table with fields: Post, Platforms, Images, Profile Keys, and Status.
Please see for an example: https://airtable.com/shrCWY0oA1ghB42tI/tblpnTEiPwyuViqBo

When status is "pending" the post will be processed and sent. The resulting post status will be updated in the Status field.
Post to one or more client profiles by entering the client Profile Keys, comma separated without spaces.

See Ayrshare's [social media API](https://www.ayrshare.com/docs) for more info.
