// Type definitions for hls.js
// Project: https://github.com/dailymotion/hls.js
// Definitions by: John G. Gainfort, Jr. <https://github.com/jgainfort>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare function eventCallback(event: any, data: HlsData):  void;

interface HlsFactory {
    new (config?: HlsConfig): Hls;
    /**
     * checks whether your browser is supporting MediaSource Extensions
     */
    isSupported(): boolean;
    /**
     * Hls events
     */
    Events: HlsEvents;
    /**
     * Hls error details
     */
    ErrorDetails: HlsErrorDetails;
  /**
   * Hls error types
   */
    ErrorTypes: HlsErrorTypes;
    /**
     * override Hls default configuration
     * this configuration will be applied by default to all instances
     */
    DefaultConfig: HlsConfig;
    /**
     * returns hls.js dist version number
     */
    version(): number;
}

interface Hls {
    /**
     * calling this method will:
     *      bind videoElement and hls instances
     *      create MediaSource and set it as video source
     *      once MediaSource object is successfully created, MEDIA_ATTACHED event will be fired
     */
    attachMedia(videoElement: HTMLVideoElement): void;
    /**
     * calling this method will:
     *      unbind VideoElement from hls instance
     *      signal the end of the stream on MediaSource
     *      reset video source ( video.src = '' )
     */
    detachMedia(): void;
    /**
     * return array of available quality levels
     */
    levels(): number[];
    /**
     * return current playback quality level
     */
    currentLevel(): number;
    /**
     * trigger an immediate quality level switch to new quality level
     * this will pause the video if it was playing, flush the whole buffer,
     * and fetch fragment matching with current position and requested quality level
     * then resume the video if needed once fetched fragment will have been buffered
     *
     * set to -1 for automatic level selection
     */
    currentLevel(qualityLevel: number): number;
    /**
     * return next playback quality level (playback quality level for next buffered fragment)
     * return -1 if next fragment not buffered yet
     */
    nextLevel(): number;
    /**
     * trigger a quality level switch for next fragment
     * this could eventually flush already buffered next fragment
     *
     * set to -1 for automatic level selection
     */
    nextLevel(qualityLevel: number): number;
    /**
     * return last loaded fragment quality level
     */
    loadLevel(): number;
    /**
     * set quality level for next loaded fragment
     * set to -1 for automatic level selection
     */
    loadLevel(qualityLevel: number): number;
    /**
     * return quality level that will be used to load next fragment
     */
    nextLoadLevel(): number;
    /**
     * force quality level for next loaded fragment
     * quality level will be forced only for that fragment
     * after a fragment at this quality level has been loaded, hls.loadLevel will prevail
     */
    nextLoadLevel(qualityLevel: number): number;
    /**
     * first level index (index of first level appearing in Manifest. it is usually defined as start level hint for player)
     */
    firstLevel(): number;
    /**
     * return start level index (level of first fragment that will be played back)
     *      if not overrided by user: first level appearing in manifest will be used as start level
     *      if -1: automatic start level selection, playback will start from level matching download bandwidth (determined from download of first segment)
     *
     *  default valus is hls.firstLevel
     */
    startLevel(): number;
    /**
     * sets start level index (level of first fragment that will be played back)
     */
    startLevel(index: number): number;
    /**
     * tell whether auto level selection is enabled or not
     */
    autoLevelEnabled(enabled: boolean): boolean;
    /**
     * return capping/max level that could be used by ABR Controller
     */
    autoLevelCapping(): number;
    /**
     * set capping/max level that could be used by ABR Controller
     */
    autoLevelCapping(maxLevel: number): number;
    loadSource(source: string): void;
    /**
     * by default, hls.js will automatically start loading quality level playlists, and fragments after Hls.Events.MANIFEST_PARSED event has been triggered (and video element has been attached)
     * however if config.autoStartLoad is set to false, hls.startLoad() needs to be called to manually start playlist and fragments loading
     *
     * start/restart playlist/fragment loading. this is only effective if MANIFEST_PARSED event has been triggered and video element has been attached to hls object
     * startPosition is the initial position in the playlist
     * ff startPosition is not set to -1, it allows to override default startPosition to the one you want
     * (it will bypass hls.config.liveSync* config params for Live for example, so that user can start playback from whatever position)
     */
    startLoad(startPosition?: number): void;
    /**
     * stop playlist/fragment loading. could be resumed later on by calling hls.startLoad()
     */
    stopLoad(): void;
    /**
     * array of audio tracks exposed in manifest
     */
    audioTracks(): AudioTrack[];
    /**
     * returns audio track id
     */
    audioTrack(): number;
    /**
     * sets audio track id (returned by)
     */
    audioTrack(id: number): number;
    /**
     * position of live sync point (ie edge of live position minus safety delay defined by hls.config.liveSyncDuration)
     */
    liveSyncPosition(): number;
    recoverMediaError(): void;
    swapAudioCodec(): void;
    destroy(): void;
    /**
     * hls.js event listener
     */
    on(event: string, eventCallback): void;
}

