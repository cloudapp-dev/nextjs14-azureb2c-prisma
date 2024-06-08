import { contentfulCMAClient } from "./contentfulClientCma";
import contentfulClient from "./contentfulClient";

const LOCALE = "en-US";
const ENVIRONMENT_ID = "master";
const CONTENT_TYPE_ID = "user";
const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN } = process.env;

const client = contentfulClient({ preview: true });

const updateUser = async (id: string, logins: number) => {
  try {
    const space = await contentfulCMAClient.getSpace(CONTENTFUL_SPACE_ID || "");
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    let entry = await environment.getEntry(id);

    const updatedFields = { logins: logins + 1, lastLogin: new Date() };

    // Update the entry fields
    Object.keys(updatedFields).forEach((field: any) => {
      entry.fields[field]["en-US"] = updatedFields[field];
    });

    // Save and publish the changes
    const entryupdate = await entry.update();
    const entrypublish = await entryupdate.publish();

    return {
      message: "Entry updated and published successfully",
    };
  } catch (error) {
    console.error("Error updating entry:", error);
    return {
      error: "Internal Server Error",
    };
  }
};

const createAndPublishUser = async (email: string, name: string) => {
  try {
    const space = await contentfulCMAClient.getSpace(CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    let entry = await environment.createEntry(CONTENT_TYPE_ID, {
      fields: {
        email: {
          [LOCALE]: email,
        },
        name: { [LOCALE]: name },
        logins: { [LOCALE]: 1 },
        lastLogin: { [LOCALE]: new Date() },
      },
    });

    // Publish the changes
    const entrypublish = await entry.publish();

    return {
      message: "Entry created and published successfully",
    };
  } catch (error) {
    console.error("Error creating entry:", error);
    return {
      error: "Internal Server Error",
    };
  }
};

export const getOrCreateUserContentful = async (
  email: string,
  name: string
) => {
  const user = await client.getEntries({
    content_type: CONTENT_TYPE_ID,
    "fields.email[match]": email,
  });

  if (user.total === 1) {
    const preCount = user.items[0].fields.logins;
    updateUser(user.items[0].sys.id, Number(preCount));
    return {
      id: user.items[0].sys.id,
      email,
      name,
    };
  }

  return createAndPublishUser(email, name);
};
