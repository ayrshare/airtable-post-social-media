/**
 * An example of automatically posting to linked social media accounts in Airtable using Ayrshare.
 * This example allows you to post to either a single profile or multiple client profiles and their linked social networks.
 *
 * Get your free API Key at https://www.ayrshare.com and enter in the script the key API_KEY = "API Key";
 *
 * The script expects a table with fields: Post, Platforms, Images, Profile Keys, and Status.
 * Please see for an example: https://airtable.com/shrCWY0oA1ghB42tI/tblpnTEiPwyuViqBo
 *
 * When status is "pending" the post will be processed and sent. The resulting post status will be updated in the Status field.
 * Post to one or more client profiles by entering the client Profile Keys, comma separated without spaces
 *
 * Copyright ⓒ Ayrshare & Nevermind Solutions, LLC 2021
 */

const API_KEY = 'Your API Key'; // Get a free key at ayrshare.com

const sendPost = async (data) => {
    const { post, platforms, images_uls, profileKeys, scheduleDate } = data;

    const body = Object.assign({},
        post && { post },
        platforms && { platforms },
        profileKeys && { profileKeys: profileKeys.split(",") },
        images_uls && Array.isArray(images_uls) && images_uls.length > 0 && { media_urls: images_uls.map(image => image.url) },
        scheduleDate && { scheduleDate }
    );

    if (images_uls && Array.isArray(images_uls) && images_uls.length > 0) {
        body.media_urls = images_uls.map(image => image.url);
    }

    if (profileKeys) {
        body.profileKeys = profileKeys.split(",");
    }

    const response = await fetch("https://app.ayrshare.com/api/post", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        }
    }).then(res => res.json());

    return response;
};

const table = base.getTable("Posts");
const query = await table.selectRecordsAsync();
const filteredRecords = query.records.filter(record => {
    const status = record.getCellValue('Status');
    const post = record.getCellValue('Post');
    const platforms = record.getCellValue('Platforms');

    return (post && platforms && (status === "pending" || !status));
});

if (filteredRecords.length === 0) {
    console.log("No records found with status `pending` or empty");
}

for (let record of filteredRecords) {
    const post = record.getCellValue('Post');
    const images = record.getCellValue('Images');
    const platforms = record.getCellValue('Platforms');
    const profileKeys = record.getCellValue('Profile Keys');
    const scheduleDate = record.getCellValue('Schedule Date');

    const response = await sendPost(
        {
            post,
            platforms: platforms.map(x => x.name),
            image_urls: images,
            profileKeys,
            scheduleDate,
        });

    if (response) {
        let status;
        if (Array.isArray(response)) {
            status = response.map(x => x.status).every(x => x === "success" || x === "scheduled") ? "success" : "error";
        } else {
            status = response.status;
        }

        console.log(response);

        await table.updateRecordAsync(record, {
            "Status": status
        });
    }
}