interface HlsEvents {
    /**
     * fired to attach Media to hls instance
     * data: { video , mediaSource }
     */
    MEDIA_ATTACHING: string;
    /**
     * fired when Media has been succesfully attached to hls instance
     * data: { video , mediaSource }
     */
    MEDIA_ATTACHED: string;
    /**
     * fired before detaching Media from hls instance
     * data: { }
     */
    MEDIA_DETACHING: string;
    /**
     * fired when Media has been detached from hls instance
     * data: { }
     */
    MEDIA_DETACHED: string;
    /**
     * fired to signal that a manifest loading starts
     * data: { url : manifestURL }
     */
    MANIFEST_LOADING: string;
    /**
     * fired after manifest has been loaded
     * data: { levels : [available quality levels] , audioTracks : [ available audio tracks], url : manifestURL, stats : { trequest, tfirst, tload, mtime}}
     */
    MANIFEST_LOADED: string;
    /**
     * fired after manifest has been parsed
     * data: { levels : [ available quality levels ], firstLevel : index of first quality level appearing in Manifest }
     */
    MANIFEST_PARSED: string;
    /**
     * fired when a level playlist loading starts
     * data: { url : level URL, level : id of level being loaded }
     */
    LEVEL_LOADING: string;
    /**
     * fired when a level playlist loading finishes
     * data: { details : levelDetails object, levelId : id of loaded level, stats : { trequest, tfirst, tload, mtime } }
     */
    LEVEL_LOADED: string;
    /**
     * fired when a level's details have been updated based on previous details, after it has been loaded
     * data: { details : levelDetails object, level : id of updated level }
     */
    LEVEL_UPDATED: string;
    /**
     * fired when a level's PTS information has been updated after parsing a fragment
     * data: { details : levelDetails object, level : id of updated level, drift: PTS drift observed when parsing last fragment }
     */
    LEVEL_PTS_UPDATED: string;
    /**
     * fired when a level switch is requested
     * data: { level : id of new level, it is the index of the array Hls.levels }
     */
    LEVEL_SWITCH: string;
    /**
     * fired when a decryption key loading starts
     * data: { frag : fragment object }
     */
    KEY_LOADING: string;
    /**
     * fired when a decryption key loading is completed
     * data: { frag : fragment object }
     */
    KEY_LOADED: string;
    /**
     * fired when a fragment loading starts
     * data: { frag : fragment object }
     */
    FRAG_LOADING: string;
    /**
     * fired when a fragment load is in progress
     * data: { frag : fragment object with frag.loaded=stats.loaded, stats : { trequest, tfirst, loaded, total } }
     */
    FRAG_LOAD_PROGRESS: string;
    /**
     * fired when a fragment loading is completed
     * data: { frag : fragment object, payload : fragment payload, stats : { trequest, tfirst, tload, length}}
     */
    FRAG_LOADED: string;
    /**
     * fired when Init Segment has been extracted from fragment
     * data: { id: demuxer id, moov : moov MP4 box, codecs : codecs found while parsing fragment}
     */
    FRAG_PARSING_INIT_SEGMENT: string;
    /**
     * fired when parsing id3 is completed
     * data: { id: demuxer id, samples : [ id3 pes - pts and dts timestamp are relative, values are in seconds]}
     */
    FRAG_PARSING_METADATA: string;
    /**
     * fired when moof/mdat have been extracted from fragment
     * data: { id: demuxer id, moof : moof MP4 box, mdat : mdat MP4 box, startPTS : PTS of first sample, endPTS : PTS of last sample, startDTS : DTS of first sample, endDTS : DTS of last sample, type : stream type (audio or video), nb : number of samples}
     */
    FRAG_PARSING_DATA: string;
    /**
     * fired when fragment parsing is completed
     * data: { id: demuxer id}
     */
    FRAG_PARSED: string;
    /**
     * fired when fragment remuxed MP4 boxes have all been appended into SourceBuffer
     * data: { id: demuxer id, frag : fragment object, stats : { trequest, tfirst, tload, tparsed, tbuffered, length} }
     */
    FRAG_BUFFERED: string;
    /**
     * fired when fragment matching with current video position is changing
     * data: { frag : fragment object }
     */
    FRAG_CHANGED: string;
    /**
     * triggered when FPS drop in last monitoring period is higher than given threshold
     * data: { curentDropped : nb of dropped frames in last monitoring period, currentDecoded : nb of decoded frames in last monitoring period, totalDropped : total dropped frames on this video element }
     */
    FPS_DROP: string;
    /**
     * triggered when FPS drop triggers auto level capping
     * data: { level: suggested new auto level capping by fps controller, droppedLevel : level has to much dropped frame will be restricted }
     */
    FPS_DROP_LEVEL_CAPPING: string;
    /**
     *  Identifier for an error event
     * data: { type : error type, details : error details, fatal : is error fatal or not, other error specific data }
     */
    ERROR: string;
    /**
     * fired when hls.js instance starts destroying. Different from MEDIA_DETACHED as one could want to detach and reattach a video to the instance of hls.js to handle mid-rolls for example.
     * data: { }
     */
    DESTROYING: string;
}

