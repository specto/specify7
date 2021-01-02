"use strict";

class cache {

	private static buckets :buckets = {};  // the data structure that would store all of the buckets
	private static readonly cache_prefix :string = 'specify7_wbplanview_';  // the prefix that would be given to all bucket_names when they are committed to localStorage. Used to avoid collisions
	private static readonly local_storage_bucket_soft_limit :number = 100;  // start trimming a bucket if there are more than local_storage_bucket_soft_limit records in a bucket
	private static readonly session_storage_bucket_soft_limit :number = 100;  // start trimming a bucket if there are more than local_storage_bucket_soft_limit records in a bucket
	private static readonly trim_aggresivnes :number = 0.5;  // between 0 and 1 - decides the minimum passing cache usage
	private static event_listener_is_initialized :boolean = false;  // indicates whether initialize() was run. If not, runs it on the next call to get() or set()

	/* Set's an event listener that runs commit_to_storage before page unload */
	private static initialize() :void {

		window.onbeforeunload = cache.commit_to_storage;
		cache.event_listener_is_initialized = true;

	};

	/* Commits persistent cache buckets to localStorage */
	private static commit_to_storage() :void {

		if (typeof localStorage === "undefined")
			return;

		for (const [bucket_name, bucket_data] of Object.entries(cache.buckets))
			if (
				bucket_data.type === 'local_storage' &&
				Object.keys(bucket_data.records).length !== 0
			) {
				const full_bucket_name = cache.cache_prefix + bucket_name;
				localStorage.setItem(full_bucket_name, JSON.stringify(bucket_data));
			}

	};

	/* Tries to fetch a bucket from localStorage */
	private static fetch_bucket(
		bucket_name :string  // the name of the bucket to fetch
	) :bucket_data | false
	/*
	* {boolean} False if bucket does not exist
	* {object} bucket content if bucket exists
	* */ {

		const full_bucket_name = cache.cache_prefix + bucket_name;

		const local_storage_data = localStorage.getItem(full_bucket_name);
		if (local_storage_data === null)
			return false;

		return cache.buckets[bucket_name] = JSON.parse(local_storage_data);

	};

	/* Get value of cache_name in the bucket_name */
	public static get(
		bucket_name :string,  // the name of the bucket
		cache_name :string  // the name of the cache
	) :any
	/*
	 * {boolean} False on error
	 * {mixed} value stored under cache_name on success
	 * */ {

		if (!cache.event_listener_is_initialized)
			cache.initialize();

		if (
			(
				typeof cache.buckets[bucket_name] === "undefined" &&
				!cache.fetch_bucket(bucket_name)
			) ||
			typeof cache.buckets[bucket_name].records[cache_name] === "undefined"
		)
			return false;

		else {

			cache.buckets[bucket_name].records[cache_name].use_count++;

			return cache.buckets[bucket_name].records[cache_name].value;

		}

	};

	/* Set's cache_value as cache value under cache_name in bucket_name */
	public static set(
		bucket_name :string,  // the name of the bucket
		cache_name :string,  // the name of the cache
		cache_value :any,  // the value of the cache. Can be any object that can be converted to json
		{
			bucket_type = 'local_storage',
			overwrite = false,
		} :set_parameters = {}
	) :void {

		if (!cache.event_listener_is_initialized)
			cache.initialize();

		if (typeof cache.buckets[bucket_name] === "undefined") {
			cache.buckets[bucket_name] = {
				type: bucket_type,
				records: {},
			};
		}

		if (!overwrite && typeof cache.buckets[bucket_name].records[cache_name] !== "undefined")
			return;

		cache.buckets[bucket_name].records[cache_name] = {
			value: cache_value,
			use_count: 0,
		};

		cache.trim_bucket(bucket_name);

	};

	/*
	* Trims buckets that go beyond the size limit
	* Runs every time you set a new cache value
	* This method is needed to prevent memory leaks and stay under browser memory limit - ~5MB for Google Chrome ;(
	* */
	private static trim_bucket(
		bucket_name :string  // the bucket to trim
	) :boolean {

		// don't trim cache if the number of records in this bucket is smaller than soft limits
		if (
			(
				cache.buckets[bucket_name].type === 'local_storage' &&
				Object.keys(cache.buckets[bucket_name].records).length < cache.local_storage_bucket_soft_limit
			) ||
			(
				cache.buckets[bucket_name].type === 'session_storage' &&
				Object.keys(cache.buckets[bucket_name].records).length < cache.session_storage_bucket_soft_limit
			)
		)
			return false;

		const cache_usages = Object.values(cache.buckets[bucket_name].records).map(({use_count}) => use_count);
		const total_usage = cache_usages.reduce((total_usage :number, usage :any) =>
			total_usage + parseInt(usage),
			0
		);
		const cache_items_count = cache_usages.length;
		const average_usage = total_usage / cache_items_count;

		// trim all caches with usage equal to or smaller than usage_to_trim
		let usage_to_trim = Math.round(average_usage * cache.trim_aggresivnes);

		if (usage_to_trim === 0)
			usage_to_trim = 1;

		const cache_keys = Object.keys(cache.buckets[bucket_name].records);
		const new_records :bucket_records = {};
		for (const [cache_index, cache_usage] of Object.entries(cache_usages)) {

			const cache_key = cache_keys[parseInt(cache_index)];

			if (cache_usage >= usage_to_trim)
				new_records[cache_key] = cache.buckets[bucket_name].records[cache_key];

		}
		cache.buckets[bucket_name].records = new_records;

		return true;

	};

	/* Cleans app all of the buckets */
	public static wipe_all() :void {

		cache.buckets = {};
		localStorage.clear();

	};

}

export = cache;