import { Schema } from "@powersync/web";
import { users } from "./identity/db";

export const AppSchema = new Schema({
	users
});

export type Database = (typeof AppSchema)['types'];