interface HlsErrorDetails {
    /**
     * raised when manifest loading fails because of a network error
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.MANIFEST_LOAD_ERROR, fatal : true, url : manifest URL, response : { code: error code, text: error text }, loader : URL loader }
     */
    MANIFEST_LOAD_ERROR: string;
    /**
     * raised when manifest loading fails because of a timeout
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT, fatal : true, url : manifest URL, loader : URL loader }
     */
    MANIFEST_LOAD_TIMEOUT: string;
    /**
     * raised when manifest parsing failed to find proper content
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.MANIFEST_PARSING_ERROR, fatal : true, url : manifest URL, reason : parsing error reason }
     */
    MANIFEST_PARSING_ERROR: string;
    /**
     * raised when level loading fails because of a network error
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.LEVEL_LOAD_ERROR, fatal : true, url : level URL, response : { code: error code, text: error text }, loader : URL loader }
     */
    LEVEL_LOAD_ERROR: string;
    /**
     * raised when level loading fails because of a timeout
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT, fatal : true, url : level URL, loader : URL loader }
     */
    LEVEL_LOAD_TIMEOUT: string;
    /**
     * raised when level switching fails
     * data: { type : OTHER_ERROR, details : Hls.ErrorDetails.LEVEL_SWITCH_ERROR, fatal : false, level : failed level index, reason : failure reason }
     */
    LEVEL_SWITCH_ERROR: string;
    /**
     * raised when fragment loading fails because of a network error
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.FRAG_LOAD_ERROR, fatal : true or false, frag : fragment object, response : { code: error code, text: error text } }
     */
    FRAG_LOAD_ERROR: string;
    /**
     * raised upon detection of same fragment being requested in loop
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR, fatal : true or false, frag : fragment object }
     */
    FRAG_LOOP_LOADING_ERROR: string;
    /**
     * raised when fragment loading fails because of a timeout
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.FRAG_LOAD_TIMEOUT, fatal : true or false, frag : fragment object }
     */
    FRAG_LOAD_TIMEOUT: string;
    /**
     * raised when fragment parsing fails
     * data: { type : NETWORK_ERROR, details : Hls.ErrorDetails.FRAG_PARSING_ERROR, fatal : true or false, reason : failure reason }
     */
    FRAG_PARSING_ERROR: string;
    /**
     * raised when manifest only contains quality level with codecs incompatible with MediaSource Engine.
     * data: { type : MEDIA_ERROR, details : Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR, fatal : true, url : manifest URL }
     */
    MANIFEST_INCOMPATIBLE_CODECS_ERROR: string;
    /**
     *  raised when MediaSource fails to add new sourceBuffer
     * data: { type : MEDIA_ERROR, details : Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR, fatal : false, err : error raised by MediaSource, mimeType: mimeType on which the failure happened }
     */
    BUFFER_ADD_CODEC_ERROR: string;
    /**
     * raised when exception is raised while calling buffer append
     * data: { type : MEDIA_ERROR, details : Hls.ErrorDetails.BUFFER_APPEND_ERROR, fatal : true, frag : fragment object }
     */
    BUFFER_APPEND_ERROR: string;
    /**
     * raised when exception is raised during buffer appending
     * data: { type : MEDIA_ERROR, details : Hls.ErrorDetails.BUFFER_APPENDING_ERROR, fatal : false }
     */
    BUFFER_APPENDING_ERROR: string;
    /**
     * raised when playback is stuck because buffer is running out of data
     * data: { type : MEDIA_ERROR, details : Hls.ErrorDetails.BUFFER_STALLED_ERROR, fatal : false }
     */
    BUFFER_STALLED_ERROR: string;
    /**
     * raised when no data can be appended anymore in media buffer because it is full. this error is recovered automatically by performing a smooth level switching that empty buffers (without disrupting the playback) and reducing the max buffer length.
     * data: { type : MEDIA_ERROR, details : Hls.ErrorDetails.BUFFER_FULL_ERROR, fatal : false }
     */
    BUFFER_FULL_ERROR: string;
    /**
     * raised after hls.js seeks over a buffer hole to unstuck the playback,
     * data: { type : MEDIA_ERROR, details : Hls.ErrorDetails.BUFFER_SEEK_OVER_HOLE, fatal : false, hole : hole duration }
     */
    BUFFER_SEEK_OVER_HOLE: string;
}

