// @ts-check
import { defineDb } from 'astro:db';
import { ContactMessages } from './src/db/schema';

// https://astro.build/db/config
export default defineDb({
  tables: {
    contactMessages: ContactMessages
  }
});