interface HlsErrorTypes {
    /**
     * network related errors
     */
    NETWORK_ERROR: string;
    /**
     * media/video related errors
     */
    MEDIA_ERROR: string;
    /**
     * all other erros
     */
    OTHER_ERROR: string;
}

interface HlsConfig {
    /**
     * (default: true)
     * if set to true, start level playlist and first fragments will be loaded automatically, after triggering of Hls.Events.MANIFEST_PARSED event
     * if set to false, an explicit API call (hls.startLoad(startPosition=-1)) will be needed to start quality level/fragment loading.
     */
    autoStartLoad: boolean;
    /**
     * (default -1)
     * if set to -1, playback will start from initialTime=0 for VoD and according to liveSyncDuration/liveSyncDurationCount config params for Live
     * otherwise, playback will start from predefined value. (unless stated otherwise in autoStartLoad=false mode : in that case startPosition can be overrided using hls.startLoad(startPosition)).
     */
    startPosition: number;
    /**
     * (default: false)
     * if set to true, the adaptive algorithm with limit levels usable in auto-quality by the HTML video element dimensions (width and height)
     * if set to false, levels will not be limited. All available levels could be used in auto-quality mode taking only bandwidth into consideration.
     */
    capLevelToPlayerSize: boolean;
    /**
     * (default: false)
     * setting config.debug = true; will turn on debug logs on JS console.
     * a logger object could also be provided for custom logging: config.debug = customLogger;
     */
    debug: boolean;
    /**
     * (default: undefined)
     * if audio codec is not signaled in variant manifest, or if only a stream manifest is provided, hls.js tries to guess audio codec by parsing audio sampling rate in ADTS header. If sampling rate is less or equal than 22050 Hz, then hls.js assumes it is HE-AAC, otherwise it assumes it is AAC-LC. This could result in bad guess, leading to audio decode error, ending up in media error. It is possible to hint default audiocodec to hls.js by configuring this value as below:
     * mp4a.40.2 (AAC-LC) or
     * mp4a.40.5 (HE-AAC) or
     * undefined (guess based on sampling rate)
     */
    defaultAudioCodec: string;
    /**
     * (default: 30 seconds)
     * Maximum buffer length in seconds. If buffer length is/become less than this value, a new fragment will be loaded. This is the guaranteed buffer length hls.js will try to reach, regardless of maxBufferSize.
     */
    maxBufferLength: number;
    /**
     * (default 600s)
     * Maximum buffer length in seconds. Hls.js will never exceed this value, even if maxBufferSize is not reached yet.
     * hls.js tries to buffer up to a maximum number of bytes (60 MB by default) rather than to buffer up to a maximum nb of seconds. this is to mimic the browser behaviour (the buffer eviction algorithm is starting after the browser detects that video buffer size reaches a limit in bytes)
     * maxBufferLength is the minimum guaranteed buffer length that hls.js will try to achieve, even if that value exceeds the amount of bytes 60 MB of memory. maxMaxBufferLength acts as a capping value, as if bitrate is really low, you could need more than one hour of buffer to fill 60 MB.
     */
    maxMaxBufferLenght: number;
    /**
     * (default: 60 MB)
     * 'Minimum' maximum buffer size in bytes. If buffer size upfront is bigger than this value, no fragment will be loaded
     */
    maxBufferSize: number;
    /**
     * (default: 0.5 seconds)
     * 'Maximum' inter-fragment buffer hole tolerance that hls.js can cope with when searching for the next fragment to load. When switching between quality level, fragments might not be perfectly aligned. This could result in small overlapping or hole in media buffer. This tolerance factor helps cope with this.
     */
    maxBufferHole: number;
    /**
     * (default: 2 seconds)
     * In case playback is stalled, and a buffered range is available upfront, less than maxSeekHole seconds from current media position, hls.js will jump over this buffer hole to reach the beginning of this following buffered range. maxSeekHole allows to configure this jumpable threshold.
     */
    maxSeekHole: number;
    /**
     * (default 0.01s)
     * In case playback is still stalling although a seek over buffer hole just occured, hls.js will seek to next buffer start + (number of consecutive stalls * seekHoleNudgeDuration) to try to restore playback.
     */
    seekHoleNudgeDuration: number;
    /**
     * (default 0.2s)
     * This tolerance factor is used during fragment lookup. Instead of checking whether buffered.end is located within [start, end] range, frag lookup will be done by checking within [start-maxFragLookUpTolerance, end-maxFragLookUpTolerance] range.
     * This tolerance factor is used to cope with situations like:
     *      buffered.end = 9.991
     *      frag[0] : [0,10]
     *      frag[1] : [10,20]
     *      buffered.end is within frag[0] range, but as we are close to frag[1], frag[1] should be choosen instead
     * If maxFragLookUpTolerance = 0.2, this lookup will be adjusted to
     *      frag[0] : [-0.2,9.8]
     *      frag[1] : [9.8,19.8]
     *  This time, buffered.end is within frag[1] range, and frag[1] will be the next fragment to be loaded, as expected
     */
    maxFragLookUpTolerance: number;
    /**
     * (default: 3)
     * edge of live delay, expressed in multiple of EXT-X-TARGETDURATION. if set to 3, playback will start from fragment N-3, N being the last fragment of the live playlist. decreasing this value is likely to cause playback stalls.
     */
    liveSyncDurationCount: number;
    /**
     * (default: undefined)
     * Alternative parameter to liveSyncDurationCount, expressed in seconds vs number of segments. If defined in the configuration object, liveSyncDuration will take precedence over the default liveSyncDurationCount. You can't define this parameter and either liveSyncDurationCount or liveMaxLatencyDurationCount in your configuration object at the same time. A value too low (inferior to ~3 segment durations) is likely to cause playback stalls.
     */
    liveSyncDuration: number;
    /**
     * (default: Infinity)
     * maximum delay allowed from edge of live, expressed in multiple of EXT-X-TARGETDURATION. if set to 10, the player will seek back to liveSyncDurationCount whenever the next fragment to be loaded is older than N-10, N being the last fragment of the live playlist. If set, this value must be stricly superior to liveSyncDurationCount a value too close from liveSyncDurationCount is likely to cause playback stalls.
     */
    liveMaxLatencyDurationCount: number;
    /**
     * (default: undefined)
     * Alternative parameter to liveMaxLatencyDurationCount, expressed in seconds vs number of segments. If defined in the configuration object, liveMaxLatencyDuration will take precedence over the default liveMaxLatencyDurationCount. If set, this value must be stricly superior to liveSyncDuration which must be defined as well. You can't define this parameter and either liveSyncDurationCount or liveMaxLatencyDurationCount in your configuration object at the same time. A value too close from liveSyncDuration is likely to cause playback stalls.
     */
    liveMaxLatencyDuration: number;
    /**
     * (default: true)
     * Enable WebWorker (if available on browser) for TS demuxing/MP4 remuxing, to improve performance and avoid lag/frame drops.
     */
    enableWorker: boolean;
    /**
     * (default: true)
     * Enable to use JavaScript version AES decryption for fallback of WebCrypto API.
     */
    enableSoftwareAES: boolean;
    /**
     * (default: 10000ms for level and manifest)
     * URL Loader timeout. A timeout callback will be triggered if loading duration exceeds this timeout. no further action will be done : the load operation will not be cancelled/aborted. It is up to the application to catch this event and treat it as needed.
     */
    manifestLoadingTimeOut: number;
    /**
     * (default: 3)
     * Max number of load retries.
     */
    manifestLoadingMaxRetry: number;
    /**
     * (default: 1000 ms)
     * Initial delay between XMLHttpRequest error and first load retry (in ms). Any I/O error will trigger retries every 500ms,1s,2s,4s,8s, ... capped to fragLoadingMaxRetryTimeout / manifestLoadingMaxRetryTimeout / levelLoadingMaxRetryTimeout value (exponential backoff).
     * Prefetch start fragment although media not attached.
     */
    manifestLoadingRetryDelay: number;
    /**
     * (default: 64000 ms)
     * Maximum frag/manifest/key retry timeout (in milliseconds) in case I/O errors are met.
     */
    manifestLoadingMaxRetryTimeout: number;
    /**
     * (default: 60000ms for fragment)
     * URL Loader timeout. A timeout callback will be triggered if loading duration exceeds this timeout. no further action will be done : the load operation will not be cancelled/aborted. It is up to the application to catch this event and treat it as needed.
     */
    levelLoadingTimeOut: number;
    /**
     * (default: 3)
     * Max number of load retries.
     */
    levelLoadingMaxRetry: number;
    /**
     * (default: 1000 ms)
     * Initial delay between XMLHttpRequest error and first load retry (in ms). Any I/O error will trigger retries every 500ms,1s,2s,4s,8s, ... capped to fragLoadingMaxRetryTimeout / manifestLoadingMaxRetryTimeout / levelLoadingMaxRetryTimeout value (exponential backoff).
     * Prefetch start fragment although media not attached.
     */
    levelLoadingRetryDelay: number;
     /**
     * (default: 64000 ms)
     * Maximum frag/manifest/key retry timeout (in milliseconds) in case I/O errors are met.
     */
    levelLoadingMaxRetryTimeout: number;
    /**
     * (default: 60000ms for fragment)
     * URL Loader timeout. A timeout callback will be triggered if loading duration exceeds this timeout. no further action will be done : the load operation will not be cancelled/aborted. It is up to the application to catch this event and treat it as needed.
     */
    fragLoadingTimeOut: number;
     /**
     * (default: 3)
     * Max number of load retries.
     */
    fragLoadingMaxRetry: number;
    /**
     * (default: 1000 ms)
     * Initial delay between XMLHttpRequest error and first load retry (in ms). Any I/O error will trigger retries every 500ms,1s,2s,4s,8s, ... capped to fragLoadingMaxRetryTimeout / manifestLoadingMaxRetryTimeout / levelLoadingMaxRetryTimeout value (exponential backoff).
     * Prefetch start fragment although media not attached.
     */
    fragLoadingRertryDelay: number;
     /**
     * (default: 64000 ms)
     * Maximum frag/manifest/key retry timeout (in milliseconds) in case I/O errors are met.
     */
    fragLoadingMaxRetryDelay: number;
    /**
     * (default: false)
     * Start prefetching start fragment although media not attached yet. Max number of append retries.
     */
    startFragPrefech: boolean;
    /**
     * (default: 3)
     * Max number of sourceBuffer.appendBuffer() retry upon error. Such error could happen in loop with UHD streams, when internal buffer is full. (Quota Exceeding Error will be triggered). In that case we need to wait for the browser to evict some data before being able to append buffer correctly.
     */
    appendErrorMaxRetry: number;
    /**
     * (default: standard XMLHttpRequest-based URL loader)
     * Override standard URL loader by a custom one. Could be useful for P2P or stubbing (testing).
     * Use this, if you want to overwrite both the fragment and the playlist loader.
     * Note: If fLoader or pLoader are used, they overwrite loader!
     */
    loader: any; // TODO: remove any;
    /**
     * (default: undefined)
     * This enables the manipulation of the fragment loader.
     * Note: This will overwrite the default loader, as well as your own loader function (see above)
     */
    floader: any;  // TODO: remove any;
    /**
     * (default: undefined)
     * This enables the manipulation of the playlist loader.
     * Note: This will overwrite the default loader, as well as your own loader function (see above).
     */
    ploader: any;  // TODO: remove any;
    /**
     * (default: undefined)
     * XMLHttpRequest customization callback for default XHR based loader.
     * Parameter should be a function with two arguments (xhr: XMLHttpRequest, url: string). If xhrSetup is specified, default loader will invoke it before calling xhr.send(). This allows user to easily modify/setup XHR. See example below.
     */
    xhrSetup: any;  // TODO: remove any;
    /**
     * (default: undefined)Fetch customization callback for Fetch based loader.
     * Parameter should be a function with two arguments (context and Request Init Params). If fetchSetup is specified and Fetch loader is used, fetchSetup will be triggered to instantiate Request Object. This allows user to easily tweak Fetch loader. See example below.
     */
    fetchSetup: any  // TODO: remove any;
    /**
     * (default: internal ABR controller)
     * Customized Adaptive Bitrate Streaming Controller.
     * Parameter should be a class providing 2 getters, 2 setters and a destroy() method:
     * get/set nextAutoLevel: return next auto-quality level/force next auto-quality level that should be returned (currently used for emergency switch down)
     * get/set autoLevelCapping: capping/max level value that could be used by ABR Controller
     * destroy(): should clean-up all used resources
     */
    abrController: any;  // TODO: remove any;
    /**
     *  (default: internal track timeline controller)
     * Customized text track syncronization controller.
     * Parameter should be a class with a destroy() method:
     * destroy() : should clean-up all used resources
     */
    timelineController: any;  // TODO: remove any;
    /**
     * (default: true)
     * whether or not to enable CEA-708 captions
     */
    enableCEA708Captions: boolean;
    /**
     * (default: false)
     * If a segment's video track is shorter than its audio track by > min(maxSeekHole, maxBufferHole), extend the final video frame's duration to match the audio track's duration. This helps playback continue in certain cases that might otherwise get stuck.
     */
    stretchShortVideoTrack: boolean;
    /**
     * (default: true)
     * Whether or not to force having a key frame in the first AVC sample after a discontinuity. If set to true, after a discontinuity, the AVC samples without any key frame will be dropped until finding one that contains a key frame. If set to false, all AVC samples will be kept, which can help avoid holes in the stream. Setting this parameter to false can also generate decoding weirdness when switching level or seeking.
     */
    forceKeyFrameOnDiscontinuity: boolean;
    /**
     * (default: 5.0)
     * Fast bitrate Exponential moving average half-life, used to compute average bitrate for Live streams. Half of the estimate is based on the last abrEwmaFastLive seconds of sample history. Each of the sample is weighted by the fragment loading duration.
     * parameter should be a float greater than 0
     */
    abrEwmaFastLive: number;
    /**
     * (default: 9.0)
     * Slow bitrate Exponential moving average half-life, used to compute average bitrate for Live streams. Half of the estimate is based on the last abrEwmaSlowLive seconds of sample history. Each of the sample is weighted by the fragment loading duration.
     * parameter should be a float greater than abrEwmaFastLive
     */
    arbEwmaSlowLive: number;
    /**
     * (default: 4.0)
     * Fast bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams. Half of the estimate is based on the last abrEwmaFastVoD seconds of sample history. Each of the sample is weighted by the fragment loading duration.
     * parameter should be a float greater than 0
     */
    arbEwmaFastVod: number;
    /**
     * (default: 15.0)
     * Slow bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams. Half of the estimate is based on the last abrEwmaSlowVoD seconds of sample history. Each of the sample is weighted by the fragment loading duration.
     * parameter should be a float greater than abrEwmaFastVoD
     */
    arbEwmaSlowVod: number;
    /**
     * (default: 500000)
     * Default bandwidth estimate in bits/second prior to collecting fragment bandwidth samples.
     * parameter should be a float
     */
    arbEwmaDefaultEstimate: number;
    /**
     * (default: 0.8)
     * Scale factor to be applied against measured bandwidth average, to determine whether we can stay on current or lower quality level. If abrBandWidthFactor * bandwidth average < level.bitrate then ABR can switch to that level providing that it is equal or less than current level.
     */
    arbBandWidthFactor: number;
    /**
     * (default: 0.7)
     * Scale factor to be applied against measured bandwidth average, to determine whether we can switch up to a higher quality level. If abrBandWidthUpFactor * bandwidth average < level.bitrate then ABR can switch up to that quality level.
     */
    arbBandWidthUpFactor: number;
}

interface HlsData {
    /**
     * videoElement
     */
    video?: HTMLVideoElement;
    /**
     * media source
     */
    mediaSource?: string;
    /**
     * manifest url
     */
    url?: string;
    /**
     * available quality levels
     */
    levels?: number[];
    /**
     * available audio tracks
     */
    audioTracks?: AudioTrack[];
    /**
     * XMLHttp request stats
     */
    stats?: HlsStats;
    /**
     * index of first quality level appearing in Manifest
     */
    firstLevel?: number;
    /**
     * id of updated level
     */
    level?: number;
    /**
     * levelDetails object
     */
    details?: LevelDetails;
    /**
     * PTS drift observed when parsing last fragment
     */
    drift?: number;
    /**
     * fragment object with frag.loaded=stats.loaded
     */
    frag?: Fragment;
    /**
     * fragment payload
     */
    payload?: any; // TODO: what is the payload?
    /**
     * id of level or demuxer
     */
    id?: number;
    /**
     * moof MP4 box
     */
    moof?: any; // TODO: whats is the moof?
    /**
     * mdat MP4 box
     */
    mdat?: any; // TODO: what is mdat?
    /**
     * PTS of first sample
     */
    startPTS?: number;
    /**
     * PTS of last sample
     */
    endPTS?: number;
    /**
     * DTS of first sample
     */
    startDTS?: number;
    /**
     * DTS of last sample
     */
    endDTS?: number;
    /**
     * stream type (audio or video)
     */
    type?: string;
    /**
     * number of samples
     */
    nb?: number;
    /**
     * number of dropped frames in last monitoring period
     */
    currentDropped?: number;
    /**
     * number of decoded frames in last monitoring period
     */
    currentDecode?: number;
    /**
     * total dropped frames on this video element
     */
    totalDropped?: number;
    /**
     * level has to much dropped frame will be restricted
     */
    droppedLevel?: number;
    /**
     * is error fatal or not.
     * if error is not fatal, hls.js will try to recover it
     * if error is fatal, an action is required to (try to) recover it
     */
    fatal?: boolean;
}

interface HlsStats {
    /**
     * performance.now() just after load() has been called
     */
    trequest: number;
    /**
     * performance.now() of first received byte
     */
    tfirst: number;
    /**
     * performance.now() on load complete
     */
    tload: number;
    mtime: number;
    tbuffered?: number;
    length?: number;
}

/**
 * a Level object represents a given quality level and contains quality level related info
 */
interface Level {
    /**
     * level url. might contain sever items if failover/redundant streams are found in the manifest
     */
    url: string[];
    /**
     * level bitrate
     */
    bitrate: number;
    /**
     * level name
     */
    name: string;
    /**
     * used codecs
     */
    codecs: string;
    /**
     * video width
     */
    width: number;
    /**
     * video height
     */
    height: number;
}

/**
 * a LevelDetails object contains level details retrieved after level playlist parsing
 */
interface LevelDetails {
    /**
     * protocol version
     */
    version: number;
    /**
     * playlist type
     */
    type: string;
    /**
     * start sequence number
     */
    startSN: number;
    /**
     * end sequence number
     */
    endSN: number;
    /**
     * level total duration
     */
    totalDuration: number;
    /**
     * level fragment target duration
     */
    targetDuration: number;
    /**
     * array of fragments info
     */
    fragments: Fragment[];
    /**
     * is this level a live playlist or not?
     */
    live: boolean;
}

/**
 * the Fragment object contains fragment related info
 */
interface Fragment {
    /**
     * fragment duration
     */
    duration: number;
    /**
     * fragment level identifier
     */
    level: number;
    /**
     * fragment sequence number
     */
    sn: number;
    /**
     * fragment start offset
     */
    start: number;
    /**
     * fragment url
     */
    url: string;
}

declare var Hls: HlsFactory;

declare module 'hlsjs' {
  export = Hls;
}
