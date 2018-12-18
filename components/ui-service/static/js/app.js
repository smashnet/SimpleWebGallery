(function () {
'use strict';

if(typeof global === "undefined" && typeof window !== "undefined") {
	window.global = window;
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dropzone = createCommonjsModule(function (module) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// The Emitter class provides the ability to call `.on()` on Dropzone to listen
// to events.
// It is strongly based on component's emitter class, and I removed the
// functionality because of the dependency hell with different frameworks.
var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);
  }

  _createClass(Emitter, [{
    key: "on",

    // Add an event listener for given event
    value: function on(event, fn) {
      this._callbacks = this._callbacks || {};
      // Create namespace for this event
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      this._callbacks = this._callbacks || {};
      var callbacks = this._callbacks[event];

      if (callbacks) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        for (var _iterator = callbacks, _isArray = true, _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          }

          var callback = _ref;

          callback.apply(this, args);
        }
      }

      return this;
    }

    // Remove event listener for given event. If fn is not provided, all event
    // listeners for that event will be removed. If neither is provided, all
    // event listeners will be removed.

  }, {
    key: "off",
    value: function off(event, fn) {
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }

      // remove all handlers
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }

      // remove specific handler
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      return this;
    }
  }]);

  return Emitter;
}();

var Dropzone = function (_Emitter) {
  _inherits(Dropzone, _Emitter);

  _createClass(Dropzone, null, [{
    key: "initClass",
    value: function initClass() {

      // Exposing the emitter class, mainly for tests
      this.prototype.Emitter = Emitter;

      /*
       This is a list of all available events you can register on a dropzone object.
        You can register an event handler like this:
        dropzone.on("dragEnter", function() { });
        */
      this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

      this.prototype.defaultOptions = {
        /**
         * Has to be specified on elements other than form (or when the form
         * doesn't have an `action` attribute). You can also
         * provide a function that will be called with `files` and
         * must return the url (since `v3.12.0`)
         */
        url: null,

        /**
         * Can be changed to `"put"` if necessary. You can also provide a function
         * that will be called with `files` and must return the method (since `v3.12.0`).
         */
        method: "post",

        /**
         * Will be set on the XHRequest.
         */
        withCredentials: false,

        /**
         * The timeout for the XHR requests in milliseconds (since `v4.4.0`).
         */
        timeout: 30000,

        /**
         * How many file uploads to process in parallel (See the
         * Enqueuing file uploads* documentation section for more info)
         */
        parallelUploads: 2,

        /**
         * Whether to send multiple files in one request. If
         * this it set to true, then the fallback file input element will
         * have the `multiple` attribute as well. This option will
         * also trigger additional events (like `processingmultiple`). See the events
         * documentation section for more information.
         */
        uploadMultiple: false,

        /**
         * Whether you want files to be uploaded in chunks to your server. This can't be
         * used in combination with `uploadMultiple`.
         *
         * See [chunksUploaded](#config-chunksUploaded) for the callback to finalise an upload.
         */
        chunking: false,

        /**
         * If `chunking` is enabled, this defines whether **every** file should be chunked,
         * even if the file size is below chunkSize. This means, that the additional chunk
         * form data will be submitted and the `chunksUploaded` callback will be invoked.
         */
        forceChunking: false,

        /**
         * If `chunking` is `true`, then this defines the chunk size in bytes.
         */
        chunkSize: 2000000,

        /**
         * If `true`, the individual chunks of a file are being uploaded simultaneously.
         */
        parallelChunkUploads: false,

        /**
         * Whether a chunk should be retried if it fails.
         */
        retryChunks: false,

        /**
         * If `retryChunks` is true, how many times should it be retried.
         */
        retryChunksLimit: 3,

        /**
         * If not `null` defines how many files this Dropzone handles. If it exceeds,
         * the event `maxfilesexceeded` will be called. The dropzone element gets the
         * class `dz-max-files-reached` accordingly so you can provide visual feedback.
         */
        maxFilesize: 256,

        /**
         * The name of the file param that gets transferred.
         * **NOTE**: If you have the option  `uploadMultiple` set to `true`, then
         * Dropzone will append `[]` to the name.
         */
        paramName: "file",

        /**
         * Whether thumbnails for images should be generated
         */
        createImageThumbnails: true,

        /**
         * In MB. When the filename exceeds this limit, the thumbnail will not be generated.
         */
        maxThumbnailFilesize: 10,

        /**
         * If `null`, the ratio of the image will be used to calculate it.
         */
        thumbnailWidth: 120,

        /**
         * The same as `thumbnailWidth`. If both are null, images will not be resized.
         */
        thumbnailHeight: 120,

        /**
         * How the images should be scaled down in case both, `thumbnailWidth` and `thumbnailHeight` are provided.
         * Can be either `contain` or `crop`.
         */
        thumbnailMethod: 'crop',

        /**
         * If set, images will be resized to these dimensions before being **uploaded**.
         * If only one, `resizeWidth` **or** `resizeHeight` is provided, the original aspect
         * ratio of the file will be preserved.
         *
         * The `options.transformFile` function uses these options, so if the `transformFile` function
         * is overridden, these options don't do anything.
         */
        resizeWidth: null,

        /**
         * See `resizeWidth`.
         */
        resizeHeight: null,

        /**
         * The mime type of the resized image (before it gets uploaded to the server).
         * If `null` the original mime type will be used. To force jpeg, for example, use `image/jpeg`.
         * See `resizeWidth` for more information.
         */
        resizeMimeType: null,

        /**
         * The quality of the resized images. See `resizeWidth`.
         */
        resizeQuality: 0.8,

        /**
         * How the images should be scaled down in case both, `resizeWidth` and `resizeHeight` are provided.
         * Can be either `contain` or `crop`.
         */
        resizeMethod: 'contain',

        /**
         * The base that is used to calculate the filesize. You can change this to
         * 1024 if you would rather display kibibytes, mebibytes, etc...
         * 1024 is technically incorrect, because `1024 bytes` are `1 kibibyte` not `1 kilobyte`.
         * You can change this to `1024` if you don't care about validity.
         */
        filesizeBase: 1000,

        /**
         * Can be used to limit the maximum number of files that will be handled by this Dropzone
         */
        maxFiles: null,

        /**
         * An optional object to send additional headers to the server. Eg:
         * `{ "My-Awesome-Header": "header value" }`
         */
        headers: null,

        /**
         * If `true`, the dropzone element itself will be clickable, if `false`
         * nothing will be clickable.
         *
         * You can also pass an HTML element, a CSS selector (for multiple elements)
         * or an array of those. In that case, all of those elements will trigger an
         * upload when clicked.
         */
        clickable: true,

        /**
         * Whether hidden files in directories should be ignored.
         */
        ignoreHiddenFiles: true,

        /**
         * The default implementation of `accept` checks the file's mime type or
         * extension against this list. This is a comma separated list of mime
         * types or file extensions.
         *
         * Eg.: `image/*,application/pdf,.psd`
         *
         * If the Dropzone is `clickable` this option will also be used as
         * [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept)
         * parameter on the hidden file input as well.
         */
        acceptedFiles: null,

        /**
         * **Deprecated!**
         * Use acceptedFiles instead.
         */
        acceptedMimeTypes: null,

        /**
         * If false, files will be added to the queue but the queue will not be
         * processed automatically.
         * This can be useful if you need some additional user input before sending
         * files (or if you want want all files sent at once).
         * If you're ready to send the file simply call `myDropzone.processQueue()`.
         *
         * See the [enqueuing file uploads](#enqueuing-file-uploads) documentation
         * section for more information.
         */
        autoProcessQueue: true,

        /**
         * If false, files added to the dropzone will not be queued by default.
         * You'll have to call `enqueueFile(file)` manually.
         */
        autoQueue: true,

        /**
         * If `true`, this will add a link to every file preview to remove or cancel (if
         * already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation`
         * and `dictRemoveFile` options are used for the wording.
         */
        addRemoveLinks: false,

        /**
         * Defines where to display the file previews – if `null` the
         * Dropzone element itself is used. Can be a plain `HTMLElement` or a CSS
         * selector. The element should have the `dropzone-previews` class so
         * the previews are displayed properly.
         */
        previewsContainer: null,

        /**
         * This is the element the hidden input field (which is used when clicking on the
         * dropzone to trigger file selection) will be appended to. This might
         * be important in case you use frameworks to switch the content of your page.
         *
         * Can be a selector string, or an element directly.
         */
        hiddenInputContainer: "body",

        /**
         * If null, no capture type will be specified
         * If camera, mobile devices will skip the file selection and choose camera
         * If microphone, mobile devices will skip the file selection and choose the microphone
         * If camcorder, mobile devices will skip the file selection and choose the camera in video mode
         * On apple devices multiple must be set to false.  AcceptedFiles may need to
         * be set to an appropriate mime type (e.g. "image/*", "audio/*", or "video/*").
         */
        capture: null,

        /**
         * **Deprecated**. Use `renameFile` instead.
         */
        renameFilename: null,

        /**
         * A function that is invoked before the file is uploaded to the server and renames the file.
         * This function gets the `File` as argument and can use the `file.name`. The actual name of the
         * file that gets used during the upload can be accessed through `file.upload.filename`.
         */
        renameFile: null,

        /**
         * If `true` the fallback will be forced. This is very useful to test your server
         * implementations first and make sure that everything works as
         * expected without dropzone if you experience problems, and to test
         * how your fallbacks will look.
         */
        forceFallback: false,

        /**
         * The text used before any files are dropped.
         */
        dictDefaultMessage: "Drop files here to upload",

        /**
         * The text that replaces the default message text it the browser is not supported.
         */
        dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",

        /**
         * The text that will be added before the fallback form.
         * If you provide a  fallback element yourself, or if this option is `null` this will
         * be ignored.
         */
        dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",

        /**
         * If the filesize is too big.
         * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
         */
        dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",

        /**
         * If the file doesn't match the file type.
         */
        dictInvalidFileType: "You can't upload files of this type.",

        /**
         * If the server response was invalid.
         * `{{statusCode}}` will be replaced with the servers status code.
         */
        dictResponseError: "Server responded with {{statusCode}} code.",

        /**
         * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
         */
        dictCancelUpload: "Cancel upload",

        /**
         * The text that is displayed if an upload was manually canceled
         */
        dictUploadCanceled: "Upload canceled.",

        /**
         * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
         */
        dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",

        /**
         * If `addRemoveLinks` is true, the text to be used to remove a file.
         */
        dictRemoveFile: "Remove file",

        /**
         * If this is not null, then the user will be prompted before removing a file.
         */
        dictRemoveFileConfirmation: null,

        /**
         * Displayed if `maxFiles` is st and exceeded.
         * The string `{{maxFiles}}` will be replaced by the configuration value.
         */
        dictMaxFilesExceeded: "You can not upload any more files.",

        /**
         * Allows you to translate the different units. Starting with `tb` for terabytes and going down to
         * `b` for bytes.
         */
        dictFileSizeUnits: { tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b" },
        /**
         * Called when dropzone initialized
         * You can add event listeners here
         */
        init: function init() {},


        /**
         * Can be an **object** of additional parameters to transfer to the server, **or** a `Function`
         * that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case
         * of a function, this needs to return a map.
         *
         * The default implementation does nothing for normal uploads, but adds relevant information for
         * chunked uploads.
         *
         * This is the same as adding hidden input fields in the form element.
         */
        params: function params(files, xhr, chunk) {
          if (chunk) {
            return {
              dzuuid: chunk.file.upload.uuid,
              dzchunkindex: chunk.index,
              dztotalfilesize: chunk.file.size,
              dzchunksize: this.options.chunkSize,
              dztotalchunkcount: chunk.file.upload.totalChunkCount,
              dzchunkbyteoffset: chunk.index * this.options.chunkSize
            };
          }
        },


        /**
         * A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)
         * and a `done` function as parameters.
         *
         * If the done function is invoked without arguments, the file is "accepted" and will
         * be processed. If you pass an error message, the file is rejected, and the error
         * message will be displayed.
         * This function will not be called if the file is too big or doesn't match the mime types.
         */
        accept: function accept(file, done) {
          return done();
        },


        /**
         * The callback that will be invoked when all chunks have been uploaded for a file.
         * It gets the file for which the chunks have been uploaded as the first parameter,
         * and the `done` function as second. `done()` needs to be invoked when everything
         * needed to finish the upload process is done.
         */
        chunksUploaded: function chunksUploaded(file, done) {
          done();
        },

        /**
         * Gets called when the browser is not supported.
         * The default implementation shows the fallback input field and adds
         * a text.
         */
        fallback: function fallback() {
          // This code should pass in IE7... :(
          var messageElement = void 0;
          this.element.className = this.element.className + " dz-browser-not-supported";

          for (var _iterator2 = this.element.getElementsByTagName("div"), _isArray2 = true, _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            }

            var child = _ref2;

            if (/(^| )dz-message($| )/.test(child.className)) {
              messageElement = child;
              child.className = "dz-message"; // Removes the 'dz-default' class
              break;
            }
          }
          if (!messageElement) {
            messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
            this.element.appendChild(messageElement);
          }

          var span = messageElement.getElementsByTagName("span")[0];
          if (span) {
            if (span.textContent != null) {
              span.textContent = this.options.dictFallbackMessage;
            } else if (span.innerText != null) {
              span.innerText = this.options.dictFallbackMessage;
            }
          }

          return this.element.appendChild(this.getFallbackForm());
        },


        /**
         * Gets called to calculate the thumbnail dimensions.
         *
         * It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:
         *
         *  - `srcWidth` & `srcHeight` (required)
         *  - `trgWidth` & `trgHeight` (required)
         *  - `srcX` & `srcY` (optional, default `0`)
         *  - `trgX` & `trgY` (optional, default `0`)
         *
         * Those values are going to be used by `ctx.drawImage()`.
         */
        resize: function resize(file, width, height, resizeMethod) {
          var info = {
            srcX: 0,
            srcY: 0,
            srcWidth: file.width,
            srcHeight: file.height
          };

          var srcRatio = file.width / file.height;

          // Automatically calculate dimensions if not specified
          if (width == null && height == null) {
            width = info.srcWidth;
            height = info.srcHeight;
          } else if (width == null) {
            width = height * srcRatio;
          } else if (height == null) {
            height = width / srcRatio;
          }

          // Make sure images aren't upscaled
          width = Math.min(width, info.srcWidth);
          height = Math.min(height, info.srcHeight);

          var trgRatio = width / height;

          if (info.srcWidth > width || info.srcHeight > height) {
            // Image is bigger and needs rescaling
            if (resizeMethod === 'crop') {
              if (srcRatio > trgRatio) {
                info.srcHeight = file.height;
                info.srcWidth = info.srcHeight * trgRatio;
              } else {
                info.srcWidth = file.width;
                info.srcHeight = info.srcWidth / trgRatio;
              }
            } else if (resizeMethod === 'contain') {
              // Method 'contain'
              if (srcRatio > trgRatio) {
                height = width / srcRatio;
              } else {
                width = height * srcRatio;
              }
            } else {
              throw new Error("Unknown resizeMethod '" + resizeMethod + "'");
            }
          }

          info.srcX = (file.width - info.srcWidth) / 2;
          info.srcY = (file.height - info.srcHeight) / 2;

          info.trgWidth = width;
          info.trgHeight = height;

          return info;
        },


        /**
         * Can be used to transform the file (for example, resize an image if necessary).
         *
         * The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes
         * images according to those dimensions.
         *
         * Gets the `file` as the first parameter, and a `done()` function as the second, that needs
         * to be invoked with the file when the transformation is done.
         */
        transformFile: function transformFile(file, done) {
          if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) {
            return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);
          } else {
            return done(file);
          }
        },


        /**
         * A string that contains the template used for each dropped
         * file. Change it to fulfill your needs but make sure to properly
         * provide all elements.
         *
         * If you want to use an actual HTML element instead of providing a String
         * as a config option, you could create a div with the id `tpl`,
         * put the template inside it and provide the element like this:
         *
         *     document
         *       .querySelector('#tpl')
         *       .innerHTML
         *
         */
        previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>",

        // END OPTIONS
        // (Required by the dropzone documentation parser)


        /*
         Those functions register themselves to the events on init and handle all
         the user interface specific stuff. Overwriting them won't break the upload
         but can break the way it's displayed.
         You can overwrite them if you don't like the default behavior. If you just
         want to add an additional event handler, register it on the dropzone object
         and don't overwrite those options.
         */

        // Those are self explanatory and simply concern the DragnDrop.
        drop: function drop(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        dragstart: function dragstart(e) {},
        dragend: function dragend(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        dragenter: function dragenter(e) {
          return this.element.classList.add("dz-drag-hover");
        },
        dragover: function dragover(e) {
          return this.element.classList.add("dz-drag-hover");
        },
        dragleave: function dragleave(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        paste: function paste(e) {},


        // Called whenever there are no files left in the dropzone anymore, and the
        // dropzone should be displayed as if in the initial state.
        reset: function reset() {
          return this.element.classList.remove("dz-started");
        },


        // Called when a file is added to the queue
        // Receives `file`
        addedfile: function addedfile(file) {
          var _this2 = this;

          if (this.element === this.previewsContainer) {
            this.element.classList.add("dz-started");
          }

          if (this.previewsContainer) {
            file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
            file.previewTemplate = file.previewElement; // Backwards compatibility

            this.previewsContainer.appendChild(file.previewElement);
            for (var _iterator3 = file.previewElement.querySelectorAll("[data-dz-name]"), _isArray3 = true, _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
              var _ref3;

              {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
              }

              var node = _ref3;

              node.textContent = file.name;
            }
            for (var _iterator4 = file.previewElement.querySelectorAll("[data-dz-size]"), _isArray4 = true, _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
              {
                if (_i4 >= _iterator4.length) break;
                node = _iterator4[_i4++];
              }

              node.innerHTML = this.filesize(file.size);
            }

            if (this.options.addRemoveLinks) {
              file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
              file.previewElement.appendChild(file._removeLink);
            }

            var removeFileEvent = function removeFileEvent(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this2.options.dictCancelUploadConfirmation, function () {
                  return _this2.removeFile(file);
                });
              } else {
                if (_this2.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this2.options.dictRemoveFileConfirmation, function () {
                    return _this2.removeFile(file);
                  });
                } else {
                  return _this2.removeFile(file);
                }
              }
            };

            for (var _iterator5 = file.previewElement.querySelectorAll("[data-dz-remove]"), _isArray5 = true, _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
              var _ref4;

              {
                if (_i5 >= _iterator5.length) break;
                _ref4 = _iterator5[_i5++];
              }

              var removeLink = _ref4;

              removeLink.addEventListener("click", removeFileEvent);
            }
          }
        },


        // Called whenever a file is removed.
        removedfile: function removedfile(file) {
          if (file.previewElement != null && file.previewElement.parentNode != null) {
            file.previewElement.parentNode.removeChild(file.previewElement);
          }
          return this._updateMaxFilesReachedClass();
        },


        // Called when a thumbnail has been generated
        // Receives `file` and `dataUrl`
        thumbnail: function thumbnail(file, dataUrl) {
          if (file.previewElement) {
            file.previewElement.classList.remove("dz-file-preview");
            for (var _iterator6 = file.previewElement.querySelectorAll("[data-dz-thumbnail]"), _isArray6 = true, _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
              var _ref5;

              {
                if (_i6 >= _iterator6.length) break;
                _ref5 = _iterator6[_i6++];
              }

              var thumbnailElement = _ref5;

              thumbnailElement.alt = file.name;
              thumbnailElement.src = dataUrl;
            }

            return setTimeout(function () {
              return file.previewElement.classList.add("dz-image-preview");
            }, 1);
          }
        },


        // Called whenever an error occurs
        // Receives `file` and `message`
        error: function error(file, message) {
          if (file.previewElement) {
            file.previewElement.classList.add("dz-error");
            if (typeof message !== "String" && message.error) {
              message = message.error;
            }
            for (var _iterator7 = file.previewElement.querySelectorAll("[data-dz-errormessage]"), _isArray7 = true, _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
              var _ref6;

              {
                if (_i7 >= _iterator7.length) break;
                _ref6 = _iterator7[_i7++];
              }

              var node = _ref6;

              node.textContent = message;
            }
          }
        },
        errormultiple: function errormultiple() {},


        // Called when a file gets processed. Since there is a cue, not all added
        // files are processed immediately.
        // Receives `file`
        processing: function processing(file) {
          if (file.previewElement) {
            file.previewElement.classList.add("dz-processing");
            if (file._removeLink) {
              return file._removeLink.innerHTML = this.options.dictCancelUpload;
            }
          }
        },
        processingmultiple: function processingmultiple() {},


        // Called whenever the upload progress gets updated.
        // Receives `file`, `progress` (percentage 0-100) and `bytesSent`.
        // To get the total number of bytes of the file, use `file.size`
        uploadprogress: function uploadprogress(file, progress, bytesSent) {
          if (file.previewElement) {
            for (var _iterator8 = file.previewElement.querySelectorAll("[data-dz-uploadprogress]"), _isArray8 = true, _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
              var _ref7;

              {
                if (_i8 >= _iterator8.length) break;
                _ref7 = _iterator8[_i8++];
              }

              var node = _ref7;

              node.nodeName === 'PROGRESS' ? node.value = progress : node.style.width = progress + "%";
            }
          }
        },


        // Called whenever the total upload progress gets updated.
        // Called with totalUploadProgress (0-100), totalBytes and totalBytesSent
        totaluploadprogress: function totaluploadprogress() {},


        // Called just before the file is sent. Gets the `xhr` object as second
        // parameter, so you can modify it (for example to add a CSRF token) and a
        // `formData` object to add additional information.
        sending: function sending() {},
        sendingmultiple: function sendingmultiple() {},


        // When the complete upload is finished and successful
        // Receives `file`
        success: function success(file) {
          if (file.previewElement) {
            return file.previewElement.classList.add("dz-success");
          }
        },
        successmultiple: function successmultiple() {},


        // When the upload is canceled.
        canceled: function canceled(file) {
          return this.emit("error", file, this.options.dictUploadCanceled);
        },
        canceledmultiple: function canceledmultiple() {},


        // When the upload is finished, either with success or an error.
        // Receives `file`
        complete: function complete(file) {
          if (file._removeLink) {
            file._removeLink.innerHTML = this.options.dictRemoveFile;
          }
          if (file.previewElement) {
            return file.previewElement.classList.add("dz-complete");
          }
        },
        completemultiple: function completemultiple() {},
        maxfilesexceeded: function maxfilesexceeded() {},
        maxfilesreached: function maxfilesreached() {},
        queuecomplete: function queuecomplete() {},
        addedfiles: function addedfiles() {}
      };

      this.prototype._thumbnailQueue = [];
      this.prototype._processingThumbnail = false;
    }

    // global utility

  }, {
    key: "extend",
    value: function extend(target) {
      for (var _len2 = arguments.length, objects = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        objects[_key2 - 1] = arguments[_key2];
      }

      for (var _iterator9 = objects, _isArray9 = true, _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
        var _ref8;

        {
          if (_i9 >= _iterator9.length) break;
          _ref8 = _iterator9[_i9++];
        }

        var object = _ref8;

        for (var key in object) {
          var val = object[key];
          target[key] = val;
        }
      }
      return target;
    }
  }]);

  function Dropzone(el, options) {
    _classCallCheck(this, Dropzone);

    var _this = _possibleConstructorReturn(this, (Dropzone.__proto__ || Object.getPrototypeOf(Dropzone)).call(this));

    var fallback = void 0,
        left = void 0;
    _this.element = el;
    // For backwards compatibility since the version was in the prototype previously
    _this.version = Dropzone.version;

    _this.defaultOptions.previewTemplate = _this.defaultOptions.previewTemplate.replace(/\n*/g, "");

    _this.clickableElements = [];
    _this.listeners = [];
    _this.files = []; // All files

    if (typeof _this.element === "string") {
      _this.element = document.querySelector(_this.element);
    }

    // Not checking if instance of HTMLElement or Element since IE9 is extremely weird.
    if (!_this.element || _this.element.nodeType == null) {
      throw new Error("Invalid dropzone element.");
    }

    if (_this.element.dropzone) {
      throw new Error("Dropzone already attached.");
    }

    // Now add this dropzone to the instances.
    Dropzone.instances.push(_this);

    // Put the dropzone inside the element itself.
    _this.element.dropzone = _this;

    var elementOptions = (left = Dropzone.optionsForElement(_this.element)) != null ? left : {};

    _this.options = Dropzone.extend({}, _this.defaultOptions, elementOptions, options != null ? options : {});

    // If the browser failed, just call the fallback and leave
    if (_this.options.forceFallback || !Dropzone.isBrowserSupported()) {
      var _ret;

      return _ret = _this.options.fallback.call(_this), _possibleConstructorReturn(_this, _ret);
    }

    // @options.url = @element.getAttribute "action" unless @options.url?
    if (_this.options.url == null) {
      _this.options.url = _this.element.getAttribute("action");
    }

    if (!_this.options.url) {
      throw new Error("No URL provided.");
    }

    if (_this.options.acceptedFiles && _this.options.acceptedMimeTypes) {
      throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
    }

    if (_this.options.uploadMultiple && _this.options.chunking) {
      throw new Error('You cannot set both: uploadMultiple and chunking.');
    }

    // Backwards compatibility
    if (_this.options.acceptedMimeTypes) {
      _this.options.acceptedFiles = _this.options.acceptedMimeTypes;
      delete _this.options.acceptedMimeTypes;
    }

    // Backwards compatibility
    if (_this.options.renameFilename != null) {
      _this.options.renameFile = function (file) {
        return _this.options.renameFilename.call(_this, file.name, file);
      };
    }

    _this.options.method = _this.options.method.toUpperCase();

    if ((fallback = _this.getExistingFallback()) && fallback.parentNode) {
      // Remove the fallback
      fallback.parentNode.removeChild(fallback);
    }

    // Display previews in the previewsContainer element or the Dropzone element unless explicitly set to false
    if (_this.options.previewsContainer !== false) {
      if (_this.options.previewsContainer) {
        _this.previewsContainer = Dropzone.getElement(_this.options.previewsContainer, "previewsContainer");
      } else {
        _this.previewsContainer = _this.element;
      }
    }

    if (_this.options.clickable) {
      if (_this.options.clickable === true) {
        _this.clickableElements = [_this.element];
      } else {
        _this.clickableElements = Dropzone.getElements(_this.options.clickable, "clickable");
      }
    }

    _this.init();
    return _this;
  }

  // Returns all files that have been accepted


  _createClass(Dropzone, [{
    key: "getAcceptedFiles",
    value: function getAcceptedFiles() {
      return this.files.filter(function (file) {
        return file.accepted;
      }).map(function (file) {
        return file;
      });
    }

    // Returns all files that have been rejected
    // Not sure when that's going to be useful, but added for completeness.

  }, {
    key: "getRejectedFiles",
    value: function getRejectedFiles() {
      return this.files.filter(function (file) {
        return !file.accepted;
      }).map(function (file) {
        return file;
      });
    }
  }, {
    key: "getFilesWithStatus",
    value: function getFilesWithStatus(status) {
      return this.files.filter(function (file) {
        return file.status === status;
      }).map(function (file) {
        return file;
      });
    }

    // Returns all files that are in the queue

  }, {
    key: "getQueuedFiles",
    value: function getQueuedFiles() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    }
  }, {
    key: "getUploadingFiles",
    value: function getUploadingFiles() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    }
  }, {
    key: "getAddedFiles",
    value: function getAddedFiles() {
      return this.getFilesWithStatus(Dropzone.ADDED);
    }

    // Files that are either queued or uploading

  }, {
    key: "getActiveFiles",
    value: function getActiveFiles() {
      return this.files.filter(function (file) {
        return file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED;
      }).map(function (file) {
        return file;
      });
    }

    // The function that gets called when Dropzone is initialized. You
    // can (and should) setup event listeners inside this function.

  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      // In case it isn't set already
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }

      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }

      if (this.clickableElements.length) {
        var setupHiddenFileInput = function setupHiddenFileInput() {
          if (_this3.hiddenFileInput) {
            _this3.hiddenFileInput.parentNode.removeChild(_this3.hiddenFileInput);
          }
          _this3.hiddenFileInput = document.createElement("input");
          _this3.hiddenFileInput.setAttribute("type", "file");
          if (_this3.options.maxFiles === null || _this3.options.maxFiles > 1) {
            _this3.hiddenFileInput.setAttribute("multiple", "multiple");
          }
          _this3.hiddenFileInput.className = "dz-hidden-input";

          if (_this3.options.acceptedFiles !== null) {
            _this3.hiddenFileInput.setAttribute("accept", _this3.options.acceptedFiles);
          }
          if (_this3.options.capture !== null) {
            _this3.hiddenFileInput.setAttribute("capture", _this3.options.capture);
          }

          // Not setting `display="none"` because some browsers don't accept clicks
          // on elements that aren't displayed.
          _this3.hiddenFileInput.style.visibility = "hidden";
          _this3.hiddenFileInput.style.position = "absolute";
          _this3.hiddenFileInput.style.top = "0";
          _this3.hiddenFileInput.style.left = "0";
          _this3.hiddenFileInput.style.height = "0";
          _this3.hiddenFileInput.style.width = "0";
          Dropzone.getElement(_this3.options.hiddenInputContainer, 'hiddenInputContainer').appendChild(_this3.hiddenFileInput);
          return _this3.hiddenFileInput.addEventListener("change", function () {
            var files = _this3.hiddenFileInput.files;

            if (files.length) {
              for (var _iterator10 = files, _isArray10 = true, _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
                var _ref9;

                {
                  if (_i10 >= _iterator10.length) break;
                  _ref9 = _iterator10[_i10++];
                }

                var file = _ref9;

                _this3.addFile(file);
              }
            }
            _this3.emit("addedfiles", files);
            return setupHiddenFileInput();
          });
        };
        setupHiddenFileInput();
      }

      this.URL = window.URL !== null ? window.URL : window.webkitURL;

      // Setup all event listeners on the Dropzone object itself.
      // They're not in @setupEventListeners() because they shouldn't be removed
      // again when the dropzone gets disabled.
      for (var _iterator11 = this.events, _isArray11 = true, _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
        var _ref10;

        {
          if (_i11 >= _iterator11.length) break;
          _ref10 = _iterator11[_i11++];
        }

        var eventName = _ref10;

        this.on(eventName, this.options[eventName]);
      }

      this.on("uploadprogress", function () {
        return _this3.updateTotalUploadProgress();
      });

      this.on("removedfile", function () {
        return _this3.updateTotalUploadProgress();
      });

      this.on("canceled", function (file) {
        return _this3.emit("complete", file);
      });

      // Emit a `queuecomplete` event if all files finished uploading.
      this.on("complete", function (file) {
        if (_this3.getAddedFiles().length === 0 && _this3.getUploadingFiles().length === 0 && _this3.getQueuedFiles().length === 0) {
          // This needs to be deferred so that `queuecomplete` really triggers after `complete`
          return setTimeout(function () {
            return _this3.emit("queuecomplete");
          }, 0);
        }
      });

      var noPropagation = function noPropagation(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };

      // Create the listeners
      this.listeners = [{
        element: this.element,
        events: {
          "dragstart": function dragstart(e) {
            return _this3.emit("dragstart", e);
          },
          "dragenter": function dragenter(e) {
            noPropagation(e);
            return _this3.emit("dragenter", e);
          },
          "dragover": function dragover(e) {
            // Makes it possible to drag files from chrome's download bar
            // http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
            // Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
            var efct = void 0;
            try {
              efct = e.dataTransfer.effectAllowed;
            } catch (error) {}
            e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';

            noPropagation(e);
            return _this3.emit("dragover", e);
          },
          "dragleave": function dragleave(e) {
            return _this3.emit("dragleave", e);
          },
          "drop": function drop(e) {
            noPropagation(e);
            return _this3.drop(e);
          },
          "dragend": function dragend(e) {
            return _this3.emit("dragend", e);
          }

          // This is disabled right now, because the browsers don't implement it properly.
          // "paste": (e) =>
          //   noPropagation e
          //   @paste e
        } }];

      this.clickableElements.forEach(function (clickableElement) {
        return _this3.listeners.push({
          element: clickableElement,
          events: {
            "click": function click(evt) {
              // Only the actual dropzone or the message element should trigger file selection
              if (clickableElement !== _this3.element || evt.target === _this3.element || Dropzone.elementInside(evt.target, _this3.element.querySelector(".dz-message"))) {
                _this3.hiddenFileInput.click(); // Forward the click
              }
              return true;
            }
          }
        });
      });

      this.enable();

      return this.options.init.call(this);
    }

    // Not fully tested yet

  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.removeAllFiles(true);
      if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : undefined) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    }
  }, {
    key: "updateTotalUploadProgress",
    value: function updateTotalUploadProgress() {
      var totalUploadProgress = void 0;
      var totalBytesSent = 0;
      var totalBytes = 0;

      var activeFiles = this.getActiveFiles();

      if (activeFiles.length) {
        for (var _iterator12 = this.getActiveFiles(), _isArray12 = true, _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
          var _ref11;

          {
            if (_i12 >= _iterator12.length) break;
            _ref11 = _iterator12[_i12++];
          }

          var file = _ref11;

          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }

      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    }

    // @options.paramName can be a function taking one parameter rather than a string.
    // A parameter name for a file is obtained simply by calling this with an index number.

  }, {
    key: "_getParamName",
    value: function _getParamName(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    }

    // If @options.renameFile is a function,
    // the function will be used to rename the file.name before appending it to the formData

  }, {
    key: "_renameFile",
    value: function _renameFile(file) {
      if (typeof this.options.renameFile !== "function") {
        return file.name;
      }
      return this.options.renameFile(file);
    }

    // Returns a form that can be used as fallback if the browser does not support DragnDrop
    //
    // If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
    // This code has to pass in IE7 :(

  }, {
    key: "getFallbackForm",
    value: function getFallbackForm() {
      var existingFallback = void 0,
          form = void 0;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }

      var fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + this._getParamName(0) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : undefined) + " /><input type=\"submit\" value=\"Upload!\"></div>";

      var fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        // Make sure that the enctype and method attributes are set properly
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    }

    // Returns the fallback elements if they exist already
    //
    // This code has to pass in IE7 :(

  }, {
    key: "getExistingFallback",
    value: function getExistingFallback() {
      var getFallback = function getFallback(elements) {
        for (var _iterator13 = elements, _isArray13 = true, _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
          var _ref12;

          {
            if (_i13 >= _iterator13.length) break;
            _ref12 = _iterator13[_i13++];
          }

          var el = _ref12;

          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };

      var _arr = ["div", "form"];
      for (var _i14 = 0; _i14 < _arr.length; _i14++) {
        var tagName = _arr[_i14];
        var fallback;
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    }

    // Activates all listeners stored in @listeners

  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];
          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return result;
        }();
      });
    }

    // Deactivates all listeners stored in @listeners

  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];
          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return result;
        }();
      });
    }

    // Removes all event listeners and cancels all files in the queue or being processed.

  }, {
    key: "disable",
    value: function disable() {
      var _this4 = this;

      this.clickableElements.forEach(function (element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      this.disabled = true;

      return this.files.map(function (file) {
        return _this4.cancelUpload(file);
      });
    }
  }, {
    key: "enable",
    value: function enable() {
      delete this.disabled;
      this.clickableElements.forEach(function (element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    }

    // Returns a nicely formatted filesize

  }, {
    key: "filesize",
    value: function filesize(size) {
      var selectedSize = 0;
      var selectedUnit = "b";

      if (size > 0) {
        var units = ['tb', 'gb', 'mb', 'kb', 'b'];

        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;

          if (size >= cutoff) {
            selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }

        selectedSize = Math.round(10 * selectedSize) / 10; // Cutting of digits
      }

      return "<strong>" + selectedSize + "</strong> " + this.options.dictFileSizeUnits[selectedUnit];
    }

    // Adds or removes the `dz-max-files-reached` class from the form.

  }, {
    key: "_updateMaxFilesReachedClass",
    value: function _updateMaxFilesReachedClass() {
      if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    }
  }, {
    key: "drop",
    value: function drop(e) {
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);

      // Convert the FileList to an Array
      // This is necessary for IE11
      var files = [];
      for (var i = 0; i < e.dataTransfer.files.length; i++) {
        files[i] = e.dataTransfer.files[i];
      }

      this.emit("addedfiles", files);

      // Even if it's a folder, files.length will contain the folders.
      if (files.length) {
        var items = e.dataTransfer.items;

        if (items && items.length && items[0].webkitGetAsEntry != null) {
          // The browser supports dropping of folders, so handle items instead of files
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    }
  }, {
    key: "paste",
    value: function paste(e) {
      if (__guard__(e != null ? e.clipboardData : undefined, function (x) {
        return x.items;
      }) == null) {
        return;
      }

      this.emit("paste", e);
      var items = e.clipboardData.items;


      if (items.length) {
        return this._addFilesFromItems(items);
      }
    }
  }, {
    key: "handleFiles",
    value: function handleFiles(files) {
      for (var _iterator14 = files, _isArray14 = true, _i15 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
        var _ref13;

        {
          if (_i15 >= _iterator14.length) break;
          _ref13 = _iterator14[_i15++];
        }

        var file = _ref13;

        this.addFile(file);
      }
    }

    // When a folder is dropped (or files are pasted), items must be handled
    // instead of files.

  }, {
    key: "_addFilesFromItems",
    value: function _addFilesFromItems(items) {
      var _this5 = this;

      return function () {
        var result = [];
        for (var _iterator15 = items, _isArray15 = true, _i16 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
          var _ref14;

          {
            if (_i16 >= _iterator15.length) break;
            _ref14 = _iterator15[_i16++];
          }

          var item = _ref14;

          var entry;
          if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
            if (entry.isFile) {
              result.push(_this5.addFile(item.getAsFile()));
            } else if (entry.isDirectory) {
              // Append all files from that directory to files
              result.push(_this5._addFilesFromDirectory(entry, entry.name));
            } else {
              result.push(undefined);
            }
          } else if (item.getAsFile != null) {
            if (item.kind == null || item.kind === "file") {
              result.push(_this5.addFile(item.getAsFile()));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      }();
    }

    // Goes through the directory, and adds each file it finds recursively

  }, {
    key: "_addFilesFromDirectory",
    value: function _addFilesFromDirectory(directory, path) {
      var _this6 = this;

      var dirReader = directory.createReader();

      var errorHandler = function errorHandler(error) {
        return __guardMethod__(console, 'log', function (o) {
          return o.log(error);
        });
      };

      var readEntries = function readEntries() {
        return dirReader.readEntries(function (entries) {
          if (entries.length > 0) {
            for (var _iterator16 = entries, _isArray16 = true, _i17 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
              var _ref15;

              {
                if (_i17 >= _iterator16.length) break;
                _ref15 = _iterator16[_i17++];
              }

              var entry = _ref15;

              if (entry.isFile) {
                entry.file(function (file) {
                  if (_this6.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                    return;
                  }
                  file.fullPath = path + "/" + file.name;
                  return _this6.addFile(file);
                });
              } else if (entry.isDirectory) {
                _this6._addFilesFromDirectory(entry, path + "/" + entry.name);
              }
            }

            // Recursively call readEntries() again, since browser only handle
            // the first 100 entries.
            // See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
            readEntries();
          }
          return null;
        }, errorHandler);
      };

      return readEntries();
    }

    // If `done()` is called without argument the file is accepted
    // If you call it with an error message, the file is rejected
    // (This allows for asynchronous validation)
    //
    // This function checks the filesize, and if the file.type passes the
    // `acceptedFiles` check.

  }, {
    key: "accept",
    value: function accept(file, done) {
      if (this.options.maxFilesize && file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    }
  }, {
    key: "addFile",
    value: function addFile(file) {
      var _this7 = this;

      file.upload = {
        uuid: Dropzone.uuidv4(),
        progress: 0,
        // Setting the total upload size to file.size for the beginning
        // It's actual different than the size to be transmitted.
        total: file.size,
        bytesSent: 0,
        filename: this._renameFile(file),
        chunked: this.options.chunking && (this.options.forceChunking || file.size > this.options.chunkSize),
        totalChunkCount: Math.ceil(file.size / this.options.chunkSize)
      };
      this.files.push(file);

      file.status = Dropzone.ADDED;

      this.emit("addedfile", file);

      this._enqueueThumbnail(file);

      return this.accept(file, function (error) {
        if (error) {
          file.accepted = false;
          _this7._errorProcessing([file], error); // Will set the file.status
        } else {
          file.accepted = true;
          if (_this7.options.autoQueue) {
            _this7.enqueueFile(file);
          } // Will set .accepted = true
        }
        return _this7._updateMaxFilesReachedClass();
      });
    }

    // Wrapper for enqueueFile

  }, {
    key: "enqueueFiles",
    value: function enqueueFiles(files) {
      for (var _iterator17 = files, _isArray17 = true, _i18 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator]();;) {
        var _ref16;

        {
          if (_i18 >= _iterator17.length) break;
          _ref16 = _iterator17[_i18++];
        }

        var file = _ref16;

        this.enqueueFile(file);
      }
      return null;
    }
  }, {
    key: "enqueueFile",
    value: function enqueueFile(file) {
      var _this8 = this;

      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(function () {
            return _this8.processQueue();
          }, 0); // Deferring the call
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    }
  }, {
    key: "_enqueueThumbnail",
    value: function _enqueueThumbnail(file) {
      var _this9 = this;

      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(function () {
          return _this9._processThumbnailQueue();
        }, 0); // Deferring the call
      }
    }
  }, {
    key: "_processThumbnailQueue",
    value: function _processThumbnailQueue() {
      var _this10 = this;

      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }

      this._processingThumbnail = true;
      var file = this._thumbnailQueue.shift();
      return this.createThumbnail(file, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, true, function (dataUrl) {
        _this10.emit("thumbnail", file, dataUrl);
        _this10._processingThumbnail = false;
        return _this10._processThumbnailQueue();
      });
    }

    // Can be called by the user to remove a file

  }, {
    key: "removeFile",
    value: function removeFile(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);

      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    }

    // Removes all files that aren't currently processed from the list

  }, {
    key: "removeAllFiles",
    value: function removeAllFiles(cancelIfNecessary) {
      // Create a copy of files since removeFile() changes the @files array.
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      for (var _iterator18 = this.files.slice(), _isArray18 = true, _i19 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator]();;) {
        var _ref17;

        {
          if (_i19 >= _iterator18.length) break;
          _ref17 = _iterator18[_i19++];
        }

        var file = _ref17;

        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    }

    // Resizes an image before it gets sent to the server. This function is the default behavior of
    // `options.transformFile` if `resizeWidth` or `resizeHeight` are set. The callback is invoked with
    // the resized blob.

  }, {
    key: "resizeImage",
    value: function resizeImage(file, width, height, resizeMethod, callback) {
      var _this11 = this;

      return this.createThumbnail(file, width, height, resizeMethod, true, function (dataUrl, canvas) {
        if (canvas == null) {
          // The image has not been resized
          return callback(file);
        } else {
          var resizeMimeType = _this11.options.resizeMimeType;

          if (resizeMimeType == null) {
            resizeMimeType = file.type;
          }
          var resizedDataURL = canvas.toDataURL(resizeMimeType, _this11.options.resizeQuality);
          if (resizeMimeType === 'image/jpeg' || resizeMimeType === 'image/jpg') {
            // Now add the original EXIF information
            resizedDataURL = ExifRestore.restore(file.dataURL, resizedDataURL);
          }
          return callback(Dropzone.dataURItoBlob(resizedDataURL));
        }
      });
    }
  }, {
    key: "createThumbnail",
    value: function createThumbnail(file, width, height, resizeMethod, fixOrientation, callback) {
      var _this12 = this;

      var fileReader = new FileReader();

      fileReader.onload = function () {

        file.dataURL = fileReader.result;

        // Don't bother creating a thumbnail for SVG images since they're vector
        if (file.type === "image/svg+xml") {
          if (callback != null) {
            callback(fileReader.result);
          }
          return;
        }

        return _this12.createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback);
      };

      return fileReader.readAsDataURL(file);
    }
  }, {
    key: "createThumbnailFromUrl",
    value: function createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback, crossOrigin) {
      var _this13 = this;

      // Not using `new Image` here because of a bug in latest Chrome versions.
      // See https://github.com/enyo/dropzone/pull/226
      var img = document.createElement("img");

      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      img.onload = function () {
        var loadExif = function loadExif(callback) {
          return callback(1);
        };
        if (typeof EXIF !== 'undefined' && EXIF !== null && fixOrientation) {
          loadExif = function loadExif(callback) {
            return EXIF.getData(img, function () {
              return callback(EXIF.getTag(this, 'Orientation'));
            });
          };
        }

        return loadExif(function (orientation) {
          file.width = img.width;
          file.height = img.height;

          var resizeInfo = _this13.options.resize.call(_this13, file, width, height, resizeMethod);

          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");

          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;

          if (orientation > 4) {
            canvas.width = resizeInfo.trgHeight;
            canvas.height = resizeInfo.trgWidth;
          }

          switch (orientation) {
            case 2:
              // horizontal flip
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              break;
            case 3:
              // 180° rotate left
              ctx.translate(canvas.width, canvas.height);
              ctx.rotate(Math.PI);
              break;
            case 4:
              // vertical flip
              ctx.translate(0, canvas.height);
              ctx.scale(1, -1);
              break;
            case 5:
              // vertical flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.scale(1, -1);
              break;
            case 6:
              // 90° rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(0, -canvas.width);
              break;
            case 7:
              // horizontal flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(canvas.height, -canvas.width);
              ctx.scale(-1, 1);
              break;
            case 8:
              // 90° rotate left
              ctx.rotate(-0.5 * Math.PI);
              ctx.translate(-canvas.height, 0);
              break;
          }

          // This is a bugfix for iOS' scaling bug.
          drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);

          var thumbnail = canvas.toDataURL("image/png");

          if (callback != null) {
            return callback(thumbnail, canvas);
          }
        });
      };

      if (callback != null) {
        img.onerror = callback;
      }

      return img.src = file.dataURL;
    }

    // Goes through the queue and processes files if there aren't too many already.

  }, {
    key: "processQueue",
    value: function processQueue() {
      var parallelUploads = this.options.parallelUploads;

      var processingLength = this.getUploadingFiles().length;
      var i = processingLength;

      // There are already at least as many files uploading than should be
      if (processingLength >= parallelUploads) {
        return;
      }

      var queuedFiles = this.getQueuedFiles();

      if (!(queuedFiles.length > 0)) {
        return;
      }

      if (this.options.uploadMultiple) {
        // The files should be uploaded in one request
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          } // Nothing left to process
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    }

    // Wrapper for `processFiles`

  }, {
    key: "processFile",
    value: function processFile(file) {
      return this.processFiles([file]);
    }

    // Loads the file, then calls finishedLoading()

  }, {
    key: "processFiles",
    value: function processFiles(files) {
      for (var _iterator19 = files, _isArray19 = true, _i20 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator]();;) {
        var _ref18;

        {
          if (_i20 >= _iterator19.length) break;
          _ref18 = _iterator19[_i20++];
        }

        var file = _ref18;

        file.processing = true; // Backwards compatibility
        file.status = Dropzone.UPLOADING;

        this.emit("processing", file);
      }

      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }

      return this.uploadFiles(files);
    }
  }, {
    key: "_getFilesWithXhr",
    value: function _getFilesWithXhr(xhr) {
      var files = void 0;
      return files = this.files.filter(function (file) {
        return file.xhr === xhr;
      }).map(function (file) {
        return file;
      });
    }

    // Cancels the file upload and sets the status to CANCELED
    // **if** the file is actually being uploaded.
    // If it's still in the queue, the file is being removed from it and the status
    // set to CANCELED.

  }, {
    key: "cancelUpload",
    value: function cancelUpload(file) {
      if (file.status === Dropzone.UPLOADING) {
        var groupedFiles = this._getFilesWithXhr(file.xhr);
        for (var _iterator20 = groupedFiles, _isArray20 = true, _i21 = 0, _iterator20 = _isArray20 ? _iterator20 : _iterator20[Symbol.iterator]();;) {
          var _ref19;

          {
            if (_i21 >= _iterator20.length) break;
            _ref19 = _iterator20[_i21++];
          }

          var groupedFile = _ref19;

          groupedFile.status = Dropzone.CANCELED;
        }
        if (typeof file.xhr !== 'undefined') {
          file.xhr.abort();
        }
        for (var _iterator21 = groupedFiles, _isArray21 = true, _i22 = 0, _iterator21 = _isArray21 ? _iterator21 : _iterator21[Symbol.iterator]();;) {
          var _ref20;

          {
            if (_i22 >= _iterator21.length) break;
            _ref20 = _iterator21[_i22++];
          }

          var _groupedFile = _ref20;

          this.emit("canceled", _groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }, {
    key: "resolveOption",
    value: function resolveOption(option) {
      if (typeof option === 'function') {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        return option.apply(this, args);
      }
      return option;
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(file) {
      return this.uploadFiles([file]);
    }
  }, {
    key: "uploadFiles",
    value: function uploadFiles(files) {
      var _this14 = this;

      this._transformFiles(files, function (transformedFiles) {
        if (files[0].upload.chunked) {
          // This file should be sent in chunks!

          // If the chunking option is set, we **know** that there can only be **one** file, since
          // uploadMultiple is not allowed with this option.
          var file = files[0];
          var transformedFile = transformedFiles[0];

          file.upload.chunks = [];

          var handleNextChunk = function handleNextChunk() {
            var chunkIndex = 0;

            // Find the next item in file.upload.chunks that is not defined yet.
            while (file.upload.chunks[chunkIndex] !== undefined) {
              chunkIndex++;
            }

            // This means, that all chunks have already been started.
            if (chunkIndex >= file.upload.totalChunkCount) return;

            var start = chunkIndex * _this14.options.chunkSize;
            var end = Math.min(start + _this14.options.chunkSize, file.size);

            var dataBlock = {
              name: _this14._getParamName(0),
              data: transformedFile.webkitSlice ? transformedFile.webkitSlice(start, end) : transformedFile.slice(start, end),
              filename: file.upload.filename,
              chunkIndex: chunkIndex
            };

            file.upload.chunks[chunkIndex] = {
              file: file,
              index: chunkIndex,
              dataBlock: dataBlock, // In case we want to retry.
              status: Dropzone.UPLOADING,
              progress: 0,
              retries: 0 // The number of times this block has been retried.
            };

            _this14._uploadData(files, [dataBlock]);
          };

          file.upload.finishedChunkUpload = function (chunk) {
            var allFinished = true;
            chunk.status = Dropzone.SUCCESS;

            // Clear the data from the chunk
            chunk.dataBlock = null;
            // Leaving this reference to xhr intact here will cause memory leaks in some browsers
            chunk.xhr = null;

            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              if (file.upload.chunks[i] === undefined) {
                return handleNextChunk();
              }
              if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
                allFinished = false;
              }
            }

            if (allFinished) {
              _this14.options.chunksUploaded(file, function () {
                _this14._finished(files, '', null);
              });
            }
          };

          if (_this14.options.parallelChunkUploads) {
            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              handleNextChunk();
            }
          } else {
            handleNextChunk();
          }
        } else {
          var dataBlocks = [];
          for (var _i23 = 0; _i23 < files.length; _i23++) {
            dataBlocks[_i23] = {
              name: _this14._getParamName(_i23),
              data: transformedFiles[_i23],
              filename: files[_i23].upload.filename
            };
          }
          _this14._uploadData(files, dataBlocks);
        }
      });
    }

    /// Returns the right chunk for given file and xhr

  }, {
    key: "_getChunk",
    value: function _getChunk(file, xhr) {
      for (var i = 0; i < file.upload.totalChunkCount; i++) {
        if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].xhr === xhr) {
          return file.upload.chunks[i];
        }
      }
    }

    // This function actually uploads the file(s) to the server.
    // If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
    // files, or individual chunks for chunked upload).

  }, {
    key: "_uploadData",
    value: function _uploadData(files, dataBlocks) {
      var _this15 = this;

      var xhr = new XMLHttpRequest();

      // Put the xhr object in the file objects to be able to reference it later.
      for (var _iterator22 = files, _isArray22 = true, _i24 = 0, _iterator22 = _isArray22 ? _iterator22 : _iterator22[Symbol.iterator]();;) {
        var _ref21;

        {
          if (_i24 >= _iterator22.length) break;
          _ref21 = _iterator22[_i24++];
        }

        var file = _ref21;

        file.xhr = xhr;
      }
      if (files[0].upload.chunked) {
        // Put the xhr object in the right chunk object, so it can be associated later, and found with _getChunk
        files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
      }

      var method = this.resolveOption(this.options.method, files);
      var url = this.resolveOption(this.options.url, files);
      xhr.open(method, url, true);

      // Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8
      xhr.timeout = this.resolveOption(this.options.timeout, files);

      // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
      xhr.withCredentials = !!this.options.withCredentials;

      xhr.onload = function (e) {
        _this15._finishedUploading(files, xhr, e);
      };

      xhr.onerror = function () {
        _this15._handleUploadError(files, xhr);
      };

      // Some browsers do not have the .upload property
      var progressObj = xhr.upload != null ? xhr.upload : xhr;
      progressObj.onprogress = function (e) {
        return _this15._updateFilesUploadProgress(files, xhr, e);
      };

      var headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };

      if (this.options.headers) {
        Dropzone.extend(headers, this.options.headers);
      }

      for (var headerName in headers) {
        var headerValue = headers[headerName];
        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }

      var formData = new FormData();

      // Adding all @options parameters
      if (this.options.params) {
        var additionalParams = this.options.params;
        if (typeof additionalParams === 'function') {
          additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
        }

        for (var key in additionalParams) {
          var value = additionalParams[key];
          formData.append(key, value);
        }
      }

      // Let the user add additional data if necessary
      for (var _iterator23 = files, _isArray23 = true, _i25 = 0, _iterator23 = _isArray23 ? _iterator23 : _iterator23[Symbol.iterator]();;) {
        var _ref22;

        {
          if (_i25 >= _iterator23.length) break;
          _ref22 = _iterator23[_i25++];
        }

        var _file = _ref22;

        this.emit("sending", _file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }

      this._addFormElementData(formData);

      // Finally add the files
      // Has to be last because some servers (eg: S3) expect the file to be the last parameter
      for (var i = 0; i < dataBlocks.length; i++) {
        var dataBlock = dataBlocks[i];
        formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
      }

      this.submitRequest(xhr, formData, files);
    }

    // Transforms all files with this.options.transformFile and invokes done with the transformed files when done.

  }, {
    key: "_transformFiles",
    value: function _transformFiles(files, done) {
      var _this16 = this;

      var transformedFiles = [];
      // Clumsy way of handling asynchronous calls, until I get to add a proper Future library.
      var doneCounter = 0;

      var _loop = function _loop(i) {
        _this16.options.transformFile.call(_this16, files[i], function (transformedFile) {
          transformedFiles[i] = transformedFile;
          if (++doneCounter === files.length) {
            done(transformedFiles);
          }
        });
      };

      for (var i = 0; i < files.length; i++) {
        _loop(i);
      }
    }

    // Takes care of adding other input elements of the form to the AJAX request

  }, {
    key: "_addFormElementData",
    value: function _addFormElementData(formData) {
      // Take care of other input elements
      if (this.element.tagName === "FORM") {
        for (var _iterator24 = this.element.querySelectorAll("input, textarea, select, button"), _isArray24 = true, _i26 = 0, _iterator24 = _isArray24 ? _iterator24 : _iterator24[Symbol.iterator]();;) {
          var _ref23;

          {
            if (_i26 >= _iterator24.length) break;
            _ref23 = _iterator24[_i26++];
          }

          var input = _ref23;

          var inputName = input.getAttribute("name");
          var inputType = input.getAttribute("type");
          if (inputType) inputType = inputType.toLowerCase();

          // If the input doesn't have a name, we can't use it.
          if (typeof inputName === 'undefined' || inputName === null) continue;

          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            // Possibly multiple values
            for (var _iterator25 = input.options, _isArray25 = true, _i27 = 0, _iterator25 = _isArray25 ? _iterator25 : _iterator25[Symbol.iterator]();;) {
              var _ref24;

              {
                if (_i27 >= _iterator25.length) break;
                _ref24 = _iterator25[_i27++];
              }

              var option = _ref24;

              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || inputType !== "checkbox" && inputType !== "radio" || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
    }

    // Invoked when there is new progress information about given files.
    // If e is not provided, it is assumed that the upload is finished.

  }, {
    key: "_updateFilesUploadProgress",
    value: function _updateFilesUploadProgress(files, xhr, e) {
      var progress = void 0;
      if (typeof e !== 'undefined') {
        progress = 100 * e.loaded / e.total;

        if (files[0].upload.chunked) {
          var file = files[0];
          // Since this is a chunked upload, we need to update the appropriate chunk progress.
          var chunk = this._getChunk(file, xhr);
          chunk.progress = progress;
          chunk.total = e.total;
          chunk.bytesSent = e.loaded;
          file.upload.progress = 0;
          file.upload.total = 0;
          file.upload.bytesSent = 0;
          for (var i = 0; i < file.upload.totalChunkCount; i++) {
            if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].progress !== undefined) {
              file.upload.progress += file.upload.chunks[i].progress;
              file.upload.total += file.upload.chunks[i].total;
              file.upload.bytesSent += file.upload.chunks[i].bytesSent;
            }
          }
          file.upload.progress = file.upload.progress / file.upload.totalChunkCount;
        } else {
          for (var _iterator26 = files, _isArray26 = true, _i28 = 0, _iterator26 = _isArray26 ? _iterator26 : _iterator26[Symbol.iterator]();;) {
            var _ref25;

            {
              if (_i28 >= _iterator26.length) break;
              _ref25 = _iterator26[_i28++];
            }

            var _file2 = _ref25;

            _file2.upload.progress = progress;
            _file2.upload.total = e.total;
            _file2.upload.bytesSent = e.loaded;
          }
        }
        for (var _iterator27 = files, _isArray27 = true, _i29 = 0, _iterator27 = _isArray27 ? _iterator27 : _iterator27[Symbol.iterator]();;) {
          var _ref26;

          {
            if (_i29 >= _iterator27.length) break;
            _ref26 = _iterator27[_i29++];
          }

          var _file3 = _ref26;

          this.emit("uploadprogress", _file3, _file3.upload.progress, _file3.upload.bytesSent);
        }
      } else {
        // Called when the file finished uploading

        var allFilesFinished = true;

        progress = 100;

        for (var _iterator28 = files, _isArray28 = true, _i30 = 0, _iterator28 = _isArray28 ? _iterator28 : _iterator28[Symbol.iterator]();;) {
          var _ref27;

          {
            if (_i30 >= _iterator28.length) break;
            _ref27 = _iterator28[_i30++];
          }

          var _file4 = _ref27;

          if (_file4.upload.progress !== 100 || _file4.upload.bytesSent !== _file4.upload.total) {
            allFilesFinished = false;
          }
          _file4.upload.progress = progress;
          _file4.upload.bytesSent = _file4.upload.total;
        }

        // Nothing to do, all files already at 100%
        if (allFilesFinished) {
          return;
        }

        for (var _iterator29 = files, _isArray29 = true, _i31 = 0, _iterator29 = _isArray29 ? _iterator29 : _iterator29[Symbol.iterator]();;) {
          var _ref28;

          {
            if (_i31 >= _iterator29.length) break;
            _ref28 = _iterator29[_i31++];
          }

          var _file5 = _ref28;

          this.emit("uploadprogress", _file5, progress, _file5.upload.bytesSent);
        }
      }
    }
  }, {
    key: "_finishedUploading",
    value: function _finishedUploading(files, xhr, e) {
      var response = void 0;

      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.responseType !== 'arraybuffer' && xhr.responseType !== 'blob') {
        response = xhr.responseText;

        if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
          try {
            response = JSON.parse(response);
          } catch (error) {
            e = error;
            response = "Invalid JSON response from server.";
          }
        }
      }

      this._updateFilesUploadProgress(files);

      if (!(200 <= xhr.status && xhr.status < 300)) {
        this._handleUploadError(files, xhr, response);
      } else {
        if (files[0].upload.chunked) {
          files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr));
        } else {
          this._finished(files, response, e);
        }
      }
    }
  }, {
    key: "_handleUploadError",
    value: function _handleUploadError(files, xhr, response) {
      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (files[0].upload.chunked && this.options.retryChunks) {
        var chunk = this._getChunk(files[0], xhr);
        if (chunk.retries++ < this.options.retryChunksLimit) {
          this._uploadData(files, [chunk.dataBlock]);
          return;
        } else {
          console.warn('Retried this chunk too often. Giving up.');
        }
      }

      for (var _iterator30 = files, _isArray30 = true, _i32 = 0, _iterator30 = _isArray30 ? _iterator30 : _iterator30[Symbol.iterator]();;) {
        var _ref29;

        {
          if (_i32 >= _iterator30.length) break;
          _ref29 = _iterator30[_i32++];
        }

        this._errorProcessing(files, response || this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
      }
    }
  }, {
    key: "submitRequest",
    value: function submitRequest(xhr, formData, files) {
      xhr.send(formData);
    }

    // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_finished",
    value: function _finished(files, responseText, e) {
      for (var _iterator31 = files, _isArray31 = true, _i33 = 0, _iterator31 = _isArray31 ? _iterator31 : _iterator31[Symbol.iterator]();;) {
        var _ref30;

        {
          if (_i33 >= _iterator31.length) break;
          _ref30 = _iterator31[_i33++];
        }

        var file = _ref30;

        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }

    // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_errorProcessing",
    value: function _errorProcessing(files, message, xhr) {
      for (var _iterator32 = files, _isArray32 = true, _i34 = 0, _iterator32 = _isArray32 ? _iterator32 : _iterator32[Symbol.iterator]();;) {
        var _ref31;

        {
          if (_i34 >= _iterator32.length) break;
          _ref31 = _iterator32[_i34++];
        }

        var file = _ref31;

        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }], [{
    key: "uuidv4",
    value: function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    }
  }]);

  return Dropzone;
}(Emitter);

Dropzone.initClass();

Dropzone.version = "5.5.1";

// This is a map of options for your different dropzones. Add configurations
// to this object for your different dropzone elemens.
//
// Example:
//
//     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
//
// To disable autoDiscover for a specific element, you can set `false` as an option:
//
//     Dropzone.options.myDisabledElementId = false;
//
// And in html:
//
//     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>
Dropzone.options = {};

// Returns the options for an element or undefined if none available.
Dropzone.optionsForElement = function (element) {
  // Get the `Dropzone.options.elementId` for this element if it exists
  if (element.getAttribute("id")) {
    return Dropzone.options[camelize(element.getAttribute("id"))];
  } else {
    return undefined;
  }
};

// Holds a list of all dropzone instances
Dropzone.instances = [];

// Returns the dropzone for given element if any
Dropzone.forElement = function (element) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }
  if ((element != null ? element.dropzone : undefined) == null) {
    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
  }
  return element.dropzone;
};

// Set to false if you don't want Dropzone to automatically find and attach to .dropzone elements.
Dropzone.autoDiscover = true;

// Looks for all .dropzone elements and creates a dropzone for them
Dropzone.discover = function () {
  var dropzones = void 0;
  if (document.querySelectorAll) {
    dropzones = document.querySelectorAll(".dropzone");
  } else {
    dropzones = [];
    // IE :(
    var checkElements = function checkElements(elements) {
      return function () {
        var result = [];
        for (var _iterator33 = elements, _isArray33 = true, _i35 = 0, _iterator33 = _isArray33 ? _iterator33 : _iterator33[Symbol.iterator]();;) {
          var _ref32;

          {
            if (_i35 >= _iterator33.length) break;
            _ref32 = _iterator33[_i35++];
          }

          var el = _ref32;

          if (/(^| )dropzone($| )/.test(el.className)) {
            result.push(dropzones.push(el));
          } else {
            result.push(undefined);
          }
        }
        return result;
      }();
    };
    checkElements(document.getElementsByTagName("div"));
    checkElements(document.getElementsByTagName("form"));
  }

  return function () {
    var result = [];
    for (var _iterator34 = dropzones, _isArray34 = true, _i36 = 0, _iterator34 = _isArray34 ? _iterator34 : _iterator34[Symbol.iterator]();;) {
      var _ref33;

      {
        if (_i36 >= _iterator34.length) break;
        _ref33 = _iterator34[_i36++];
      }

      var dropzone = _ref33;

      // Create a dropzone unless auto discover has been disabled for specific element
      if (Dropzone.optionsForElement(dropzone) !== false) {
        result.push(new Dropzone(dropzone));
      } else {
        result.push(undefined);
      }
    }
    return result;
  }();
};

// Since the whole Drag'n'Drop API is pretty new, some browsers implement it,
// but not correctly.
// So I created a blacklist of userAgents. Yes, yes. Browser sniffing, I know.
// But what to do when browsers *theoretically* support an API, but crash
// when using it.
//
// This is a list of regular expressions tested against navigator.userAgent
//
// ** It should only be used on browser that *do* support the API, but
// incorrectly **
//
Dropzone.blacklistedBrowsers = [
// The mac os and windows phone version of opera 12 seems to have a problem with the File drag'n'drop API.
/opera.*(Macintosh|Windows Phone).*version\/12/i];

// Checks if the browser is supported
Dropzone.isBrowserSupported = function () {
  var capableBrowser = true;

  if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
    if (!("classList" in document.createElement("a"))) {
      capableBrowser = false;
    } else {
      // The browser supports the API, but may be blacklisted.
      for (var _iterator35 = Dropzone.blacklistedBrowsers, _isArray35 = true, _i37 = 0, _iterator35 = _isArray35 ? _iterator35 : _iterator35[Symbol.iterator]();;) {
        var _ref34;

        {
          if (_i37 >= _iterator35.length) break;
          _ref34 = _iterator35[_i37++];
        }

        var regex = _ref34;

        if (regex.test(navigator.userAgent)) {
          capableBrowser = false;
          continue;
        }
      }
    }
  } else {
    capableBrowser = false;
  }

  return capableBrowser;
};

Dropzone.dataURItoBlob = function (dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob
  return new Blob([ab], { type: mimeString });
};

// Returns an array without the rejected item
var without = function without(list, rejectedItem) {
  return list.filter(function (item) {
    return item !== rejectedItem;
  }).map(function (item) {
    return item;
  });
};

// abc-def_ghi -> abcDefGhi
var camelize = function camelize(str) {
  return str.replace(/[\-_](\w)/g, function (match) {
    return match.charAt(1).toUpperCase();
  });
};

// Creates an element from string
Dropzone.createElement = function (string) {
  var div = document.createElement("div");
  div.innerHTML = string;
  return div.childNodes[0];
};

// Tests if given element is inside (or simply is) the container
Dropzone.elementInside = function (element, container) {
  if (element === container) {
    return true;
  } // Coffeescript doesn't support do/while loops
  while (element = element.parentNode) {
    if (element === container) {
      return true;
    }
  }
  return false;
};

Dropzone.getElement = function (el, name) {
  var element = void 0;
  if (typeof el === "string") {
    element = document.querySelector(el);
  } else if (el.nodeType != null) {
    element = el;
  }
  if (element == null) {
    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
  }
  return element;
};

Dropzone.getElements = function (els, name) {
  var el = void 0,
      elements = void 0;
  if (els instanceof Array) {
    elements = [];
    try {
      for (var _iterator36 = els, _isArray36 = true, _i38 = 0, _iterator36 = _isArray36 ? _iterator36 : _iterator36[Symbol.iterator]();;) {
        {
          if (_i38 >= _iterator36.length) break;
          el = _iterator36[_i38++];
        }

        elements.push(this.getElement(el, name));
      }
    } catch (e) {
      elements = null;
    }
  } else if (typeof els === "string") {
    elements = [];
    for (var _iterator37 = document.querySelectorAll(els), _isArray37 = true, _i39 = 0, _iterator37 = _isArray37 ? _iterator37 : _iterator37[Symbol.iterator]();;) {
      {
        if (_i39 >= _iterator37.length) break;
        el = _iterator37[_i39++];
      }

      elements.push(el);
    }
  } else if (els.nodeType != null) {
    elements = [els];
  }

  if (elements == null || !elements.length) {
    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
  }

  return elements;
};

// Asks the user the question and calls accepted or rejected accordingly
//
// The default implementation just uses `window.confirm` and then calls the
// appropriate callback.
Dropzone.confirm = function (question, accepted, rejected) {
  if (window.confirm(question)) {
    return accepted();
  } else if (rejected != null) {
    return rejected();
  }
};

// Validates the mime type like this:
//
// https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept
Dropzone.isValidFile = function (file, acceptedFiles) {
  if (!acceptedFiles) {
    return true;
  } // If there are no accepted mime types, it's OK
  acceptedFiles = acceptedFiles.split(",");

  var mimeType = file.type;
  var baseMimeType = mimeType.replace(/\/.*$/, "");

  for (var _iterator38 = acceptedFiles, _isArray38 = true, _i40 = 0, _iterator38 = _isArray38 ? _iterator38 : _iterator38[Symbol.iterator]();;) {
    var _ref35;

    {
      if (_i40 >= _iterator38.length) break;
      _ref35 = _iterator38[_i40++];
    }

    var validType = _ref35;

    validType = validType.trim();
    if (validType.charAt(0) === ".") {
      if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
        return true;
      }
    } else if (/\/\*$/.test(validType)) {
      // This is something like a image/* mime type
      if (baseMimeType === validType.replace(/\/.*$/, "")) {
        return true;
      }
    } else {
      if (mimeType === validType) {
        return true;
      }
    }
  }

  return false;
};

// Augment jQuery
if (typeof jQuery !== 'undefined' && jQuery !== null) {
  jQuery.fn.dropzone = function (options) {
    return this.each(function () {
      return new Dropzone(this, options);
    });
  };
}

if (module !== null) {
  module.exports = Dropzone;
} else {
  window.Dropzone = Dropzone;
}

// Dropzone file status codes
Dropzone.ADDED = "added";

Dropzone.QUEUED = "queued";
// For backwards compatibility. Now, if a file is accepted, it's either queued
// or uploading.
Dropzone.ACCEPTED = Dropzone.QUEUED;

Dropzone.UPLOADING = "uploading";
Dropzone.PROCESSING = Dropzone.UPLOADING; // alias

Dropzone.CANCELED = "canceled";
Dropzone.ERROR = "error";
Dropzone.SUCCESS = "success";

/*

 Bugfix for iOS 6 and 7
 Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
 based on the work of https://github.com/stomita/ios-imagefile-megapixel

 */

// Detecting vertical squash in loaded image.
// Fixes a bug which squash image vertically while drawing into canvas for some images.
// This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
var detectVerticalSquash = function detectVerticalSquash(img) {
  var iw = img.naturalWidth;
  var ih = img.naturalHeight;
  var canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = ih;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var _ctx$getImageData = ctx.getImageData(1, 0, 1, ih),
      data = _ctx$getImageData.data;

  // search image edge pixel position in case it is squashed vertically.


  var sy = 0;
  var ey = ih;
  var py = ih;
  while (py > sy) {
    var alpha = data[(py - 1) * 4 + 3];

    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }

    py = ey + sy >> 1;
  }
  var ratio = py / ih;

  if (ratio === 0) {
    return 1;
  } else {
    return ratio;
  }
};

// A replacement for context.drawImage
// (args are for source and destination).
var drawImageIOSFix = function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
  var vertSquashRatio = detectVerticalSquash(img);
  return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};

// Based on MinifyJpeg
// Source: http://www.perry.cz/files/ExifRestorer.js
// http://elicon.blog57.fc2.com/blog-entry-206.html

var ExifRestore = function () {
  function ExifRestore() {
    _classCallCheck(this, ExifRestore);
  }

  _createClass(ExifRestore, null, [{
    key: "initClass",
    value: function initClass() {
      this.KEY_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    }
  }, {
    key: "encode64",
    value: function encode64(input) {
      var output = '';
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = '';
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = '';
      var i = 0;
      while (true) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + this.KEY_STR.charAt(enc1) + this.KEY_STR.charAt(enc2) + this.KEY_STR.charAt(enc3) + this.KEY_STR.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
        if (!(i < input.length)) {
          break;
        }
      }
      return output;
    }
  }, {
    key: "restore",
    value: function restore(origFileBase64, resizedFileBase64) {
      if (!origFileBase64.match('data:image/jpeg;base64,')) {
        return resizedFileBase64;
      }
      var rawImage = this.decode64(origFileBase64.replace('data:image/jpeg;base64,', ''));
      var segments = this.slice2Segments(rawImage);
      var image = this.exifManipulation(resizedFileBase64, segments);
      return "data:image/jpeg;base64," + this.encode64(image);
    }
  }, {
    key: "exifManipulation",
    value: function exifManipulation(resizedFileBase64, segments) {
      var exifArray = this.getExifArray(segments);
      var newImageArray = this.insertExif(resizedFileBase64, exifArray);
      var aBuffer = new Uint8Array(newImageArray);
      return aBuffer;
    }
  }, {
    key: "getExifArray",
    value: function getExifArray(segments) {
      var seg = undefined;
      var x = 0;
      while (x < segments.length) {
        seg = segments[x];
        if (seg[0] === 255 & seg[1] === 225) {
          return seg;
        }
        x++;
      }
      return [];
    }
  }, {
    key: "insertExif",
    value: function insertExif(resizedFileBase64, exifArray) {
      var imageData = resizedFileBase64.replace('data:image/jpeg;base64,', '');
      var buf = this.decode64(imageData);
      var separatePoint = buf.indexOf(255, 3);
      var mae = buf.slice(0, separatePoint);
      var ato = buf.slice(separatePoint);
      var array = mae;
      array = array.concat(exifArray);
      array = array.concat(ato);
      return array;
    }
  }, {
    key: "slice2Segments",
    value: function slice2Segments(rawImageArray) {
      var head = 0;
      var segments = [];
      while (true) {
        var length;
        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 218) {
          break;
        }
        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 216) {
          head += 2;
        } else {
          length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
          var endPoint = head + length + 2;
          var seg = rawImageArray.slice(head, endPoint);
          segments.push(seg);
          head = endPoint;
        }
        if (head > rawImageArray.length) {
          break;
        }
      }
      return segments;
    }
  }, {
    key: "decode64",
    value: function decode64(input) {
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = '';
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = '';
      var i = 0;
      var buf = [];
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        console.warn('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      while (true) {
        enc1 = this.KEY_STR.indexOf(input.charAt(i++));
        enc2 = this.KEY_STR.indexOf(input.charAt(i++));
        enc3 = this.KEY_STR.indexOf(input.charAt(i++));
        enc4 = this.KEY_STR.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        buf.push(chr1);
        if (enc3 !== 64) {
          buf.push(chr2);
        }
        if (enc4 !== 64) {
          buf.push(chr3);
        }
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
        if (!(i < input.length)) {
          break;
        }
      }
      return buf;
    }
  }]);

  return ExifRestore;
}();

ExifRestore.initClass();

/*
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 */

// @win window reference
// @fn function reference
var contentLoaded = function contentLoaded(win, fn) {
  var done = false;
  var top = true;
  var doc = win.document;
  var root = doc.documentElement;
  var add = doc.addEventListener ? "addEventListener" : "attachEvent";
  var rem = doc.addEventListener ? "removeEventListener" : "detachEvent";
  var pre = doc.addEventListener ? "" : "on";
  var init = function init(e) {
    if (e.type === "readystatechange" && doc.readyState !== "complete") {
      return;
    }
    (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
    if (!done && (done = true)) {
      return fn.call(win, e.type || e);
    }
  };

  var poll = function poll() {
    try {
      root.doScroll("left");
    } catch (e) {
      setTimeout(poll, 50);
      return;
    }
    return init("poll");
  };

  if (doc.readyState !== "complete") {
    if (doc.createEventObject && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (error) {}
      if (top) {
        poll();
      }
    }
    doc[add](pre + "DOMContentLoaded", init, false);
    doc[add](pre + "readystatechange", init, false);
    return win[add](pre + "load", init, false);
  }
};

// As a single function to be able to write tests.
Dropzone._autoDiscoverFunction = function () {
  if (Dropzone.autoDiscover) {
    return Dropzone.discover();
  }
};
contentLoaded(window, Dropzone._autoDiscoverFunction);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}
});

var siema_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}("undefined"!=typeof self?self:commonjsGlobal,function(){return function(e){function t(r){if(i[r])return i[r].exports;var n=i[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var i={};return t.m=e,t.c=i,t.d=function(e,i,r){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:r});},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,i){function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),l=function(){function e(t){var i=this;if(r(this,e),this.config=e.mergeSettings(t),this.selector="string"==typeof this.config.selector?document.querySelector(this.config.selector):this.config.selector,null===this.selector)throw new Error("Something wrong with your selector 😭");this.resolveSlidesNumber(),this.selectorWidth=this.selector.offsetWidth,this.innerElements=[].slice.call(this.selector.children),this.currentSlide=this.config.loop?this.config.startIndex%this.innerElements.length:Math.max(0,Math.min(this.config.startIndex,this.innerElements.length-this.perPage)),this.transformProperty=e.webkitOrNot(),["resizeHandler","touchstartHandler","touchendHandler","touchmoveHandler","mousedownHandler","mouseupHandler","mouseleaveHandler","mousemoveHandler","clickHandler"].forEach(function(e){i[e]=i[e].bind(i);}),this.init();}return s(e,[{key:"attachEvents",value:function(){window.addEventListener("resize",this.resizeHandler),this.config.draggable&&(this.pointerDown=!1,this.drag={startX:0,endX:0,startY:0,letItGo:null,preventClick:!1},this.selector.addEventListener("touchstart",this.touchstartHandler),this.selector.addEventListener("touchend",this.touchendHandler),this.selector.addEventListener("touchmove",this.touchmoveHandler),this.selector.addEventListener("mousedown",this.mousedownHandler),this.selector.addEventListener("mouseup",this.mouseupHandler),this.selector.addEventListener("mouseleave",this.mouseleaveHandler),this.selector.addEventListener("mousemove",this.mousemoveHandler),this.selector.addEventListener("click",this.clickHandler));}},{key:"detachEvents",value:function(){window.removeEventListener("resize",this.resizeHandler),this.selector.removeEventListener("touchstart",this.touchstartHandler),this.selector.removeEventListener("touchend",this.touchendHandler),this.selector.removeEventListener("touchmove",this.touchmoveHandler),this.selector.removeEventListener("mousedown",this.mousedownHandler),this.selector.removeEventListener("mouseup",this.mouseupHandler),this.selector.removeEventListener("mouseleave",this.mouseleaveHandler),this.selector.removeEventListener("mousemove",this.mousemoveHandler),this.selector.removeEventListener("click",this.clickHandler);}},{key:"init",value:function(){this.attachEvents(),this.selector.style.overflow="hidden",this.selector.style.direction=this.config.rtl?"rtl":"ltr",this.buildSliderFrame(),this.config.onInit.call(this);}},{key:"buildSliderFrame",value:function(){var e=this.selectorWidth/this.perPage,t=this.config.loop?this.innerElements.length+2*this.perPage:this.innerElements.length;this.sliderFrame=document.createElement("div"),this.sliderFrame.style.width=e*t+"px",this.enableTransition(),this.config.draggable&&(this.selector.style.cursor="-webkit-grab");var i=document.createDocumentFragment();if(this.config.loop)for(var r=this.innerElements.length-this.perPage;r<this.innerElements.length;r++){var n=this.buildSliderFrameItem(this.innerElements[r].cloneNode(!0));i.appendChild(n);}for(var s=0;s<this.innerElements.length;s++){var l=this.buildSliderFrameItem(this.innerElements[s]);i.appendChild(l);}if(this.config.loop)for(var o=0;o<this.perPage;o++){var a=this.buildSliderFrameItem(this.innerElements[o].cloneNode(!0));i.appendChild(a);}this.sliderFrame.appendChild(i),this.selector.innerHTML="",this.selector.appendChild(this.sliderFrame),this.slideToCurrent();}},{key:"buildSliderFrameItem",value:function(e){var t=document.createElement("div");return t.style.cssFloat=this.config.rtl?"right":"left",t.style.float=this.config.rtl?"right":"left",t.style.width=(this.config.loop?100/(this.innerElements.length+2*this.perPage):100/this.innerElements.length)+"%",t.appendChild(e),t}},{key:"resolveSlidesNumber",value:function(){if("number"==typeof this.config.perPage)this.perPage=this.config.perPage;else if("object"===n(this.config.perPage)){this.perPage=1;for(var e in this.config.perPage)window.innerWidth>=e&&(this.perPage=this.config.perPage[e]);}}},{key:"prev",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;if(this.config.loop){if(this.currentSlide-e<0){this.disableTransition();var r=this.currentSlide+this.innerElements.length,n=this.perPage,s=r+n,l=(this.config.rtl?1:-1)*s*(this.selectorWidth/this.perPage),o=this.config.draggable?this.drag.endX-this.drag.startX:0;this.sliderFrame.style[this.transformProperty]="translate3d("+(l+o)+"px, 0, 0)",this.currentSlide=r-e;}else this.currentSlide=this.currentSlide-e;}else this.currentSlide=Math.max(this.currentSlide-e,0);i!==this.currentSlide&&(this.slideToCurrent(this.config.loop),this.config.onChange.call(this),t&&t.call(this));}}},{key:"next",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;if(this.config.loop){if(this.currentSlide+e>this.innerElements.length-this.perPage){this.disableTransition();var r=this.currentSlide-this.innerElements.length,n=this.perPage,s=r+n,l=(this.config.rtl?1:-1)*s*(this.selectorWidth/this.perPage),o=this.config.draggable?this.drag.endX-this.drag.startX:0;this.sliderFrame.style[this.transformProperty]="translate3d("+(l+o)+"px, 0, 0)",this.currentSlide=r+e;}else this.currentSlide=this.currentSlide+e;}else this.currentSlide=Math.min(this.currentSlide+e,this.innerElements.length-this.perPage);i!==this.currentSlide&&(this.slideToCurrent(this.config.loop),this.config.onChange.call(this),t&&t.call(this));}}},{key:"disableTransition",value:function(){this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;}},{key:"enableTransition",value:function(){this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing;}},{key:"goTo",value:function(e,t){if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;this.currentSlide=this.config.loop?e%this.innerElements.length:Math.min(Math.max(e,0),this.innerElements.length-this.perPage),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this));}}},{key:"slideToCurrent",value:function(e){var t=this,i=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,r=(this.config.rtl?1:-1)*i*(this.selectorWidth/this.perPage);e?requestAnimationFrame(function(){requestAnimationFrame(function(){t.enableTransition(),t.sliderFrame.style[t.transformProperty]="translate3d("+r+"px, 0, 0)";});}):this.sliderFrame.style[this.transformProperty]="translate3d("+r+"px, 0, 0)";}},{key:"updateAfterDrag",value:function(){var e=(this.config.rtl?-1:1)*(this.drag.endX-this.drag.startX),t=Math.abs(e),i=this.config.multipleDrag?Math.ceil(t/(this.selectorWidth/this.perPage)):1,r=e>0&&this.currentSlide-i<0,n=e<0&&this.currentSlide+i>this.innerElements.length-this.perPage;e>0&&t>this.config.threshold&&this.innerElements.length>this.perPage?this.prev(i):e<0&&t>this.config.threshold&&this.innerElements.length>this.perPage&&this.next(i),this.slideToCurrent(r||n);}},{key:"resizeHandler",value:function(){this.resolveSlidesNumber(),this.currentSlide+this.perPage>this.innerElements.length&&(this.currentSlide=this.innerElements.length<=this.perPage?0:this.innerElements.length-this.perPage),this.selectorWidth=this.selector.offsetWidth,this.buildSliderFrame();}},{key:"clearDrag",value:function(){this.drag={startX:0,endX:0,startY:0,letItGo:null,preventClick:this.drag.preventClick};}},{key:"touchstartHandler",value:function(e){-1!==["TEXTAREA","OPTION","INPUT","SELECT"].indexOf(e.target.nodeName)||(e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.touches[0].pageX,this.drag.startY=e.touches[0].pageY);}},{key:"touchendHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.enableTransition(),this.drag.endX&&this.updateAfterDrag(),this.clearDrag();}},{key:"touchmoveHandler",value:function(e){if(e.stopPropagation(),null===this.drag.letItGo&&(this.drag.letItGo=Math.abs(this.drag.startY-e.touches[0].pageY)<Math.abs(this.drag.startX-e.touches[0].pageX)),this.pointerDown&&this.drag.letItGo){e.preventDefault(),this.drag.endX=e.touches[0].pageX,this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;var t=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,i=t*(this.selectorWidth/this.perPage),r=this.drag.endX-this.drag.startX,n=this.config.rtl?i+r:i-r;this.sliderFrame.style[this.transformProperty]="translate3d("+(this.config.rtl?1:-1)*n+"px, 0, 0)";}}},{key:"mousedownHandler",value:function(e){-1!==["TEXTAREA","OPTION","INPUT","SELECT"].indexOf(e.target.nodeName)||(e.preventDefault(),e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.pageX);}},{key:"mouseupHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.enableTransition(),this.drag.endX&&this.updateAfterDrag(),this.clearDrag();}},{key:"mousemoveHandler",value:function(e){if(e.preventDefault(),this.pointerDown){"A"===e.target.nodeName&&(this.drag.preventClick=!0),this.drag.endX=e.pageX,this.selector.style.cursor="-webkit-grabbing",this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;var t=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,i=t*(this.selectorWidth/this.perPage),r=this.drag.endX-this.drag.startX,n=this.config.rtl?i+r:i-r;this.sliderFrame.style[this.transformProperty]="translate3d("+(this.config.rtl?1:-1)*n+"px, 0, 0)";}}},{key:"mouseleaveHandler",value:function(e){this.pointerDown&&(this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.drag.endX=e.pageX,this.drag.preventClick=!1,this.enableTransition(),this.updateAfterDrag(),this.clearDrag());}},{key:"clickHandler",value:function(e){this.drag.preventClick&&e.preventDefault(),this.drag.preventClick=!1;}},{key:"remove",value:function(e,t){if(e<0||e>=this.innerElements.length)throw new Error("Item to remove doesn't exist 😭");var i=e<this.currentSlide,r=this.currentSlide+this.perPage-1===e;(i||r)&&this.currentSlide--,this.innerElements.splice(e,1),this.buildSliderFrame(),t&&t.call(this);}},{key:"insert",value:function(e,t,i){if(t<0||t>this.innerElements.length+1)throw new Error("Unable to inset it at this index 😭");if(-1!==this.innerElements.indexOf(e))throw new Error("The same item in a carousel? Really? Nope 😭");var r=t<=this.currentSlide>0&&this.innerElements.length;this.currentSlide=r?this.currentSlide+1:this.currentSlide,this.innerElements.splice(t,0,e),this.buildSliderFrame(),i&&i.call(this);}},{key:"prepend",value:function(e,t){this.insert(e,0),t&&t.call(this);}},{key:"append",value:function(e,t){this.insert(e,this.innerElements.length+1),t&&t.call(this);}},{key:"destroy",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments[1];if(this.detachEvents(),this.selector.style.cursor="auto",e){for(var i=document.createDocumentFragment(),r=0;r<this.innerElements.length;r++)i.appendChild(this.innerElements[r]);this.selector.innerHTML="",this.selector.appendChild(i),this.selector.removeAttribute("style");}t&&t.call(this);}}],[{key:"mergeSettings",value:function(e){var t={selector:".siema",duration:200,easing:"ease-out",perPage:1,startIndex:0,draggable:!0,multipleDrag:!0,threshold:20,loop:!1,rtl:!1,onInit:function(){},onChange:function(){}},i=e;for(var r in i)t[r]=i[r];return t}},{key:"webkitOrNot",value:function(){return "string"==typeof document.documentElement.style.transform?"transform":"WebkitTransform"}}]),e}();t.default=l,e.exports=t.default;}])});
});

var Siema = unwrapExports(siema_min);
var siema_min_1 = siema_min.Siema;

function btnSuccessOnSubmit() {
  var button = document.getElementById("submitButton");
  button.classList.remove('btn-primary');
  button.classList.add('btn-success');
  button.setAttribute('disabled', '');
  button.innerHTML = 'Erledigt!';
}

//postData(`http://example.com/answer`, {answer: 42})
//  .then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
//  .catch(error => console.error(error));

function deleteData(url = ``) {
  // Default options are marked with *
    return fetch(url, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            // "Content-Type": "application/json; charset=utf-8",
             "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    })
    .then(() => location.reload(true)); // parses response to JSON
}

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

function createActionURL() {
  var accessCodeInput = document.getElementById("accessCodeInput");
  var form = document.getElementById("enterAlbumForm");
  form.action = "/album/" + accessCodeInput.value;
}

window.deleteData = deleteData;
window.openFullscreen = openFullscreen;
window.closeFullscreen = closeFullscreen;
window.createActionURL = createActionURL;
window.Siema = Siema;

document.querySelectorAll(".hasSubmitButton").forEach((form) => {
  form.addEventListener("submit", btnSuccessOnSubmit);
});

dropzone.options.partyUpload = {
  acceptedFiles: 'image/*',
  maxFilesize: 7,
  init: function() {
          this.on("sending", function(file, xhr, formData){
            formData.append("albumid", "loremipsum");
          });
        }
};

}());

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9kcm9wem9uZS9kaXN0L2Ryb3B6b25lLmpzIiwibm9kZV9tb2R1bGVzL3NpZW1hL2Rpc3Qvc2llbWEubWluLmpzIiwic3JjL2pzL2J0bl9zdWNjZXNzX29uX3N1Ym1pdC5qcyIsInNyYy9qcy9kZWxldGVfcmVxdWVzdC5qcyIsInNyYy9qcy9mdWxsc2NyZWVuLmpzIiwic3JjL2pzL2NyZWF0ZV9hY3Rpb25fdXJsLmpzIiwic3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qXG4gKlxuICogTW9yZSBpbmZvIGF0IFt3d3cuZHJvcHpvbmVqcy5jb21dKGh0dHA6Ly93d3cuZHJvcHpvbmVqcy5jb20pXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEyLCBNYXRpYXMgTWVub1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG5cbi8vIFRoZSBFbWl0dGVyIGNsYXNzIHByb3ZpZGVzIHRoZSBhYmlsaXR5IHRvIGNhbGwgYC5vbigpYCBvbiBEcm9wem9uZSB0byBsaXN0ZW5cbi8vIHRvIGV2ZW50cy5cbi8vIEl0IGlzIHN0cm9uZ2x5IGJhc2VkIG9uIGNvbXBvbmVudCdzIGVtaXR0ZXIgY2xhc3MsIGFuZCBJIHJlbW92ZWQgdGhlXG4vLyBmdW5jdGlvbmFsaXR5IGJlY2F1c2Ugb2YgdGhlIGRlcGVuZGVuY3kgaGVsbCB3aXRoIGRpZmZlcmVudCBmcmFtZXdvcmtzLlxudmFyIEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEVtaXR0ZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEVtaXR0ZXIpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEVtaXR0ZXIsIFt7XG4gICAga2V5OiBcIm9uXCIsXG5cbiAgICAvLyBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGdpdmVuIGV2ZW50XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbikge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAgICAgLy8gQ3JlYXRlIG5hbWVzcGFjZSBmb3IgdGhpcyBldmVudFxuICAgICAgaWYgKCF0aGlzLl9jYWxsYmFja3NbZXZlbnRdKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NhbGxiYWNrc1tldmVudF0ucHVzaChmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZW1pdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbWl0KGV2ZW50KSB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICAgICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IGNhbGxiYWNrcywgX2lzQXJyYXkgPSB0cnVlLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYgPSBfaXRlcmF0b3JbX2krK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pID0gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaS5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYgPSBfaS52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBfcmVmO1xuXG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyIGZvciBnaXZlbiBldmVudC4gSWYgZm4gaXMgbm90IHByb3ZpZGVkLCBhbGwgZXZlbnRcbiAgICAvLyBsaXN0ZW5lcnMgZm9yIHRoYXQgZXZlbnQgd2lsbCBiZSByZW1vdmVkLiBJZiBuZWl0aGVyIGlzIHByb3ZpZGVkLCBhbGxcbiAgICAvLyBldmVudCBsaXN0ZW5lcnMgd2lsbCBiZSByZW1vdmVkLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwib2ZmXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9mZihldmVudCwgZm4pIHtcbiAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBzcGVjaWZpYyBldmVudFxuICAgICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2FsbGJhY2tzW2ldO1xuICAgICAgICBpZiAoY2FsbGJhY2sgPT09IGZuKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRW1pdHRlcjtcbn0oKTtcblxudmFyIERyb3B6b25lID0gZnVuY3Rpb24gKF9FbWl0dGVyKSB7XG4gIF9pbmhlcml0cyhEcm9wem9uZSwgX0VtaXR0ZXIpO1xuXG4gIF9jcmVhdGVDbGFzcyhEcm9wem9uZSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiaW5pdENsYXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXRDbGFzcygpIHtcblxuICAgICAgLy8gRXhwb3NpbmcgdGhlIGVtaXR0ZXIgY2xhc3MsIG1haW5seSBmb3IgdGVzdHNcbiAgICAgIHRoaXMucHJvdG90eXBlLkVtaXR0ZXIgPSBFbWl0dGVyO1xuXG4gICAgICAvKlxuICAgICAgIFRoaXMgaXMgYSBsaXN0IG9mIGFsbCBhdmFpbGFibGUgZXZlbnRzIHlvdSBjYW4gcmVnaXN0ZXIgb24gYSBkcm9wem9uZSBvYmplY3QuXG4gICAgICAgIFlvdSBjYW4gcmVnaXN0ZXIgYW4gZXZlbnQgaGFuZGxlciBsaWtlIHRoaXM6XG4gICAgICAgIGRyb3B6b25lLm9uKFwiZHJhZ0VudGVyXCIsIGZ1bmN0aW9uKCkgeyB9KTtcbiAgICAgICAgKi9cbiAgICAgIHRoaXMucHJvdG90eXBlLmV2ZW50cyA9IFtcImRyb3BcIiwgXCJkcmFnc3RhcnRcIiwgXCJkcmFnZW5kXCIsIFwiZHJhZ2VudGVyXCIsIFwiZHJhZ292ZXJcIiwgXCJkcmFnbGVhdmVcIiwgXCJhZGRlZGZpbGVcIiwgXCJhZGRlZGZpbGVzXCIsIFwicmVtb3ZlZGZpbGVcIiwgXCJ0aHVtYm5haWxcIiwgXCJlcnJvclwiLCBcImVycm9ybXVsdGlwbGVcIiwgXCJwcm9jZXNzaW5nXCIsIFwicHJvY2Vzc2luZ211bHRpcGxlXCIsIFwidXBsb2FkcHJvZ3Jlc3NcIiwgXCJ0b3RhbHVwbG9hZHByb2dyZXNzXCIsIFwic2VuZGluZ1wiLCBcInNlbmRpbmdtdWx0aXBsZVwiLCBcInN1Y2Nlc3NcIiwgXCJzdWNjZXNzbXVsdGlwbGVcIiwgXCJjYW5jZWxlZFwiLCBcImNhbmNlbGVkbXVsdGlwbGVcIiwgXCJjb21wbGV0ZVwiLCBcImNvbXBsZXRlbXVsdGlwbGVcIiwgXCJyZXNldFwiLCBcIm1heGZpbGVzZXhjZWVkZWRcIiwgXCJtYXhmaWxlc3JlYWNoZWRcIiwgXCJxdWV1ZWNvbXBsZXRlXCJdO1xuXG4gICAgICB0aGlzLnByb3RvdHlwZS5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhcyB0byBiZSBzcGVjaWZpZWQgb24gZWxlbWVudHMgb3RoZXIgdGhhbiBmb3JtIChvciB3aGVuIHRoZSBmb3JtXG4gICAgICAgICAqIGRvZXNuJ3QgaGF2ZSBhbiBgYWN0aW9uYCBhdHRyaWJ1dGUpLiBZb3UgY2FuIGFsc29cbiAgICAgICAgICogcHJvdmlkZSBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBgZmlsZXNgIGFuZFxuICAgICAgICAgKiBtdXN0IHJldHVybiB0aGUgdXJsIChzaW5jZSBgdjMuMTIuMGApXG4gICAgICAgICAqL1xuICAgICAgICB1cmw6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbiBiZSBjaGFuZ2VkIHRvIGBcInB1dFwiYCBpZiBuZWNlc3NhcnkuIFlvdSBjYW4gYWxzbyBwcm92aWRlIGEgZnVuY3Rpb25cbiAgICAgICAgICogdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGBmaWxlc2AgYW5kIG11c3QgcmV0dXJuIHRoZSBtZXRob2QgKHNpbmNlIGB2My4xMi4wYCkuXG4gICAgICAgICAqL1xuICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaWxsIGJlIHNldCBvbiB0aGUgWEhSZXF1ZXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRpbWVvdXQgZm9yIHRoZSBYSFIgcmVxdWVzdHMgaW4gbWlsbGlzZWNvbmRzIChzaW5jZSBgdjQuNC4wYCkuXG4gICAgICAgICAqL1xuICAgICAgICB0aW1lb3V0OiAzMDAwMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSG93IG1hbnkgZmlsZSB1cGxvYWRzIHRvIHByb2Nlc3MgaW4gcGFyYWxsZWwgKFNlZSB0aGVcbiAgICAgICAgICogRW5xdWV1aW5nIGZpbGUgdXBsb2FkcyogZG9jdW1lbnRhdGlvbiBzZWN0aW9uIGZvciBtb3JlIGluZm8pXG4gICAgICAgICAqL1xuICAgICAgICBwYXJhbGxlbFVwbG9hZHM6IDIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgdG8gc2VuZCBtdWx0aXBsZSBmaWxlcyBpbiBvbmUgcmVxdWVzdC4gSWZcbiAgICAgICAgICogdGhpcyBpdCBzZXQgdG8gdHJ1ZSwgdGhlbiB0aGUgZmFsbGJhY2sgZmlsZSBpbnB1dCBlbGVtZW50IHdpbGxcbiAgICAgICAgICogaGF2ZSB0aGUgYG11bHRpcGxlYCBhdHRyaWJ1dGUgYXMgd2VsbC4gVGhpcyBvcHRpb24gd2lsbFxuICAgICAgICAgKiBhbHNvIHRyaWdnZXIgYWRkaXRpb25hbCBldmVudHMgKGxpa2UgYHByb2Nlc3NpbmdtdWx0aXBsZWApLiBTZWUgdGhlIGV2ZW50c1xuICAgICAgICAgKiBkb2N1bWVudGF0aW9uIHNlY3Rpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgeW91IHdhbnQgZmlsZXMgdG8gYmUgdXBsb2FkZWQgaW4gY2h1bmtzIHRvIHlvdXIgc2VydmVyLiBUaGlzIGNhbid0IGJlXG4gICAgICAgICAqIHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBgdXBsb2FkTXVsdGlwbGVgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTZWUgW2NodW5rc1VwbG9hZGVkXSgjY29uZmlnLWNodW5rc1VwbG9hZGVkKSBmb3IgdGhlIGNhbGxiYWNrIHRvIGZpbmFsaXNlIGFuIHVwbG9hZC5cbiAgICAgICAgICovXG4gICAgICAgIGNodW5raW5nOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYGNodW5raW5nYCBpcyBlbmFibGVkLCB0aGlzIGRlZmluZXMgd2hldGhlciAqKmV2ZXJ5KiogZmlsZSBzaG91bGQgYmUgY2h1bmtlZCxcbiAgICAgICAgICogZXZlbiBpZiB0aGUgZmlsZSBzaXplIGlzIGJlbG93IGNodW5rU2l6ZS4gVGhpcyBtZWFucywgdGhhdCB0aGUgYWRkaXRpb25hbCBjaHVua1xuICAgICAgICAgKiBmb3JtIGRhdGEgd2lsbCBiZSBzdWJtaXR0ZWQgYW5kIHRoZSBgY2h1bmtzVXBsb2FkZWRgIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZvcmNlQ2h1bmtpbmc6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBgY2h1bmtpbmdgIGlzIGB0cnVlYCwgdGhlbiB0aGlzIGRlZmluZXMgdGhlIGNodW5rIHNpemUgaW4gYnl0ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBjaHVua1NpemU6IDIwMDAwMDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGB0cnVlYCwgdGhlIGluZGl2aWR1YWwgY2h1bmtzIG9mIGEgZmlsZSBhcmUgYmVpbmcgdXBsb2FkZWQgc2ltdWx0YW5lb3VzbHkuXG4gICAgICAgICAqL1xuICAgICAgICBwYXJhbGxlbENodW5rVXBsb2FkczogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgYSBjaHVuayBzaG91bGQgYmUgcmV0cmllZCBpZiBpdCBmYWlscy5cbiAgICAgICAgICovXG4gICAgICAgIHJldHJ5Q2h1bmtzOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYHJldHJ5Q2h1bmtzYCBpcyB0cnVlLCBob3cgbWFueSB0aW1lcyBzaG91bGQgaXQgYmUgcmV0cmllZC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHJ5Q2h1bmtzTGltaXQ6IDMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIG5vdCBgbnVsbGAgZGVmaW5lcyBob3cgbWFueSBmaWxlcyB0aGlzIERyb3B6b25lIGhhbmRsZXMuIElmIGl0IGV4Y2VlZHMsXG4gICAgICAgICAqIHRoZSBldmVudCBgbWF4ZmlsZXNleGNlZWRlZGAgd2lsbCBiZSBjYWxsZWQuIFRoZSBkcm9wem9uZSBlbGVtZW50IGdldHMgdGhlXG4gICAgICAgICAqIGNsYXNzIGBkei1tYXgtZmlsZXMtcmVhY2hlZGAgYWNjb3JkaW5nbHkgc28geW91IGNhbiBwcm92aWRlIHZpc3VhbCBmZWVkYmFjay5cbiAgICAgICAgICovXG4gICAgICAgIG1heEZpbGVzaXplOiAyNTYsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBuYW1lIG9mIHRoZSBmaWxlIHBhcmFtIHRoYXQgZ2V0cyB0cmFuc2ZlcnJlZC5cbiAgICAgICAgICogKipOT1RFKio6IElmIHlvdSBoYXZlIHRoZSBvcHRpb24gIGB1cGxvYWRNdWx0aXBsZWAgc2V0IHRvIGB0cnVlYCwgdGhlblxuICAgICAgICAgKiBEcm9wem9uZSB3aWxsIGFwcGVuZCBgW11gIHRvIHRoZSBuYW1lLlxuICAgICAgICAgKi9cbiAgICAgICAgcGFyYW1OYW1lOiBcImZpbGVcIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciB0aHVtYm5haWxzIGZvciBpbWFnZXMgc2hvdWxkIGJlIGdlbmVyYXRlZFxuICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlSW1hZ2VUaHVtYm5haWxzOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbiBNQi4gV2hlbiB0aGUgZmlsZW5hbWUgZXhjZWVkcyB0aGlzIGxpbWl0LCB0aGUgdGh1bWJuYWlsIHdpbGwgbm90IGJlIGdlbmVyYXRlZC5cbiAgICAgICAgICovXG4gICAgICAgIG1heFRodW1ibmFpbEZpbGVzaXplOiAxMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYG51bGxgLCB0aGUgcmF0aW8gb2YgdGhlIGltYWdlIHdpbGwgYmUgdXNlZCB0byBjYWxjdWxhdGUgaXQuXG4gICAgICAgICAqL1xuICAgICAgICB0aHVtYm5haWxXaWR0aDogMTIwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2FtZSBhcyBgdGh1bWJuYWlsV2lkdGhgLiBJZiBib3RoIGFyZSBudWxsLCBpbWFnZXMgd2lsbCBub3QgYmUgcmVzaXplZC5cbiAgICAgICAgICovXG4gICAgICAgIHRodW1ibmFpbEhlaWdodDogMTIwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIb3cgdGhlIGltYWdlcyBzaG91bGQgYmUgc2NhbGVkIGRvd24gaW4gY2FzZSBib3RoLCBgdGh1bWJuYWlsV2lkdGhgIGFuZCBgdGh1bWJuYWlsSGVpZ2h0YCBhcmUgcHJvdmlkZWQuXG4gICAgICAgICAqIENhbiBiZSBlaXRoZXIgYGNvbnRhaW5gIG9yIGBjcm9wYC5cbiAgICAgICAgICovXG4gICAgICAgIHRodW1ibmFpbE1ldGhvZDogJ2Nyb3AnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBzZXQsIGltYWdlcyB3aWxsIGJlIHJlc2l6ZWQgdG8gdGhlc2UgZGltZW5zaW9ucyBiZWZvcmUgYmVpbmcgKip1cGxvYWRlZCoqLlxuICAgICAgICAgKiBJZiBvbmx5IG9uZSwgYHJlc2l6ZVdpZHRoYCAqKm9yKiogYHJlc2l6ZUhlaWdodGAgaXMgcHJvdmlkZWQsIHRoZSBvcmlnaW5hbCBhc3BlY3RcbiAgICAgICAgICogcmF0aW8gb2YgdGhlIGZpbGUgd2lsbCBiZSBwcmVzZXJ2ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBgb3B0aW9ucy50cmFuc2Zvcm1GaWxlYCBmdW5jdGlvbiB1c2VzIHRoZXNlIG9wdGlvbnMsIHNvIGlmIHRoZSBgdHJhbnNmb3JtRmlsZWAgZnVuY3Rpb25cbiAgICAgICAgICogaXMgb3ZlcnJpZGRlbiwgdGhlc2Ugb3B0aW9ucyBkb24ndCBkbyBhbnl0aGluZy5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZVdpZHRoOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWUgYHJlc2l6ZVdpZHRoYC5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZUhlaWdodDogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1pbWUgdHlwZSBvZiB0aGUgcmVzaXplZCBpbWFnZSAoYmVmb3JlIGl0IGdldHMgdXBsb2FkZWQgdG8gdGhlIHNlcnZlcikuXG4gICAgICAgICAqIElmIGBudWxsYCB0aGUgb3JpZ2luYWwgbWltZSB0eXBlIHdpbGwgYmUgdXNlZC4gVG8gZm9yY2UganBlZywgZm9yIGV4YW1wbGUsIHVzZSBgaW1hZ2UvanBlZ2AuXG4gICAgICAgICAqIFNlZSBgcmVzaXplV2lkdGhgIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzaXplTWltZVR5cGU6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBxdWFsaXR5IG9mIHRoZSByZXNpemVkIGltYWdlcy4gU2VlIGByZXNpemVXaWR0aGAuXG4gICAgICAgICAqL1xuICAgICAgICByZXNpemVRdWFsaXR5OiAwLjgsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhvdyB0aGUgaW1hZ2VzIHNob3VsZCBiZSBzY2FsZWQgZG93biBpbiBjYXNlIGJvdGgsIGByZXNpemVXaWR0aGAgYW5kIGByZXNpemVIZWlnaHRgIGFyZSBwcm92aWRlZC5cbiAgICAgICAgICogQ2FuIGJlIGVpdGhlciBgY29udGFpbmAgb3IgYGNyb3BgLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzaXplTWV0aG9kOiAnY29udGFpbicsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBiYXNlIHRoYXQgaXMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGZpbGVzaXplLiBZb3UgY2FuIGNoYW5nZSB0aGlzIHRvXG4gICAgICAgICAqIDEwMjQgaWYgeW91IHdvdWxkIHJhdGhlciBkaXNwbGF5IGtpYmlieXRlcywgbWViaWJ5dGVzLCBldGMuLi5cbiAgICAgICAgICogMTAyNCBpcyB0ZWNobmljYWxseSBpbmNvcnJlY3QsIGJlY2F1c2UgYDEwMjQgYnl0ZXNgIGFyZSBgMSBraWJpYnl0ZWAgbm90IGAxIGtpbG9ieXRlYC5cbiAgICAgICAgICogWW91IGNhbiBjaGFuZ2UgdGhpcyB0byBgMTAyNGAgaWYgeW91IGRvbid0IGNhcmUgYWJvdXQgdmFsaWRpdHkuXG4gICAgICAgICAqL1xuICAgICAgICBmaWxlc2l6ZUJhc2U6IDEwMDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbiBiZSB1c2VkIHRvIGxpbWl0IHRoZSBtYXhpbXVtIG51bWJlciBvZiBmaWxlcyB0aGF0IHdpbGwgYmUgaGFuZGxlZCBieSB0aGlzIERyb3B6b25lXG4gICAgICAgICAqL1xuICAgICAgICBtYXhGaWxlczogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gb3B0aW9uYWwgb2JqZWN0IHRvIHNlbmQgYWRkaXRpb25hbCBoZWFkZXJzIHRvIHRoZSBzZXJ2ZXIuIEVnOlxuICAgICAgICAgKiBgeyBcIk15LUF3ZXNvbWUtSGVhZGVyXCI6IFwiaGVhZGVyIHZhbHVlXCIgfWBcbiAgICAgICAgICovXG4gICAgICAgIGhlYWRlcnM6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGB0cnVlYCwgdGhlIGRyb3B6b25lIGVsZW1lbnQgaXRzZWxmIHdpbGwgYmUgY2xpY2thYmxlLCBpZiBgZmFsc2VgXG4gICAgICAgICAqIG5vdGhpbmcgd2lsbCBiZSBjbGlja2FibGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGFuIEhUTUwgZWxlbWVudCwgYSBDU1Mgc2VsZWN0b3IgKGZvciBtdWx0aXBsZSBlbGVtZW50cylcbiAgICAgICAgICogb3IgYW4gYXJyYXkgb2YgdGhvc2UuIEluIHRoYXQgY2FzZSwgYWxsIG9mIHRob3NlIGVsZW1lbnRzIHdpbGwgdHJpZ2dlciBhblxuICAgICAgICAgKiB1cGxvYWQgd2hlbiBjbGlja2VkLlxuICAgICAgICAgKi9cbiAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIGhpZGRlbiBmaWxlcyBpbiBkaXJlY3RvcmllcyBzaG91bGQgYmUgaWdub3JlZC5cbiAgICAgICAgICovXG4gICAgICAgIGlnbm9yZUhpZGRlbkZpbGVzOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBgYWNjZXB0YCBjaGVja3MgdGhlIGZpbGUncyBtaW1lIHR5cGUgb3JcbiAgICAgICAgICogZXh0ZW5zaW9uIGFnYWluc3QgdGhpcyBsaXN0LiBUaGlzIGlzIGEgY29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgbWltZVxuICAgICAgICAgKiB0eXBlcyBvciBmaWxlIGV4dGVuc2lvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEVnLjogYGltYWdlLyosYXBwbGljYXRpb24vcGRmLC5wc2RgXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBEcm9wem9uZSBpcyBgY2xpY2thYmxlYCB0aGlzIG9wdGlvbiB3aWxsIGFsc28gYmUgdXNlZCBhc1xuICAgICAgICAgKiBbYGFjY2VwdGBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvSFRNTC9FbGVtZW50L2lucHV0I2F0dHItYWNjZXB0KVxuICAgICAgICAgKiBwYXJhbWV0ZXIgb24gdGhlIGhpZGRlbiBmaWxlIGlucHV0IGFzIHdlbGwuXG4gICAgICAgICAqL1xuICAgICAgICBhY2NlcHRlZEZpbGVzOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAqKkRlcHJlY2F0ZWQhKipcbiAgICAgICAgICogVXNlIGFjY2VwdGVkRmlsZXMgaW5zdGVhZC5cbiAgICAgICAgICovXG4gICAgICAgIGFjY2VwdGVkTWltZVR5cGVzOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBmYWxzZSwgZmlsZXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgcXVldWUgYnV0IHRoZSBxdWV1ZSB3aWxsIG5vdCBiZVxuICAgICAgICAgKiBwcm9jZXNzZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICogVGhpcyBjYW4gYmUgdXNlZnVsIGlmIHlvdSBuZWVkIHNvbWUgYWRkaXRpb25hbCB1c2VyIGlucHV0IGJlZm9yZSBzZW5kaW5nXG4gICAgICAgICAqIGZpbGVzIChvciBpZiB5b3Ugd2FudCB3YW50IGFsbCBmaWxlcyBzZW50IGF0IG9uY2UpLlxuICAgICAgICAgKiBJZiB5b3UncmUgcmVhZHkgdG8gc2VuZCB0aGUgZmlsZSBzaW1wbHkgY2FsbCBgbXlEcm9wem9uZS5wcm9jZXNzUXVldWUoKWAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFNlZSB0aGUgW2VucXVldWluZyBmaWxlIHVwbG9hZHNdKCNlbnF1ZXVpbmctZmlsZS11cGxvYWRzKSBkb2N1bWVudGF0aW9uXG4gICAgICAgICAqIHNlY3Rpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBmYWxzZSwgZmlsZXMgYWRkZWQgdG8gdGhlIGRyb3B6b25lIHdpbGwgbm90IGJlIHF1ZXVlZCBieSBkZWZhdWx0LlxuICAgICAgICAgKiBZb3UnbGwgaGF2ZSB0byBjYWxsIGBlbnF1ZXVlRmlsZShmaWxlKWAgbWFudWFsbHkuXG4gICAgICAgICAqL1xuICAgICAgICBhdXRvUXVldWU6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGB0cnVlYCwgdGhpcyB3aWxsIGFkZCBhIGxpbmsgdG8gZXZlcnkgZmlsZSBwcmV2aWV3IHRvIHJlbW92ZSBvciBjYW5jZWwgKGlmXG4gICAgICAgICAqIGFscmVhZHkgdXBsb2FkaW5nKSB0aGUgZmlsZS4gVGhlIGBkaWN0Q2FuY2VsVXBsb2FkYCwgYGRpY3RDYW5jZWxVcGxvYWRDb25maXJtYXRpb25gXG4gICAgICAgICAqIGFuZCBgZGljdFJlbW92ZUZpbGVgIG9wdGlvbnMgYXJlIHVzZWQgZm9yIHRoZSB3b3JkaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYWRkUmVtb3ZlTGlua3M6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZpbmVzIHdoZXJlIHRvIGRpc3BsYXkgdGhlIGZpbGUgcHJldmlld3Mg4oCTIGlmIGBudWxsYCB0aGVcbiAgICAgICAgICogRHJvcHpvbmUgZWxlbWVudCBpdHNlbGYgaXMgdXNlZC4gQ2FuIGJlIGEgcGxhaW4gYEhUTUxFbGVtZW50YCBvciBhIENTU1xuICAgICAgICAgKiBzZWxlY3Rvci4gVGhlIGVsZW1lbnQgc2hvdWxkIGhhdmUgdGhlIGBkcm9wem9uZS1wcmV2aWV3c2AgY2xhc3Mgc29cbiAgICAgICAgICogdGhlIHByZXZpZXdzIGFyZSBkaXNwbGF5ZWQgcHJvcGVybHkuXG4gICAgICAgICAqL1xuICAgICAgICBwcmV2aWV3c0NvbnRhaW5lcjogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBpcyB0aGUgZWxlbWVudCB0aGUgaGlkZGVuIGlucHV0IGZpZWxkICh3aGljaCBpcyB1c2VkIHdoZW4gY2xpY2tpbmcgb24gdGhlXG4gICAgICAgICAqIGRyb3B6b25lIHRvIHRyaWdnZXIgZmlsZSBzZWxlY3Rpb24pIHdpbGwgYmUgYXBwZW5kZWQgdG8uIFRoaXMgbWlnaHRcbiAgICAgICAgICogYmUgaW1wb3J0YW50IGluIGNhc2UgeW91IHVzZSBmcmFtZXdvcmtzIHRvIHN3aXRjaCB0aGUgY29udGVudCBvZiB5b3VyIHBhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIENhbiBiZSBhIHNlbGVjdG9yIHN0cmluZywgb3IgYW4gZWxlbWVudCBkaXJlY3RseS5cbiAgICAgICAgICovXG4gICAgICAgIGhpZGRlbklucHV0Q29udGFpbmVyOiBcImJvZHlcIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgbnVsbCwgbm8gY2FwdHVyZSB0eXBlIHdpbGwgYmUgc3BlY2lmaWVkXG4gICAgICAgICAqIElmIGNhbWVyYSwgbW9iaWxlIGRldmljZXMgd2lsbCBza2lwIHRoZSBmaWxlIHNlbGVjdGlvbiBhbmQgY2hvb3NlIGNhbWVyYVxuICAgICAgICAgKiBJZiBtaWNyb3Bob25lLCBtb2JpbGUgZGV2aWNlcyB3aWxsIHNraXAgdGhlIGZpbGUgc2VsZWN0aW9uIGFuZCBjaG9vc2UgdGhlIG1pY3JvcGhvbmVcbiAgICAgICAgICogSWYgY2FtY29yZGVyLCBtb2JpbGUgZGV2aWNlcyB3aWxsIHNraXAgdGhlIGZpbGUgc2VsZWN0aW9uIGFuZCBjaG9vc2UgdGhlIGNhbWVyYSBpbiB2aWRlbyBtb2RlXG4gICAgICAgICAqIE9uIGFwcGxlIGRldmljZXMgbXVsdGlwbGUgbXVzdCBiZSBzZXQgdG8gZmFsc2UuICBBY2NlcHRlZEZpbGVzIG1heSBuZWVkIHRvXG4gICAgICAgICAqIGJlIHNldCB0byBhbiBhcHByb3ByaWF0ZSBtaW1lIHR5cGUgKGUuZy4gXCJpbWFnZS8qXCIsIFwiYXVkaW8vKlwiLCBvciBcInZpZGVvLypcIikuXG4gICAgICAgICAqL1xuICAgICAgICBjYXB0dXJlOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAqKkRlcHJlY2F0ZWQqKi4gVXNlIGByZW5hbWVGaWxlYCBpbnN0ZWFkLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVuYW1lRmlsZW5hbWU6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIGJlZm9yZSB0aGUgZmlsZSBpcyB1cGxvYWRlZCB0byB0aGUgc2VydmVyIGFuZCByZW5hbWVzIHRoZSBmaWxlLlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIGBGaWxlYCBhcyBhcmd1bWVudCBhbmQgY2FuIHVzZSB0aGUgYGZpbGUubmFtZWAuIFRoZSBhY3R1YWwgbmFtZSBvZiB0aGVcbiAgICAgICAgICogZmlsZSB0aGF0IGdldHMgdXNlZCBkdXJpbmcgdGhlIHVwbG9hZCBjYW4gYmUgYWNjZXNzZWQgdGhyb3VnaCBgZmlsZS51cGxvYWQuZmlsZW5hbWVgLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVuYW1lRmlsZTogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYHRydWVgIHRoZSBmYWxsYmFjayB3aWxsIGJlIGZvcmNlZC4gVGhpcyBpcyB2ZXJ5IHVzZWZ1bCB0byB0ZXN0IHlvdXIgc2VydmVyXG4gICAgICAgICAqIGltcGxlbWVudGF0aW9ucyBmaXJzdCBhbmQgbWFrZSBzdXJlIHRoYXQgZXZlcnl0aGluZyB3b3JrcyBhc1xuICAgICAgICAgKiBleHBlY3RlZCB3aXRob3V0IGRyb3B6b25lIGlmIHlvdSBleHBlcmllbmNlIHByb2JsZW1zLCBhbmQgdG8gdGVzdFxuICAgICAgICAgKiBob3cgeW91ciBmYWxsYmFja3Mgd2lsbCBsb29rLlxuICAgICAgICAgKi9cbiAgICAgICAgZm9yY2VGYWxsYmFjazogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0ZXh0IHVzZWQgYmVmb3JlIGFueSBmaWxlcyBhcmUgZHJvcHBlZC5cbiAgICAgICAgICovXG4gICAgICAgIGRpY3REZWZhdWx0TWVzc2FnZTogXCJEcm9wIGZpbGVzIGhlcmUgdG8gdXBsb2FkXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0ZXh0IHRoYXQgcmVwbGFjZXMgdGhlIGRlZmF1bHQgbWVzc2FnZSB0ZXh0IGl0IHRoZSBicm93c2VyIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0RmFsbGJhY2tNZXNzYWdlOiBcIllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGRyYWcnbidkcm9wIGZpbGUgdXBsb2Fkcy5cIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRleHQgdGhhdCB3aWxsIGJlIGFkZGVkIGJlZm9yZSB0aGUgZmFsbGJhY2sgZm9ybS5cbiAgICAgICAgICogSWYgeW91IHByb3ZpZGUgYSAgZmFsbGJhY2sgZWxlbWVudCB5b3Vyc2VsZiwgb3IgaWYgdGhpcyBvcHRpb24gaXMgYG51bGxgIHRoaXMgd2lsbFxuICAgICAgICAgKiBiZSBpZ25vcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdEZhbGxiYWNrVGV4dDogXCJQbGVhc2UgdXNlIHRoZSBmYWxsYmFjayBmb3JtIGJlbG93IHRvIHVwbG9hZCB5b3VyIGZpbGVzIGxpa2UgaW4gdGhlIG9sZGVuIGRheXMuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZSBmaWxlc2l6ZSBpcyB0b28gYmlnLlxuICAgICAgICAgKiBge3tmaWxlc2l6ZX19YCBhbmQgYHt7bWF4RmlsZXNpemV9fWAgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSByZXNwZWN0aXZlIGNvbmZpZ3VyYXRpb24gdmFsdWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdEZpbGVUb29CaWc6IFwiRmlsZSBpcyB0b28gYmlnICh7e2ZpbGVzaXplfX1NaUIpLiBNYXggZmlsZXNpemU6IHt7bWF4RmlsZXNpemV9fU1pQi5cIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlIGZpbGUgZG9lc24ndCBtYXRjaCB0aGUgZmlsZSB0eXBlLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdEludmFsaWRGaWxlVHlwZTogXCJZb3UgY2FuJ3QgdXBsb2FkIGZpbGVzIG9mIHRoaXMgdHlwZS5cIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlIHNlcnZlciByZXNwb25zZSB3YXMgaW52YWxpZC5cbiAgICAgICAgICogYHt7c3RhdHVzQ29kZX19YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHNlcnZlcnMgc3RhdHVzIGNvZGUuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0UmVzcG9uc2VFcnJvcjogXCJTZXJ2ZXIgcmVzcG9uZGVkIHdpdGgge3tzdGF0dXNDb2RlfX0gY29kZS5cIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYGFkZFJlbW92ZUxpbmtzYCBpcyB0cnVlLCB0aGUgdGV4dCB0byBiZSB1c2VkIGZvciB0aGUgY2FuY2VsIHVwbG9hZCBsaW5rLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdENhbmNlbFVwbG9hZDogXCJDYW5jZWwgdXBsb2FkXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0ZXh0IHRoYXQgaXMgZGlzcGxheWVkIGlmIGFuIHVwbG9hZCB3YXMgbWFudWFsbHkgY2FuY2VsZWRcbiAgICAgICAgICovXG4gICAgICAgIGRpY3RVcGxvYWRDYW5jZWxlZDogXCJVcGxvYWQgY2FuY2VsZWQuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGBhZGRSZW1vdmVMaW5rc2AgaXMgdHJ1ZSwgdGhlIHRleHQgdG8gYmUgdXNlZCBmb3IgY29uZmlybWF0aW9uIHdoZW4gY2FuY2VsbGluZyB1cGxvYWQuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0Q2FuY2VsVXBsb2FkQ29uZmlybWF0aW9uOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBjYW5jZWwgdGhpcyB1cGxvYWQ/XCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGBhZGRSZW1vdmVMaW5rc2AgaXMgdHJ1ZSwgdGhlIHRleHQgdG8gYmUgdXNlZCB0byByZW1vdmUgYSBmaWxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdFJlbW92ZUZpbGU6IFwiUmVtb3ZlIGZpbGVcIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhpcyBpcyBub3QgbnVsbCwgdGhlbiB0aGUgdXNlciB3aWxsIGJlIHByb21wdGVkIGJlZm9yZSByZW1vdmluZyBhIGZpbGUuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0UmVtb3ZlRmlsZUNvbmZpcm1hdGlvbjogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGxheWVkIGlmIGBtYXhGaWxlc2AgaXMgc3QgYW5kIGV4Y2VlZGVkLlxuICAgICAgICAgKiBUaGUgc3RyaW5nIGB7e21heEZpbGVzfX1gIHdpbGwgYmUgcmVwbGFjZWQgYnkgdGhlIGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0TWF4RmlsZXNFeGNlZWRlZDogXCJZb3UgY2FuIG5vdCB1cGxvYWQgYW55IG1vcmUgZmlsZXMuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFsbG93cyB5b3UgdG8gdHJhbnNsYXRlIHRoZSBkaWZmZXJlbnQgdW5pdHMuIFN0YXJ0aW5nIHdpdGggYHRiYCBmb3IgdGVyYWJ5dGVzIGFuZCBnb2luZyBkb3duIHRvXG4gICAgICAgICAqIGBiYCBmb3IgYnl0ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0RmlsZVNpemVVbml0czogeyB0YjogXCJUQlwiLCBnYjogXCJHQlwiLCBtYjogXCJNQlwiLCBrYjogXCJLQlwiLCBiOiBcImJcIiB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbGVkIHdoZW4gZHJvcHpvbmUgaW5pdGlhbGl6ZWRcbiAgICAgICAgICogWW91IGNhbiBhZGQgZXZlbnQgbGlzdGVuZXJzIGhlcmVcbiAgICAgICAgICovXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7fSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYW4gYmUgYW4gKipvYmplY3QqKiBvZiBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgdG8gdHJhbnNmZXIgdG8gdGhlIHNlcnZlciwgKipvcioqIGEgYEZ1bmN0aW9uYFxuICAgICAgICAgKiB0aGF0IGdldHMgaW52b2tlZCB3aXRoIHRoZSBgZmlsZXNgLCBgeGhyYCBhbmQsIGlmIGl0J3MgYSBjaHVua2VkIHVwbG9hZCwgYGNodW5rYCBhcmd1bWVudHMuIEluIGNhc2VcbiAgICAgICAgICogb2YgYSBmdW5jdGlvbiwgdGhpcyBuZWVkcyB0byByZXR1cm4gYSBtYXAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGRvZXMgbm90aGluZyBmb3Igbm9ybWFsIHVwbG9hZHMsIGJ1dCBhZGRzIHJlbGV2YW50IGluZm9ybWF0aW9uIGZvclxuICAgICAgICAgKiBjaHVua2VkIHVwbG9hZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIHNhbWUgYXMgYWRkaW5nIGhpZGRlbiBpbnB1dCBmaWVsZHMgaW4gdGhlIGZvcm0gZWxlbWVudC5cbiAgICAgICAgICovXG4gICAgICAgIHBhcmFtczogZnVuY3Rpb24gcGFyYW1zKGZpbGVzLCB4aHIsIGNodW5rKSB7XG4gICAgICAgICAgaWYgKGNodW5rKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBkenV1aWQ6IGNodW5rLmZpbGUudXBsb2FkLnV1aWQsXG4gICAgICAgICAgICAgIGR6Y2h1bmtpbmRleDogY2h1bmsuaW5kZXgsXG4gICAgICAgICAgICAgIGR6dG90YWxmaWxlc2l6ZTogY2h1bmsuZmlsZS5zaXplLFxuICAgICAgICAgICAgICBkemNodW5rc2l6ZTogdGhpcy5vcHRpb25zLmNodW5rU2l6ZSxcbiAgICAgICAgICAgICAgZHp0b3RhbGNodW5rY291bnQ6IGNodW5rLmZpbGUudXBsb2FkLnRvdGFsQ2h1bmtDb3VudCxcbiAgICAgICAgICAgICAgZHpjaHVua2J5dGVvZmZzZXQ6IGNodW5rLmluZGV4ICogdGhpcy5vcHRpb25zLmNodW5rU2l6ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBmdW5jdGlvbiB0aGF0IGdldHMgYSBbZmlsZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9ET00vRmlsZSlcbiAgICAgICAgICogYW5kIGEgYGRvbmVgIGZ1bmN0aW9uIGFzIHBhcmFtZXRlcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBkb25lIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIHRoZSBmaWxlIGlzIFwiYWNjZXB0ZWRcIiBhbmQgd2lsbFxuICAgICAgICAgKiBiZSBwcm9jZXNzZWQuIElmIHlvdSBwYXNzIGFuIGVycm9yIG1lc3NhZ2UsIHRoZSBmaWxlIGlzIHJlamVjdGVkLCBhbmQgdGhlIGVycm9yXG4gICAgICAgICAqIG1lc3NhZ2Ugd2lsbCBiZSBkaXNwbGF5ZWQuXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBub3QgYmUgY2FsbGVkIGlmIHRoZSBmaWxlIGlzIHRvbyBiaWcgb3IgZG9lc24ndCBtYXRjaCB0aGUgbWltZSB0eXBlcy5cbiAgICAgICAgICovXG4gICAgICAgIGFjY2VwdDogZnVuY3Rpb24gYWNjZXB0KGZpbGUsIGRvbmUpIHtcbiAgICAgICAgICByZXR1cm4gZG9uZSgpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIGFsbCBjaHVua3MgaGF2ZSBiZWVuIHVwbG9hZGVkIGZvciBhIGZpbGUuXG4gICAgICAgICAqIEl0IGdldHMgdGhlIGZpbGUgZm9yIHdoaWNoIHRoZSBjaHVua3MgaGF2ZSBiZWVuIHVwbG9hZGVkIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIsXG4gICAgICAgICAqIGFuZCB0aGUgYGRvbmVgIGZ1bmN0aW9uIGFzIHNlY29uZC4gYGRvbmUoKWAgbmVlZHMgdG8gYmUgaW52b2tlZCB3aGVuIGV2ZXJ5dGhpbmdcbiAgICAgICAgICogbmVlZGVkIHRvIGZpbmlzaCB0aGUgdXBsb2FkIHByb2Nlc3MgaXMgZG9uZS5cbiAgICAgICAgICovXG4gICAgICAgIGNodW5rc1VwbG9hZGVkOiBmdW5jdGlvbiBjaHVua3NVcGxvYWRlZChmaWxlLCBkb25lKSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGNhbGxlZCB3aGVuIHRoZSBicm93c2VyIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIHNob3dzIHRoZSBmYWxsYmFjayBpbnB1dCBmaWVsZCBhbmQgYWRkc1xuICAgICAgICAgKiBhIHRleHQuXG4gICAgICAgICAqL1xuICAgICAgICBmYWxsYmFjazogZnVuY3Rpb24gZmFsbGJhY2soKSB7XG4gICAgICAgICAgLy8gVGhpcyBjb2RlIHNob3VsZCBwYXNzIGluIElFNy4uLiA6KFxuICAgICAgICAgIHZhciBtZXNzYWdlRWxlbWVudCA9IHZvaWQgMDtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gdGhpcy5lbGVtZW50LmNsYXNzTmFtZSArIFwiIGR6LWJyb3dzZXItbm90LXN1cHBvcnRlZFwiO1xuXG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRpdlwiKSwgX2lzQXJyYXkyID0gdHJ1ZSwgX2kyID0gMCwgX2l0ZXJhdG9yMiA9IF9pc0FycmF5MiA/IF9pdGVyYXRvcjIgOiBfaXRlcmF0b3IyW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjI7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheTIpIHtcbiAgICAgICAgICAgICAgaWYgKF9pMiA+PSBfaXRlcmF0b3IyLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWYyID0gX2l0ZXJhdG9yMltfaTIrK107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfaTIgPSBfaXRlcmF0b3IyLm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pMi5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjIgPSBfaTIudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjaGlsZCA9IF9yZWYyO1xuXG4gICAgICAgICAgICBpZiAoLyhefCApZHotbWVzc2FnZSgkfCApLy50ZXN0KGNoaWxkLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQgPSBjaGlsZDtcbiAgICAgICAgICAgICAgY2hpbGQuY2xhc3NOYW1lID0gXCJkei1tZXNzYWdlXCI7IC8vIFJlbW92ZXMgdGhlICdkei1kZWZhdWx0JyBjbGFzc1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFtZXNzYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQgPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KFwiPGRpdiBjbGFzcz1cXFwiZHotbWVzc2FnZVxcXCI+PHNwYW4+PC9zcGFuPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHNwYW4gPSBtZXNzYWdlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIilbMF07XG4gICAgICAgICAgaWYgKHNwYW4pIHtcbiAgICAgICAgICAgIGlmIChzcGFuLnRleHRDb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5kaWN0RmFsbGJhY2tNZXNzYWdlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzcGFuLmlubmVyVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHNwYW4uaW5uZXJUZXh0ID0gdGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja01lc3NhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmdldEZhbGxiYWNrRm9ybSgpKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGNhbGxlZCB0byBjYWxjdWxhdGUgdGhlIHRodW1ibmFpbCBkaW1lbnNpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJdCBnZXRzIGBmaWxlYCwgYHdpZHRoYCBhbmQgYGhlaWdodGAgKGJvdGggbWF5IGJlIGBudWxsYCkgYXMgcGFyYW1ldGVycyBhbmQgbXVzdCByZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmc6XG4gICAgICAgICAqXG4gICAgICAgICAqICAtIGBzcmNXaWR0aGAgJiBgc3JjSGVpZ2h0YCAocmVxdWlyZWQpXG4gICAgICAgICAqICAtIGB0cmdXaWR0aGAgJiBgdHJnSGVpZ2h0YCAocmVxdWlyZWQpXG4gICAgICAgICAqICAtIGBzcmNYYCAmIGBzcmNZYCAob3B0aW9uYWwsIGRlZmF1bHQgYDBgKVxuICAgICAgICAgKiAgLSBgdHJnWGAgJiBgdHJnWWAgKG9wdGlvbmFsLCBkZWZhdWx0IGAwYClcbiAgICAgICAgICpcbiAgICAgICAgICogVGhvc2UgdmFsdWVzIGFyZSBnb2luZyB0byBiZSB1c2VkIGJ5IGBjdHguZHJhd0ltYWdlKClgLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzaXplOiBmdW5jdGlvbiByZXNpemUoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kKSB7XG4gICAgICAgICAgdmFyIGluZm8gPSB7XG4gICAgICAgICAgICBzcmNYOiAwLFxuICAgICAgICAgICAgc3JjWTogMCxcbiAgICAgICAgICAgIHNyY1dpZHRoOiBmaWxlLndpZHRoLFxuICAgICAgICAgICAgc3JjSGVpZ2h0OiBmaWxlLmhlaWdodFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgc3JjUmF0aW8gPSBmaWxlLndpZHRoIC8gZmlsZS5oZWlnaHQ7XG5cbiAgICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGNhbGN1bGF0ZSBkaW1lbnNpb25zIGlmIG5vdCBzcGVjaWZpZWRcbiAgICAgICAgICBpZiAod2lkdGggPT0gbnVsbCAmJiBoZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgd2lkdGggPSBpbmZvLnNyY1dpZHRoO1xuICAgICAgICAgICAgaGVpZ2h0ID0gaW5mby5zcmNIZWlnaHQ7XG4gICAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIHNyY1JhdGlvO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gc3JjUmF0aW87XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTWFrZSBzdXJlIGltYWdlcyBhcmVuJ3QgdXBzY2FsZWRcbiAgICAgICAgICB3aWR0aCA9IE1hdGgubWluKHdpZHRoLCBpbmZvLnNyY1dpZHRoKTtcbiAgICAgICAgICBoZWlnaHQgPSBNYXRoLm1pbihoZWlnaHQsIGluZm8uc3JjSGVpZ2h0KTtcblxuICAgICAgICAgIHZhciB0cmdSYXRpbyA9IHdpZHRoIC8gaGVpZ2h0O1xuXG4gICAgICAgICAgaWYgKGluZm8uc3JjV2lkdGggPiB3aWR0aCB8fCBpbmZvLnNyY0hlaWdodCA+IGhlaWdodCkge1xuICAgICAgICAgICAgLy8gSW1hZ2UgaXMgYmlnZ2VyIGFuZCBuZWVkcyByZXNjYWxpbmdcbiAgICAgICAgICAgIGlmIChyZXNpemVNZXRob2QgPT09ICdjcm9wJykge1xuICAgICAgICAgICAgICBpZiAoc3JjUmF0aW8gPiB0cmdSYXRpbykge1xuICAgICAgICAgICAgICAgIGluZm8uc3JjSGVpZ2h0ID0gZmlsZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgaW5mby5zcmNXaWR0aCA9IGluZm8uc3JjSGVpZ2h0ICogdHJnUmF0aW87XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5mby5zcmNXaWR0aCA9IGZpbGUud2lkdGg7XG4gICAgICAgICAgICAgICAgaW5mby5zcmNIZWlnaHQgPSBpbmZvLnNyY1dpZHRoIC8gdHJnUmF0aW87XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzaXplTWV0aG9kID09PSAnY29udGFpbicpIHtcbiAgICAgICAgICAgICAgLy8gTWV0aG9kICdjb250YWluJ1xuICAgICAgICAgICAgICBpZiAoc3JjUmF0aW8gPiB0cmdSYXRpbykge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gc3JjUmF0aW87XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBzcmNSYXRpbztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biByZXNpemVNZXRob2QgJ1wiICsgcmVzaXplTWV0aG9kICsgXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGluZm8uc3JjWCA9IChmaWxlLndpZHRoIC0gaW5mby5zcmNXaWR0aCkgLyAyO1xuICAgICAgICAgIGluZm8uc3JjWSA9IChmaWxlLmhlaWdodCAtIGluZm8uc3JjSGVpZ2h0KSAvIDI7XG5cbiAgICAgICAgICBpbmZvLnRyZ1dpZHRoID0gd2lkdGg7XG4gICAgICAgICAgaW5mby50cmdIZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYW4gYmUgdXNlZCB0byB0cmFuc2Zvcm0gdGhlIGZpbGUgKGZvciBleGFtcGxlLCByZXNpemUgYW4gaW1hZ2UgaWYgbmVjZXNzYXJ5KS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gdXNlcyBgcmVzaXplV2lkdGhgIGFuZCBgcmVzaXplSGVpZ2h0YCAoaWYgcHJvdmlkZWQpIGFuZCByZXNpemVzXG4gICAgICAgICAqIGltYWdlcyBhY2NvcmRpbmcgdG8gdGhvc2UgZGltZW5zaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogR2V0cyB0aGUgYGZpbGVgIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIsIGFuZCBhIGBkb25lKClgIGZ1bmN0aW9uIGFzIHRoZSBzZWNvbmQsIHRoYXQgbmVlZHNcbiAgICAgICAgICogdG8gYmUgaW52b2tlZCB3aXRoIHRoZSBmaWxlIHdoZW4gdGhlIHRyYW5zZm9ybWF0aW9uIGlzIGRvbmUuXG4gICAgICAgICAqL1xuICAgICAgICB0cmFuc2Zvcm1GaWxlOiBmdW5jdGlvbiB0cmFuc2Zvcm1GaWxlKGZpbGUsIGRvbmUpIHtcbiAgICAgICAgICBpZiAoKHRoaXMub3B0aW9ucy5yZXNpemVXaWR0aCB8fCB0aGlzLm9wdGlvbnMucmVzaXplSGVpZ2h0KSAmJiBmaWxlLnR5cGUubWF0Y2goL2ltYWdlLiovKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzaXplSW1hZ2UoZmlsZSwgdGhpcy5vcHRpb25zLnJlc2l6ZVdpZHRoLCB0aGlzLm9wdGlvbnMucmVzaXplSGVpZ2h0LCB0aGlzLm9wdGlvbnMucmVzaXplTWV0aG9kLCBkb25lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRvbmUoZmlsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgc3RyaW5nIHRoYXQgY29udGFpbnMgdGhlIHRlbXBsYXRlIHVzZWQgZm9yIGVhY2ggZHJvcHBlZFxuICAgICAgICAgKiBmaWxlLiBDaGFuZ2UgaXQgdG8gZnVsZmlsbCB5b3VyIG5lZWRzIGJ1dCBtYWtlIHN1cmUgdG8gcHJvcGVybHlcbiAgICAgICAgICogcHJvdmlkZSBhbGwgZWxlbWVudHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHlvdSB3YW50IHRvIHVzZSBhbiBhY3R1YWwgSFRNTCBlbGVtZW50IGluc3RlYWQgb2YgcHJvdmlkaW5nIGEgU3RyaW5nXG4gICAgICAgICAqIGFzIGEgY29uZmlnIG9wdGlvbiwgeW91IGNvdWxkIGNyZWF0ZSBhIGRpdiB3aXRoIHRoZSBpZCBgdHBsYCxcbiAgICAgICAgICogcHV0IHRoZSB0ZW1wbGF0ZSBpbnNpZGUgaXQgYW5kIHByb3ZpZGUgdGhlIGVsZW1lbnQgbGlrZSB0aGlzOlxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgZG9jdW1lbnRcbiAgICAgICAgICogICAgICAgLnF1ZXJ5U2VsZWN0b3IoJyN0cGwnKVxuICAgICAgICAgKiAgICAgICAuaW5uZXJIVE1MXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBwcmV2aWV3VGVtcGxhdGU6IFwiPGRpdiBjbGFzcz1cXFwiZHotcHJldmlldyBkei1maWxlLXByZXZpZXdcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotaW1hZ2VcXFwiPjxpbWcgZGF0YS1kei10aHVtYm5haWwgLz48L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWRldGFpbHNcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJkei1zaXplXFxcIj48c3BhbiBkYXRhLWR6LXNpemU+PC9zcGFuPjwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJkei1maWxlbmFtZVxcXCI+PHNwYW4gZGF0YS1kei1uYW1lPjwvc3Bhbj48L2Rpdj5cXG4gIDwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotcHJvZ3Jlc3NcXFwiPjxzcGFuIGNsYXNzPVxcXCJkei11cGxvYWRcXFwiIGRhdGEtZHotdXBsb2FkcHJvZ3Jlc3M+PC9zcGFuPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotZXJyb3ItbWVzc2FnZVxcXCI+PHNwYW4gZGF0YS1kei1lcnJvcm1lc3NhZ2U+PC9zcGFuPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotc3VjY2Vzcy1tYXJrXFxcIj5cXG4gICAgPHN2ZyB3aWR0aD1cXFwiNTRweFxcXCIgaGVpZ2h0PVxcXCI1NHB4XFxcIiB2aWV3Qm94PVxcXCIwIDAgNTQgNTRcXFwiIHZlcnNpb249XFxcIjEuMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeG1sbnM6c2tldGNoPVxcXCJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnNcXFwiPlxcbiAgICAgIDx0aXRsZT5DaGVjazwvdGl0bGU+XFxuICAgICAgPGRlZnM+PC9kZWZzPlxcbiAgICAgIDxnIGlkPVxcXCJQYWdlLTFcXFwiIHN0cm9rZT1cXFwibm9uZVxcXCIgc3Ryb2tlLXdpZHRoPVxcXCIxXFxcIiBmaWxsPVxcXCJub25lXFxcIiBmaWxsLXJ1bGU9XFxcImV2ZW5vZGRcXFwiIHNrZXRjaDp0eXBlPVxcXCJNU1BhZ2VcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTIzLjUsMzEuODQzMTQ1OCBMMTcuNTg1MjQxOSwyNS45MjgzODc3IEMxNi4wMjQ4MjUzLDI0LjM2Nzk3MTEgMTMuNDkxMDI5NCwyNC4zNjY4MzUgMTEuOTI4OTMyMiwyNS45Mjg5MzIyIEMxMC4zNzAwMTM2LDI3LjQ4Nzg1MDggMTAuMzY2NTkxMiwzMC4wMjM0NDU1IDExLjkyODM4NzcsMzEuNTg1MjQxOSBMMjAuNDE0NzU4MSw0MC4wNzE2MTIzIEMyMC41MTMzOTk5LDQwLjE3MDI1NDEgMjAuNjE1OTMxNSw0MC4yNjI2NjQ5IDIwLjcyMTg2MTUsNDAuMzQ4ODQzNSBDMjIuMjgzNTY2OSw0MS44NzI1NjUxIDI0Ljc5NDIzNCw0MS44NjI2MjAyIDI2LjM0NjE1NjQsNDAuMzEwNjk3OCBMNDMuMzEwNjk3OCwyMy4zNDYxNTY0IEM0NC44NzcxMDIxLDIxLjc3OTc1MjEgNDQuODc1ODA1NywxOS4yNDgzODg3IDQzLjMxMzcwODUsMTcuNjg2MjkxNSBDNDEuNzU0Nzg5OSwxNi4xMjczNzI5IDM5LjIxNzYwMzUsMTYuMTI1NTQyMiAzNy42NTM4NDM2LDE3LjY4OTMwMjIgTDIzLjUsMzEuODQzMTQ1OCBaIE0yNyw1MyBDNDEuMzU5NDAzNSw1MyA1Myw0MS4zNTk0MDM1IDUzLDI3IEM1MywxMi42NDA1OTY1IDQxLjM1OTQwMzUsMSAyNywxIEMxMi42NDA1OTY1LDEgMSwxMi42NDA1OTY1IDEsMjcgQzEsNDEuMzU5NDAzNSAxMi42NDA1OTY1LDUzIDI3LDUzIFpcXFwiIGlkPVxcXCJPdmFsLTJcXFwiIHN0cm9rZS1vcGFjaXR5PVxcXCIwLjE5ODc5NDE1OFxcXCIgc3Ryb2tlPVxcXCIjNzQ3NDc0XFxcIiBmaWxsLW9wYWNpdHk9XFxcIjAuODE2NTE5NDc1XFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNTaGFwZUdyb3VwXFxcIj48L3BhdGg+XFxuICAgICAgPC9nPlxcbiAgICA8L3N2Zz5cXG4gIDwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotZXJyb3ItbWFya1xcXCI+XFxuICAgIDxzdmcgd2lkdGg9XFxcIjU0cHhcXFwiIGhlaWdodD1cXFwiNTRweFxcXCIgdmlld0JveD1cXFwiMCAwIDU0IDU0XFxcIiB2ZXJzaW9uPVxcXCIxLjFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHhtbG5zOnNrZXRjaD1cXFwiaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zXFxcIj5cXG4gICAgICA8dGl0bGU+RXJyb3I8L3RpdGxlPlxcbiAgICAgIDxkZWZzPjwvZGVmcz5cXG4gICAgICA8ZyBpZD1cXFwiUGFnZS0xXFxcIiBzdHJva2U9XFxcIm5vbmVcXFwiIHN0cm9rZS13aWR0aD1cXFwiMVxcXCIgZmlsbD1cXFwibm9uZVxcXCIgZmlsbC1ydWxlPVxcXCJldmVub2RkXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNQYWdlXFxcIj5cXG4gICAgICAgIDxnIGlkPVxcXCJDaGVjay0rLU92YWwtMlxcXCIgc2tldGNoOnR5cGU9XFxcIk1TTGF5ZXJHcm91cFxcXCIgc3Ryb2tlPVxcXCIjNzQ3NDc0XFxcIiBzdHJva2Utb3BhY2l0eT1cXFwiMC4xOTg3OTQxNThcXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZpbGwtb3BhY2l0eT1cXFwiMC44MTY1MTk0NzVcXFwiPlxcbiAgICAgICAgICA8cGF0aCBkPVxcXCJNMzIuNjU2ODU0MiwyOSBMMzguMzEwNjk3OCwyMy4zNDYxNTY0IEMzOS44NzcxMDIxLDIxLjc3OTc1MjEgMzkuODc1ODA1NywxOS4yNDgzODg3IDM4LjMxMzcwODUsMTcuNjg2MjkxNSBDMzYuNzU0Nzg5OSwxNi4xMjczNzI5IDM0LjIxNzYwMzUsMTYuMTI1NTQyMiAzMi42NTM4NDM2LDE3LjY4OTMwMjIgTDI3LDIzLjM0MzE0NTggTDIxLjM0NjE1NjQsMTcuNjg5MzAyMiBDMTkuNzgyMzk2NSwxNi4xMjU1NDIyIDE3LjI0NTIxMDEsMTYuMTI3MzcyOSAxNS42ODYyOTE1LDE3LjY4NjI5MTUgQzE0LjEyNDE5NDMsMTkuMjQ4Mzg4NyAxNC4xMjI4OTc5LDIxLjc3OTc1MjEgMTUuNjg5MzAyMiwyMy4zNDYxNTY0IEwyMS4zNDMxNDU4LDI5IEwxNS42ODkzMDIyLDM0LjY1Mzg0MzYgQzE0LjEyMjg5NzksMzYuMjIwMjQ3OSAxNC4xMjQxOTQzLDM4Ljc1MTYxMTMgMTUuNjg2MjkxNSw0MC4zMTM3MDg1IEMxNy4yNDUyMTAxLDQxLjg3MjYyNzEgMTkuNzgyMzk2NSw0MS44NzQ0NTc4IDIxLjM0NjE1NjQsNDAuMzEwNjk3OCBMMjcsMzQuNjU2ODU0MiBMMzIuNjUzODQzNiw0MC4zMTA2OTc4IEMzNC4yMTc2MDM1LDQxLjg3NDQ1NzggMzYuNzU0Nzg5OSw0MS44NzI2MjcxIDM4LjMxMzcwODUsNDAuMzEzNzA4NSBDMzkuODc1ODA1NywzOC43NTE2MTEzIDM5Ljg3NzEwMjEsMzYuMjIwMjQ3OSAzOC4zMTA2OTc4LDM0LjY1Mzg0MzYgTDMyLjY1Njg1NDIsMjkgWiBNMjcsNTMgQzQxLjM1OTQwMzUsNTMgNTMsNDEuMzU5NDAzNSA1MywyNyBDNTMsMTIuNjQwNTk2NSA0MS4zNTk0MDM1LDEgMjcsMSBDMTIuNjQwNTk2NSwxIDEsMTIuNjQwNTk2NSAxLDI3IEMxLDQxLjM1OTQwMzUgMTIuNjQwNTk2NSw1MyAyNyw1MyBaXFxcIiBpZD1cXFwiT3ZhbC0yXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNTaGFwZUdyb3VwXFxcIj48L3BhdGg+XFxuICAgICAgICA8L2c+XFxuICAgICAgPC9nPlxcbiAgICA8L3N2Zz5cXG4gIDwvZGl2PlxcbjwvZGl2PlwiLFxuXG4gICAgICAgIC8vIEVORCBPUFRJT05TXG4gICAgICAgIC8vIChSZXF1aXJlZCBieSB0aGUgZHJvcHpvbmUgZG9jdW1lbnRhdGlvbiBwYXJzZXIpXG5cblxuICAgICAgICAvKlxuICAgICAgICAgVGhvc2UgZnVuY3Rpb25zIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgdG8gdGhlIGV2ZW50cyBvbiBpbml0IGFuZCBoYW5kbGUgYWxsXG4gICAgICAgICB0aGUgdXNlciBpbnRlcmZhY2Ugc3BlY2lmaWMgc3R1ZmYuIE92ZXJ3cml0aW5nIHRoZW0gd29uJ3QgYnJlYWsgdGhlIHVwbG9hZFxuICAgICAgICAgYnV0IGNhbiBicmVhayB0aGUgd2F5IGl0J3MgZGlzcGxheWVkLlxuICAgICAgICAgWW91IGNhbiBvdmVyd3JpdGUgdGhlbSBpZiB5b3UgZG9uJ3QgbGlrZSB0aGUgZGVmYXVsdCBiZWhhdmlvci4gSWYgeW91IGp1c3RcbiAgICAgICAgIHdhbnQgdG8gYWRkIGFuIGFkZGl0aW9uYWwgZXZlbnQgaGFuZGxlciwgcmVnaXN0ZXIgaXQgb24gdGhlIGRyb3B6b25lIG9iamVjdFxuICAgICAgICAgYW5kIGRvbid0IG92ZXJ3cml0ZSB0aG9zZSBvcHRpb25zLlxuICAgICAgICAgKi9cblxuICAgICAgICAvLyBUaG9zZSBhcmUgc2VsZiBleHBsYW5hdG9yeSBhbmQgc2ltcGx5IGNvbmNlcm4gdGhlIERyYWduRHJvcC5cbiAgICAgICAgZHJvcDogZnVuY3Rpb24gZHJvcChlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotZHJhZy1ob3ZlclwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZHJhZ3N0YXJ0OiBmdW5jdGlvbiBkcmFnc3RhcnQoZSkge30sXG4gICAgICAgIGRyYWdlbmQ6IGZ1bmN0aW9uIGRyYWdlbmQoZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGRyYWdlbnRlcjogZnVuY3Rpb24gZHJhZ2VudGVyKGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgICB9LFxuICAgICAgICBkcmFnb3ZlcjogZnVuY3Rpb24gZHJhZ292ZXIoZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGRyYWdsZWF2ZTogZnVuY3Rpb24gZHJhZ2xlYXZlKGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgICB9LFxuICAgICAgICBwYXN0ZTogZnVuY3Rpb24gcGFzdGUoZSkge30sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbmV2ZXIgdGhlcmUgYXJlIG5vIGZpbGVzIGxlZnQgaW4gdGhlIGRyb3B6b25lIGFueW1vcmUsIGFuZCB0aGVcbiAgICAgICAgLy8gZHJvcHpvbmUgc2hvdWxkIGJlIGRpc3BsYXllZCBhcyBpZiBpbiB0aGUgaW5pdGlhbCBzdGF0ZS5cbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LXN0YXJ0ZWRcIik7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbiBhIGZpbGUgaXMgYWRkZWQgdG8gdGhlIHF1ZXVlXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYFxuICAgICAgICBhZGRlZGZpbGU6IGZ1bmN0aW9uIGFkZGVkZmlsZShmaWxlKSB7XG4gICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICBpZiAodGhpcy5lbGVtZW50ID09PSB0aGlzLnByZXZpZXdzQ29udGFpbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LXN0YXJ0ZWRcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMucHJldmlld3NDb250YWluZXIpIHtcbiAgICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQgPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5wcmV2aWV3VGVtcGxhdGUudHJpbSgpKTtcbiAgICAgICAgICAgIGZpbGUucHJldmlld1RlbXBsYXRlID0gZmlsZS5wcmV2aWV3RWxlbWVudDsgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3c0NvbnRhaW5lci5hcHBlbmRDaGlsZChmaWxlLnByZXZpZXdFbGVtZW50KTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjMgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1uYW1lXVwiKSwgX2lzQXJyYXkzID0gdHJ1ZSwgX2kzID0gMCwgX2l0ZXJhdG9yMyA9IF9pc0FycmF5MyA/IF9pdGVyYXRvcjMgOiBfaXRlcmF0b3IzW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmMztcblxuICAgICAgICAgICAgICBpZiAoX2lzQXJyYXkzKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pMyA+PSBfaXRlcmF0b3IzLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjMgPSBfaXRlcmF0b3IzW19pMysrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTMgPSBfaXRlcmF0b3IzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2kzLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWYzID0gX2kzLnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfcmVmMztcblxuICAgICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gZmlsZS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yNCA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXNpemVdXCIpLCBfaXNBcnJheTQgPSB0cnVlLCBfaTQgPSAwLCBfaXRlcmF0b3I0ID0gX2lzQXJyYXk0ID8gX2l0ZXJhdG9yNCA6IF9pdGVyYXRvcjRbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5NCkge1xuICAgICAgICAgICAgICAgIGlmIChfaTQgPj0gX2l0ZXJhdG9yNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBfaXRlcmF0b3I0W19pNCsrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTQgPSBfaXRlcmF0b3I0Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2k0LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBfaTQudmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IHRoaXMuZmlsZXNpemUoZmlsZS5zaXplKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGRSZW1vdmVMaW5rcykge1xuICAgICAgICAgICAgICBmaWxlLl9yZW1vdmVMaW5rID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxhIGNsYXNzPVxcXCJkei1yZW1vdmVcXFwiIGhyZWY9XFxcImphdmFzY3JpcHQ6dW5kZWZpbmVkO1xcXCIgZGF0YS1kei1yZW1vdmU+XCIgKyB0aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGUgKyBcIjwvYT5cIik7XG4gICAgICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQuYXBwZW5kQ2hpbGQoZmlsZS5fcmVtb3ZlTGluayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVGaWxlRXZlbnQgPSBmdW5jdGlvbiByZW1vdmVGaWxlRXZlbnQoZSkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGlmIChmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuVVBMT0FESU5HKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIERyb3B6b25lLmNvbmZpcm0oX3RoaXMyLm9wdGlvbnMuZGljdENhbmNlbFVwbG9hZENvbmZpcm1hdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMi5yZW1vdmVGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpczIub3B0aW9ucy5kaWN0UmVtb3ZlRmlsZUNvbmZpcm1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIERyb3B6b25lLmNvbmZpcm0oX3RoaXMyLm9wdGlvbnMuZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMi5yZW1vdmVGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjUgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1yZW1vdmVdXCIpLCBfaXNBcnJheTUgPSB0cnVlLCBfaTUgPSAwLCBfaXRlcmF0b3I1ID0gX2lzQXJyYXk1ID8gX2l0ZXJhdG9yNSA6IF9pdGVyYXRvcjVbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgdmFyIF9yZWY0O1xuXG4gICAgICAgICAgICAgIGlmIChfaXNBcnJheTUpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2k1ID49IF9pdGVyYXRvcjUubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmNCA9IF9pdGVyYXRvcjVbX2k1KytdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9pNSA9IF9pdGVyYXRvcjUubmV4dCgpO1xuICAgICAgICAgICAgICAgIGlmIChfaTUuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjQgPSBfaTUudmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgcmVtb3ZlTGluayA9IF9yZWY0O1xuXG4gICAgICAgICAgICAgIHJlbW92ZUxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92ZUZpbGVFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW5ldmVyIGEgZmlsZSBpcyByZW1vdmVkLlxuICAgICAgICByZW1vdmVkZmlsZTogZnVuY3Rpb24gcmVtb3ZlZGZpbGUoZmlsZSkge1xuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50ICE9IG51bGwgJiYgZmlsZS5wcmV2aWV3RWxlbWVudC5wYXJlbnROb2RlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmaWxlLnByZXZpZXdFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZU1heEZpbGVzUmVhY2hlZENsYXNzKCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbiBhIHRodW1ibmFpbCBoYXMgYmVlbiBnZW5lcmF0ZWRcbiAgICAgICAgLy8gUmVjZWl2ZXMgYGZpbGVgIGFuZCBgZGF0YVVybGBcbiAgICAgICAgdGh1bWJuYWlsOiBmdW5jdGlvbiB0aHVtYm5haWwoZmlsZSwgZGF0YVVybCkge1xuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1maWxlLXByZXZpZXdcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3I2ID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotdGh1bWJuYWlsXVwiKSwgX2lzQXJyYXk2ID0gdHJ1ZSwgX2k2ID0gMCwgX2l0ZXJhdG9yNiA9IF9pc0FycmF5NiA/IF9pdGVyYXRvcjYgOiBfaXRlcmF0b3I2W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmNTtcblxuICAgICAgICAgICAgICBpZiAoX2lzQXJyYXk2KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pNiA+PSBfaXRlcmF0b3I2Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjUgPSBfaXRlcmF0b3I2W19pNisrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTYgPSBfaXRlcmF0b3I2Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2k2LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY1ID0gX2k2LnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHRodW1ibmFpbEVsZW1lbnQgPSBfcmVmNTtcblxuICAgICAgICAgICAgICB0aHVtYm5haWxFbGVtZW50LmFsdCA9IGZpbGUubmFtZTtcbiAgICAgICAgICAgICAgdGh1bWJuYWlsRWxlbWVudC5zcmMgPSBkYXRhVXJsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1pbWFnZS1wcmV2aWV3XCIpO1xuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW5ldmVyIGFuIGVycm9yIG9jY3Vyc1xuICAgICAgICAvLyBSZWNlaXZlcyBgZmlsZWAgYW5kIGBtZXNzYWdlYFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoZmlsZSwgbWVzc2FnZSkge1xuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1lcnJvclwiKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSAhPT0gXCJTdHJpbmdcIiAmJiBtZXNzYWdlLmVycm9yKSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLmVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yNyA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LWVycm9ybWVzc2FnZV1cIiksIF9pc0FycmF5NyA9IHRydWUsIF9pNyA9IDAsIF9pdGVyYXRvcjcgPSBfaXNBcnJheTcgPyBfaXRlcmF0b3I3IDogX2l0ZXJhdG9yN1tTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICB2YXIgX3JlZjY7XG5cbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5Nykge1xuICAgICAgICAgICAgICAgIGlmIChfaTcgPj0gX2l0ZXJhdG9yNy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY2ID0gX2l0ZXJhdG9yN1tfaTcrK107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2k3ID0gX2l0ZXJhdG9yNy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pNy5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmNiA9IF9pNy52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBub2RlID0gX3JlZjY7XG5cbiAgICAgICAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcm11bHRpcGxlOiBmdW5jdGlvbiBlcnJvcm11bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbiBhIGZpbGUgZ2V0cyBwcm9jZXNzZWQuIFNpbmNlIHRoZXJlIGlzIGEgY3VlLCBub3QgYWxsIGFkZGVkXG4gICAgICAgIC8vIGZpbGVzIGFyZSBwcm9jZXNzZWQgaW1tZWRpYXRlbHkuXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYFxuICAgICAgICBwcm9jZXNzaW5nOiBmdW5jdGlvbiBwcm9jZXNzaW5nKGZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotcHJvY2Vzc2luZ1wiKTtcbiAgICAgICAgICAgIGlmIChmaWxlLl9yZW1vdmVMaW5rKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLl9yZW1vdmVMaW5rLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5kaWN0Q2FuY2VsVXBsb2FkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHJvY2Vzc2luZ211bHRpcGxlOiBmdW5jdGlvbiBwcm9jZXNzaW5nbXVsdGlwbGUoKSB7fSxcblxuXG4gICAgICAgIC8vIENhbGxlZCB3aGVuZXZlciB0aGUgdXBsb2FkIHByb2dyZXNzIGdldHMgdXBkYXRlZC5cbiAgICAgICAgLy8gUmVjZWl2ZXMgYGZpbGVgLCBgcHJvZ3Jlc3NgIChwZXJjZW50YWdlIDAtMTAwKSBhbmQgYGJ5dGVzU2VudGAuXG4gICAgICAgIC8vIFRvIGdldCB0aGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIG9mIHRoZSBmaWxlLCB1c2UgYGZpbGUuc2l6ZWBcbiAgICAgICAgdXBsb2FkcHJvZ3Jlc3M6IGZ1bmN0aW9uIHVwbG9hZHByb2dyZXNzKGZpbGUsIHByb2dyZXNzLCBieXRlc1NlbnQpIHtcbiAgICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yOCA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXVwbG9hZHByb2dyZXNzXVwiKSwgX2lzQXJyYXk4ID0gdHJ1ZSwgX2k4ID0gMCwgX2l0ZXJhdG9yOCA9IF9pc0FycmF5OCA/IF9pdGVyYXRvcjggOiBfaXRlcmF0b3I4W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmNztcblxuICAgICAgICAgICAgICBpZiAoX2lzQXJyYXk4KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pOCA+PSBfaXRlcmF0b3I4Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjcgPSBfaXRlcmF0b3I4W19pOCsrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTggPSBfaXRlcmF0b3I4Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2k4LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY3ID0gX2k4LnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfcmVmNztcblxuICAgICAgICAgICAgICBub2RlLm5vZGVOYW1lID09PSAnUFJPR1JFU1MnID8gbm9kZS52YWx1ZSA9IHByb2dyZXNzIDogbm9kZS5zdHlsZS53aWR0aCA9IHByb2dyZXNzICsgXCIlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW5ldmVyIHRoZSB0b3RhbCB1cGxvYWQgcHJvZ3Jlc3MgZ2V0cyB1cGRhdGVkLlxuICAgICAgICAvLyBDYWxsZWQgd2l0aCB0b3RhbFVwbG9hZFByb2dyZXNzICgwLTEwMCksIHRvdGFsQnl0ZXMgYW5kIHRvdGFsQnl0ZXNTZW50XG4gICAgICAgIHRvdGFsdXBsb2FkcHJvZ3Jlc3M6IGZ1bmN0aW9uIHRvdGFsdXBsb2FkcHJvZ3Jlc3MoKSB7fSxcblxuXG4gICAgICAgIC8vIENhbGxlZCBqdXN0IGJlZm9yZSB0aGUgZmlsZSBpcyBzZW50LiBHZXRzIHRoZSBgeGhyYCBvYmplY3QgYXMgc2Vjb25kXG4gICAgICAgIC8vIHBhcmFtZXRlciwgc28geW91IGNhbiBtb2RpZnkgaXQgKGZvciBleGFtcGxlIHRvIGFkZCBhIENTUkYgdG9rZW4pIGFuZCBhXG4gICAgICAgIC8vIGBmb3JtRGF0YWAgb2JqZWN0IHRvIGFkZCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgICAgICBzZW5kaW5nOiBmdW5jdGlvbiBzZW5kaW5nKCkge30sXG4gICAgICAgIHNlbmRpbmdtdWx0aXBsZTogZnVuY3Rpb24gc2VuZGluZ211bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBXaGVuIHRoZSBjb21wbGV0ZSB1cGxvYWQgaXMgZmluaXNoZWQgYW5kIHN1Y2Nlc3NmdWxcbiAgICAgICAgLy8gUmVjZWl2ZXMgYGZpbGVgXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MoZmlsZSkge1xuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotc3VjY2Vzc1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3NtdWx0aXBsZTogZnVuY3Rpb24gc3VjY2Vzc211bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBXaGVuIHRoZSB1cGxvYWQgaXMgY2FuY2VsZWQuXG4gICAgICAgIGNhbmNlbGVkOiBmdW5jdGlvbiBjYW5jZWxlZChmaWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChcImVycm9yXCIsIGZpbGUsIHRoaXMub3B0aW9ucy5kaWN0VXBsb2FkQ2FuY2VsZWQpO1xuICAgICAgICB9LFxuICAgICAgICBjYW5jZWxlZG11bHRpcGxlOiBmdW5jdGlvbiBjYW5jZWxlZG11bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBXaGVuIHRoZSB1cGxvYWQgaXMgZmluaXNoZWQsIGVpdGhlciB3aXRoIHN1Y2Nlc3Mgb3IgYW4gZXJyb3IuXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYFxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoZmlsZSkge1xuICAgICAgICAgIGlmIChmaWxlLl9yZW1vdmVMaW5rKSB7XG4gICAgICAgICAgICBmaWxlLl9yZW1vdmVMaW5rLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5kaWN0UmVtb3ZlRmlsZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1jb21wbGV0ZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlbXVsdGlwbGU6IGZ1bmN0aW9uIGNvbXBsZXRlbXVsdGlwbGUoKSB7fSxcbiAgICAgICAgbWF4ZmlsZXNleGNlZWRlZDogZnVuY3Rpb24gbWF4ZmlsZXNleGNlZWRlZCgpIHt9LFxuICAgICAgICBtYXhmaWxlc3JlYWNoZWQ6IGZ1bmN0aW9uIG1heGZpbGVzcmVhY2hlZCgpIHt9LFxuICAgICAgICBxdWV1ZWNvbXBsZXRlOiBmdW5jdGlvbiBxdWV1ZWNvbXBsZXRlKCkge30sXG4gICAgICAgIGFkZGVkZmlsZXM6IGZ1bmN0aW9uIGFkZGVkZmlsZXMoKSB7fVxuICAgICAgfTtcblxuICAgICAgdGhpcy5wcm90b3R5cGUuX3RodW1ibmFpbFF1ZXVlID0gW107XG4gICAgICB0aGlzLnByb3RvdHlwZS5fcHJvY2Vzc2luZ1RodW1ibmFpbCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGdsb2JhbCB1dGlsaXR5XG5cbiAgfSwge1xuICAgIGtleTogXCJleHRlbmRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBvYmplY3RzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBvYmplY3RzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3I5ID0gb2JqZWN0cywgX2lzQXJyYXk5ID0gdHJ1ZSwgX2k5ID0gMCwgX2l0ZXJhdG9yOSA9IF9pc0FycmF5OSA/IF9pdGVyYXRvcjkgOiBfaXRlcmF0b3I5W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmODtcblxuICAgICAgICBpZiAoX2lzQXJyYXk5KSB7XG4gICAgICAgICAgaWYgKF9pOSA+PSBfaXRlcmF0b3I5Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjggPSBfaXRlcmF0b3I5W19pOSsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTkgPSBfaXRlcmF0b3I5Lm5leHQoKTtcbiAgICAgICAgICBpZiAoX2k5LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWY4ID0gX2k5LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iamVjdCA9IF9yZWY4O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICB2YXIgdmFsID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICB9XSk7XG5cbiAgZnVuY3Rpb24gRHJvcHpvbmUoZWwsIG9wdGlvbnMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRHJvcHpvbmUpO1xuXG4gICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKERyb3B6b25lLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRHJvcHpvbmUpKS5jYWxsKHRoaXMpKTtcblxuICAgIHZhciBmYWxsYmFjayA9IHZvaWQgMCxcbiAgICAgICAgbGVmdCA9IHZvaWQgMDtcbiAgICBfdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgLy8gRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHNpbmNlIHRoZSB2ZXJzaW9uIHdhcyBpbiB0aGUgcHJvdG90eXBlIHByZXZpb3VzbHlcbiAgICBfdGhpcy52ZXJzaW9uID0gRHJvcHpvbmUudmVyc2lvbjtcblxuICAgIF90aGlzLmRlZmF1bHRPcHRpb25zLnByZXZpZXdUZW1wbGF0ZSA9IF90aGlzLmRlZmF1bHRPcHRpb25zLnByZXZpZXdUZW1wbGF0ZS5yZXBsYWNlKC9cXG4qL2csIFwiXCIpO1xuXG4gICAgX3RoaXMuY2xpY2thYmxlRWxlbWVudHMgPSBbXTtcbiAgICBfdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICBfdGhpcy5maWxlcyA9IFtdOyAvLyBBbGwgZmlsZXNcblxuICAgIGlmICh0eXBlb2YgX3RoaXMuZWxlbWVudCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgX3RoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoX3RoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gTm90IGNoZWNraW5nIGlmIGluc3RhbmNlIG9mIEhUTUxFbGVtZW50IG9yIEVsZW1lbnQgc2luY2UgSUU5IGlzIGV4dHJlbWVseSB3ZWlyZC5cbiAgICBpZiAoIV90aGlzLmVsZW1lbnQgfHwgX3RoaXMuZWxlbWVudC5ub2RlVHlwZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGRyb3B6b25lIGVsZW1lbnQuXCIpO1xuICAgIH1cblxuICAgIGlmIChfdGhpcy5lbGVtZW50LmRyb3B6b25lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEcm9wem9uZSBhbHJlYWR5IGF0dGFjaGVkLlwiKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgYWRkIHRoaXMgZHJvcHpvbmUgdG8gdGhlIGluc3RhbmNlcy5cbiAgICBEcm9wem9uZS5pbnN0YW5jZXMucHVzaChfdGhpcyk7XG5cbiAgICAvLyBQdXQgdGhlIGRyb3B6b25lIGluc2lkZSB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgX3RoaXMuZWxlbWVudC5kcm9wem9uZSA9IF90aGlzO1xuXG4gICAgdmFyIGVsZW1lbnRPcHRpb25zID0gKGxlZnQgPSBEcm9wem9uZS5vcHRpb25zRm9yRWxlbWVudChfdGhpcy5lbGVtZW50KSkgIT0gbnVsbCA/IGxlZnQgOiB7fTtcblxuICAgIF90aGlzLm9wdGlvbnMgPSBEcm9wem9uZS5leHRlbmQoe30sIF90aGlzLmRlZmF1bHRPcHRpb25zLCBlbGVtZW50T3B0aW9ucywgb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9KTtcblxuICAgIC8vIElmIHRoZSBicm93c2VyIGZhaWxlZCwganVzdCBjYWxsIHRoZSBmYWxsYmFjayBhbmQgbGVhdmVcbiAgICBpZiAoX3RoaXMub3B0aW9ucy5mb3JjZUZhbGxiYWNrIHx8ICFEcm9wem9uZS5pc0Jyb3dzZXJTdXBwb3J0ZWQoKSkge1xuICAgICAgdmFyIF9yZXQ7XG5cbiAgICAgIHJldHVybiBfcmV0ID0gX3RoaXMub3B0aW9ucy5mYWxsYmFjay5jYWxsKF90aGlzKSwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oX3RoaXMsIF9yZXQpO1xuICAgIH1cblxuICAgIC8vIEBvcHRpb25zLnVybCA9IEBlbGVtZW50LmdldEF0dHJpYnV0ZSBcImFjdGlvblwiIHVubGVzcyBAb3B0aW9ucy51cmw/XG4gICAgaWYgKF90aGlzLm9wdGlvbnMudXJsID09IG51bGwpIHtcbiAgICAgIF90aGlzLm9wdGlvbnMudXJsID0gX3RoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIik7XG4gICAgfVxuXG4gICAgaWYgKCFfdGhpcy5vcHRpb25zLnVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gVVJMIHByb3ZpZGVkLlwiKTtcbiAgICB9XG5cbiAgICBpZiAoX3RoaXMub3B0aW9ucy5hY2NlcHRlZEZpbGVzICYmIF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBjYW4ndCBwcm92aWRlIGJvdGggJ2FjY2VwdGVkRmlsZXMnIGFuZCAnYWNjZXB0ZWRNaW1lVHlwZXMnLiAnYWNjZXB0ZWRNaW1lVHlwZXMnIGlzIGRlcHJlY2F0ZWQuXCIpO1xuICAgIH1cblxuICAgIGlmIChfdGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlICYmIF90aGlzLm9wdGlvbnMuY2h1bmtpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbm5vdCBzZXQgYm90aDogdXBsb2FkTXVsdGlwbGUgYW5kIGNodW5raW5nLicpO1xuICAgIH1cblxuICAgIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgaWYgKF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXMpIHtcbiAgICAgIF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyA9IF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXM7XG4gICAgICBkZWxldGUgX3RoaXMub3B0aW9ucy5hY2NlcHRlZE1pbWVUeXBlcztcbiAgICB9XG5cbiAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIGlmIChfdGhpcy5vcHRpb25zLnJlbmFtZUZpbGVuYW1lICE9IG51bGwpIHtcbiAgICAgIF90aGlzLm9wdGlvbnMucmVuYW1lRmlsZSA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5vcHRpb25zLnJlbmFtZUZpbGVuYW1lLmNhbGwoX3RoaXMsIGZpbGUubmFtZSwgZmlsZSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIF90aGlzLm9wdGlvbnMubWV0aG9kID0gX3RoaXMub3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKTtcblxuICAgIGlmICgoZmFsbGJhY2sgPSBfdGhpcy5nZXRFeGlzdGluZ0ZhbGxiYWNrKCkpICYmIGZhbGxiYWNrLnBhcmVudE5vZGUpIHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgZmFsbGJhY2tcbiAgICAgIGZhbGxiYWNrLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZmFsbGJhY2spO1xuICAgIH1cblxuICAgIC8vIERpc3BsYXkgcHJldmlld3MgaW4gdGhlIHByZXZpZXdzQ29udGFpbmVyIGVsZW1lbnQgb3IgdGhlIERyb3B6b25lIGVsZW1lbnQgdW5sZXNzIGV4cGxpY2l0bHkgc2V0IHRvIGZhbHNlXG4gICAgaWYgKF90aGlzLm9wdGlvbnMucHJldmlld3NDb250YWluZXIgIT09IGZhbHNlKSB7XG4gICAgICBpZiAoX3RoaXMub3B0aW9ucy5wcmV2aWV3c0NvbnRhaW5lcikge1xuICAgICAgICBfdGhpcy5wcmV2aWV3c0NvbnRhaW5lciA9IERyb3B6b25lLmdldEVsZW1lbnQoX3RoaXMub3B0aW9ucy5wcmV2aWV3c0NvbnRhaW5lciwgXCJwcmV2aWV3c0NvbnRhaW5lclwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLnByZXZpZXdzQ29udGFpbmVyID0gX3RoaXMuZWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoX3RoaXMub3B0aW9ucy5jbGlja2FibGUpIHtcbiAgICAgIGlmIChfdGhpcy5vcHRpb25zLmNsaWNrYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICBfdGhpcy5jbGlja2FibGVFbGVtZW50cyA9IFtfdGhpcy5lbGVtZW50XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLmNsaWNrYWJsZUVsZW1lbnRzID0gRHJvcHpvbmUuZ2V0RWxlbWVudHMoX3RoaXMub3B0aW9ucy5jbGlja2FibGUsIFwiY2xpY2thYmxlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF90aGlzLmluaXQoKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICAvLyBSZXR1cm5zIGFsbCBmaWxlcyB0aGF0IGhhdmUgYmVlbiBhY2NlcHRlZFxuXG5cbiAgX2NyZWF0ZUNsYXNzKERyb3B6b25lLCBbe1xuICAgIGtleTogXCJnZXRBY2NlcHRlZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFjY2VwdGVkRmlsZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUuYWNjZXB0ZWQ7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGFsbCBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZWplY3RlZFxuICAgIC8vIE5vdCBzdXJlIHdoZW4gdGhhdCdzIGdvaW5nIHRvIGJlIHVzZWZ1bCwgYnV0IGFkZGVkIGZvciBjb21wbGV0ZW5lc3MuXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRSZWplY3RlZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJlamVjdGVkRmlsZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuICFmaWxlLmFjY2VwdGVkO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEZpbGVzV2l0aFN0YXR1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRGaWxlc1dpdGhTdGF0dXMoc3RhdHVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUuc3RhdHVzID09PSBzdGF0dXM7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGFsbCBmaWxlcyB0aGF0IGFyZSBpbiB0aGUgcXVldWVcblxuICB9LCB7XG4gICAga2V5OiBcImdldFF1ZXVlZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFF1ZXVlZEZpbGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZXNXaXRoU3RhdHVzKERyb3B6b25lLlFVRVVFRCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVwbG9hZGluZ0ZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFVwbG9hZGluZ0ZpbGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZXNXaXRoU3RhdHVzKERyb3B6b25lLlVQTE9BRElORyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEFkZGVkRmlsZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QWRkZWRGaWxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEZpbGVzV2l0aFN0YXR1cyhEcm9wem9uZS5BRERFRCk7XG4gICAgfVxuXG4gICAgLy8gRmlsZXMgdGhhdCBhcmUgZWl0aGVyIHF1ZXVlZCBvciB1cGxvYWRpbmdcblxuICB9LCB7XG4gICAga2V5OiBcImdldEFjdGl2ZUZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFjdGl2ZUZpbGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsZXMuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuVVBMT0FESU5HIHx8IGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5RVUVVRUQ7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aGVuIERyb3B6b25lIGlzIGluaXRpYWxpemVkLiBZb3VcbiAgICAvLyBjYW4gKGFuZCBzaG91bGQpIHNldHVwIGV2ZW50IGxpc3RlbmVycyBpbnNpZGUgdGhpcyBmdW5jdGlvbi5cblxuICB9LCB7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAvLyBJbiBjYXNlIGl0IGlzbid0IHNldCBhbHJlYWR5XG4gICAgICBpZiAodGhpcy5lbGVtZW50LnRhZ05hbWUgPT09IFwiZm9ybVwiKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJlbmN0eXBlXCIsIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJkcm9wem9uZVwiKSAmJiAhdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZHotbWVzc2FnZVwiKSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxkaXYgY2xhc3M9XFxcImR6LWRlZmF1bHQgZHotbWVzc2FnZVxcXCI+PHNwYW4+XCIgKyB0aGlzLm9wdGlvbnMuZGljdERlZmF1bHRNZXNzYWdlICsgXCI8L3NwYW4+PC9kaXY+XCIpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xpY2thYmxlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzZXR1cEhpZGRlbkZpbGVJbnB1dCA9IGZ1bmN0aW9uIHNldHVwSGlkZGVuRmlsZUlucHV0KCkge1xuICAgICAgICAgIGlmIChfdGhpczMuaGlkZGVuRmlsZUlucHV0KSB7XG4gICAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoX3RoaXMzLmhpZGRlbkZpbGVJbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiZmlsZVwiKTtcbiAgICAgICAgICBpZiAoX3RoaXMzLm9wdGlvbnMubWF4RmlsZXMgPT09IG51bGwgfHwgX3RoaXMzLm9wdGlvbnMubWF4RmlsZXMgPiAxKSB7XG4gICAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnNldEF0dHJpYnV0ZShcIm11bHRpcGxlXCIsIFwibXVsdGlwbGVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuY2xhc3NOYW1lID0gXCJkei1oaWRkZW4taW5wdXRcIjtcblxuICAgICAgICAgIGlmIChfdGhpczMub3B0aW9ucy5hY2NlcHRlZEZpbGVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnNldEF0dHJpYnV0ZShcImFjY2VwdFwiLCBfdGhpczMub3B0aW9ucy5hY2NlcHRlZEZpbGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF90aGlzMy5vcHRpb25zLmNhcHR1cmUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwiY2FwdHVyZVwiLCBfdGhpczMub3B0aW9ucy5jYXB0dXJlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOb3Qgc2V0dGluZyBgZGlzcGxheT1cIm5vbmVcImAgYmVjYXVzZSBzb21lIGJyb3dzZXJzIGRvbid0IGFjY2VwdCBjbGlja3NcbiAgICAgICAgICAvLyBvbiBlbGVtZW50cyB0aGF0IGFyZW4ndCBkaXNwbGF5ZWQuXG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuc3R5bGUudG9wID0gXCIwXCI7XG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLndpZHRoID0gXCIwXCI7XG4gICAgICAgICAgRHJvcHpvbmUuZ2V0RWxlbWVudChfdGhpczMub3B0aW9ucy5oaWRkZW5JbnB1dENvbnRhaW5lciwgJ2hpZGRlbklucHV0Q29udGFpbmVyJykuYXBwZW5kQ2hpbGQoX3RoaXMzLmhpZGRlbkZpbGVJbnB1dCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBfdGhpczMuaGlkZGVuRmlsZUlucHV0LmZpbGVzO1xuXG4gICAgICAgICAgICBpZiAoZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjEwID0gZmlsZXMsIF9pc0FycmF5MTAgPSB0cnVlLCBfaTEwID0gMCwgX2l0ZXJhdG9yMTAgPSBfaXNBcnJheTEwID8gX2l0ZXJhdG9yMTAgOiBfaXRlcmF0b3IxMFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICAgIHZhciBfcmVmOTtcblxuICAgICAgICAgICAgICAgIGlmIChfaXNBcnJheTEwKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX2kxMCA+PSBfaXRlcmF0b3IxMC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgX3JlZjkgPSBfaXRlcmF0b3IxMFtfaTEwKytdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBfaTEwID0gX2l0ZXJhdG9yMTAubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgaWYgKF9pMTAuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBfcmVmOSA9IF9pMTAudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZpbGUgPSBfcmVmOTtcblxuICAgICAgICAgICAgICAgIF90aGlzMy5hZGRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpczMuZW1pdChcImFkZGVkZmlsZXNcIiwgZmlsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHNldHVwSGlkZGVuRmlsZUlucHV0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHNldHVwSGlkZGVuRmlsZUlucHV0KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuVVJMID0gd2luZG93LlVSTCAhPT0gbnVsbCA/IHdpbmRvdy5VUkwgOiB3aW5kb3cud2Via2l0VVJMO1xuXG4gICAgICAvLyBTZXR1cCBhbGwgZXZlbnQgbGlzdGVuZXJzIG9uIHRoZSBEcm9wem9uZSBvYmplY3QgaXRzZWxmLlxuICAgICAgLy8gVGhleSdyZSBub3QgaW4gQHNldHVwRXZlbnRMaXN0ZW5lcnMoKSBiZWNhdXNlIHRoZXkgc2hvdWxkbid0IGJlIHJlbW92ZWRcbiAgICAgIC8vIGFnYWluIHdoZW4gdGhlIGRyb3B6b25lIGdldHMgZGlzYWJsZWQuXG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IxMSA9IHRoaXMuZXZlbnRzLCBfaXNBcnJheTExID0gdHJ1ZSwgX2kxMSA9IDAsIF9pdGVyYXRvcjExID0gX2lzQXJyYXkxMSA/IF9pdGVyYXRvcjExIDogX2l0ZXJhdG9yMTFbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYxMDtcblxuICAgICAgICBpZiAoX2lzQXJyYXkxMSkge1xuICAgICAgICAgIGlmIChfaTExID49IF9pdGVyYXRvcjExLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjEwID0gX2l0ZXJhdG9yMTFbX2kxMSsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTExID0gX2l0ZXJhdG9yMTEubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTExLmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxMCA9IF9pMTEudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXZlbnROYW1lID0gX3JlZjEwO1xuXG4gICAgICAgIHRoaXMub24oZXZlbnROYW1lLCB0aGlzLm9wdGlvbnNbZXZlbnROYW1lXSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub24oXCJ1cGxvYWRwcm9ncmVzc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpczMudXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcygpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpczMudXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcygpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub24oXCJjYW5jZWxlZFwiLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJjb21wbGV0ZVwiLCBmaWxlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBFbWl0IGEgYHF1ZXVlY29tcGxldGVgIGV2ZW50IGlmIGFsbCBmaWxlcyBmaW5pc2hlZCB1cGxvYWRpbmcuXG4gICAgICB0aGlzLm9uKFwiY29tcGxldGVcIiwgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgaWYgKF90aGlzMy5nZXRBZGRlZEZpbGVzKCkubGVuZ3RoID09PSAwICYmIF90aGlzMy5nZXRVcGxvYWRpbmdGaWxlcygpLmxlbmd0aCA9PT0gMCAmJiBfdGhpczMuZ2V0UXVldWVkRmlsZXMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGRlZmVycmVkIHNvIHRoYXQgYHF1ZXVlY29tcGxldGVgIHJlYWxseSB0cmlnZ2VycyBhZnRlciBgY29tcGxldGVgXG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzMy5lbWl0KFwicXVldWVjb21wbGV0ZVwiKTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBub1Byb3BhZ2F0aW9uID0gZnVuY3Rpb24gbm9Qcm9wYWdhdGlvbihlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIGxpc3RlbmVyc1xuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbe1xuICAgICAgICBlbGVtZW50OiB0aGlzLmVsZW1lbnQsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgIFwiZHJhZ3N0YXJ0XCI6IGZ1bmN0aW9uIGRyYWdzdGFydChlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJkcmFnc3RhcnRcIiwgZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRyYWdlbnRlclwiOiBmdW5jdGlvbiBkcmFnZW50ZXIoZSkge1xuICAgICAgICAgICAgbm9Qcm9wYWdhdGlvbihlKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuZW1pdChcImRyYWdlbnRlclwiLCBlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHJhZ292ZXJcIjogZnVuY3Rpb24gZHJhZ292ZXIoZSkge1xuICAgICAgICAgICAgLy8gTWFrZXMgaXQgcG9zc2libGUgdG8gZHJhZyBmaWxlcyBmcm9tIGNocm9tZSdzIGRvd25sb2FkIGJhclxuICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTUyNjQzMC9kcmFnLWFuZC1kcm9wLWZpbGUtdXBsb2Fkcy1mcm9tLWNocm9tZS1kb3dubG9hZHMtYmFyXG4gICAgICAgICAgICAvLyBUcnkgaXMgcmVxdWlyZWQgdG8gcHJldmVudCBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTEgKFNDUklQVDY1NTM1IGV4Y2VwdGlvbilcbiAgICAgICAgICAgIHZhciBlZmN0ID0gdm9pZCAwO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZWZjdCA9IGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQ7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZScgPT09IGVmY3QgfHwgJ2xpbmtNb3ZlJyA9PT0gZWZjdCA/ICdtb3ZlJyA6ICdjb3B5JztcblxuICAgICAgICAgICAgbm9Qcm9wYWdhdGlvbihlKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuZW1pdChcImRyYWdvdmVyXCIsIGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkcmFnbGVhdmVcIjogZnVuY3Rpb24gZHJhZ2xlYXZlKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuZW1pdChcImRyYWdsZWF2ZVwiLCBlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHJvcFwiOiBmdW5jdGlvbiBkcm9wKGUpIHtcbiAgICAgICAgICAgIG5vUHJvcGFnYXRpb24oZSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmRyb3AoZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRyYWdlbmRcIjogZnVuY3Rpb24gZHJhZ2VuZChlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJkcmFnZW5kXCIsIGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgZGlzYWJsZWQgcmlnaHQgbm93LCBiZWNhdXNlIHRoZSBicm93c2VycyBkb24ndCBpbXBsZW1lbnQgaXQgcHJvcGVybHkuXG4gICAgICAgICAgLy8gXCJwYXN0ZVwiOiAoZSkgPT5cbiAgICAgICAgICAvLyAgIG5vUHJvcGFnYXRpb24gZVxuICAgICAgICAgIC8vICAgQHBhc3RlIGVcbiAgICAgICAgfSB9XTtcblxuICAgICAgdGhpcy5jbGlja2FibGVFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjbGlja2FibGVFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBfdGhpczMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgIGVsZW1lbnQ6IGNsaWNrYWJsZUVsZW1lbnQsXG4gICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICBcImNsaWNrXCI6IGZ1bmN0aW9uIGNsaWNrKGV2dCkge1xuICAgICAgICAgICAgICAvLyBPbmx5IHRoZSBhY3R1YWwgZHJvcHpvbmUgb3IgdGhlIG1lc3NhZ2UgZWxlbWVudCBzaG91bGQgdHJpZ2dlciBmaWxlIHNlbGVjdGlvblxuICAgICAgICAgICAgICBpZiAoY2xpY2thYmxlRWxlbWVudCAhPT0gX3RoaXMzLmVsZW1lbnQgfHwgZXZ0LnRhcmdldCA9PT0gX3RoaXMzLmVsZW1lbnQgfHwgRHJvcHpvbmUuZWxlbWVudEluc2lkZShldnQudGFyZ2V0LCBfdGhpczMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmR6LW1lc3NhZ2VcIikpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5jbGljaygpOyAvLyBGb3J3YXJkIHRoZSBjbGlja1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5lbmFibGUoKTtcblxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbml0LmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGZ1bGx5IHRlc3RlZCB5ZXRcblxuICB9LCB7XG4gICAga2V5OiBcImRlc3Ryb3lcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgdGhpcy5yZW1vdmVBbGxGaWxlcyh0cnVlKTtcbiAgICAgIGlmICh0aGlzLmhpZGRlbkZpbGVJbnB1dCAhPSBudWxsID8gdGhpcy5oaWRkZW5GaWxlSW5wdXQucGFyZW50Tm9kZSA6IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmhpZGRlbkZpbGVJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuaGlkZGVuRmlsZUlucHV0KTtcbiAgICAgICAgdGhpcy5oaWRkZW5GaWxlSW5wdXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudC5kcm9wem9uZTtcbiAgICAgIHJldHVybiBEcm9wem9uZS5pbnN0YW5jZXMuc3BsaWNlKERyb3B6b25lLmluc3RhbmNlcy5pbmRleE9mKHRoaXMpLCAxKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVUb3RhbFVwbG9hZFByb2dyZXNzKCkge1xuICAgICAgdmFyIHRvdGFsVXBsb2FkUHJvZ3Jlc3MgPSB2b2lkIDA7XG4gICAgICB2YXIgdG90YWxCeXRlc1NlbnQgPSAwO1xuICAgICAgdmFyIHRvdGFsQnl0ZXMgPSAwO1xuXG4gICAgICB2YXIgYWN0aXZlRmlsZXMgPSB0aGlzLmdldEFjdGl2ZUZpbGVzKCk7XG5cbiAgICAgIGlmIChhY3RpdmVGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTIgPSB0aGlzLmdldEFjdGl2ZUZpbGVzKCksIF9pc0FycmF5MTIgPSB0cnVlLCBfaTEyID0gMCwgX2l0ZXJhdG9yMTIgPSBfaXNBcnJheTEyID8gX2l0ZXJhdG9yMTIgOiBfaXRlcmF0b3IxMltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgIHZhciBfcmVmMTE7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkxMikge1xuICAgICAgICAgICAgaWYgKF9pMTIgPj0gX2l0ZXJhdG9yMTIubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYxMSA9IF9pdGVyYXRvcjEyW19pMTIrK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pMTIgPSBfaXRlcmF0b3IxMi5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoX2kxMi5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYxMSA9IF9pMTIudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGZpbGUgPSBfcmVmMTE7XG5cbiAgICAgICAgICB0b3RhbEJ5dGVzU2VudCArPSBmaWxlLnVwbG9hZC5ieXRlc1NlbnQ7XG4gICAgICAgICAgdG90YWxCeXRlcyArPSBmaWxlLnVwbG9hZC50b3RhbDtcbiAgICAgICAgfVxuICAgICAgICB0b3RhbFVwbG9hZFByb2dyZXNzID0gMTAwICogdG90YWxCeXRlc1NlbnQgLyB0b3RhbEJ5dGVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG90YWxVcGxvYWRQcm9ncmVzcyA9IDEwMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZW1pdChcInRvdGFsdXBsb2FkcHJvZ3Jlc3NcIiwgdG90YWxVcGxvYWRQcm9ncmVzcywgdG90YWxCeXRlcywgdG90YWxCeXRlc1NlbnQpO1xuICAgIH1cblxuICAgIC8vIEBvcHRpb25zLnBhcmFtTmFtZSBjYW4gYmUgYSBmdW5jdGlvbiB0YWtpbmcgb25lIHBhcmFtZXRlciByYXRoZXIgdGhhbiBhIHN0cmluZy5cbiAgICAvLyBBIHBhcmFtZXRlciBuYW1lIGZvciBhIGZpbGUgaXMgb2J0YWluZWQgc2ltcGx5IGJ5IGNhbGxpbmcgdGhpcyB3aXRoIGFuIGluZGV4IG51bWJlci5cblxuICB9LCB7XG4gICAga2V5OiBcIl9nZXRQYXJhbU5hbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFBhcmFtTmFtZShuKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wYXJhbU5hbWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnBhcmFtTmFtZShuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIlwiICsgdGhpcy5vcHRpb25zLnBhcmFtTmFtZSArICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUgPyBcIltcIiArIG4gKyBcIl1cIiA6IFwiXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIEBvcHRpb25zLnJlbmFtZUZpbGUgaXMgYSBmdW5jdGlvbixcbiAgICAvLyB0aGUgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIHRvIHJlbmFtZSB0aGUgZmlsZS5uYW1lIGJlZm9yZSBhcHBlbmRpbmcgaXQgdG8gdGhlIGZvcm1EYXRhXG5cbiAgfSwge1xuICAgIGtleTogXCJfcmVuYW1lRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVuYW1lRmlsZShmaWxlKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5yZW5hbWVGaWxlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUubmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucmVuYW1lRmlsZShmaWxlKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGEgZm9ybSB0aGF0IGNhbiBiZSB1c2VkIGFzIGZhbGxiYWNrIGlmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgRHJhZ25Ecm9wXG4gICAgLy9cbiAgICAvLyBJZiB0aGUgZHJvcHpvbmUgaXMgYWxyZWFkeSBhIGZvcm0sIG9ubHkgdGhlIGlucHV0IGZpZWxkIGFuZCBidXR0b24gYXJlIHJldHVybmVkLiBPdGhlcndpc2UgYSBjb21wbGV0ZSBmb3JtIGVsZW1lbnQgaXMgcHJvdmlkZWQuXG4gICAgLy8gVGhpcyBjb2RlIGhhcyB0byBwYXNzIGluIElFNyA6KFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RmFsbGJhY2tGb3JtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZhbGxiYWNrRm9ybSgpIHtcbiAgICAgIHZhciBleGlzdGluZ0ZhbGxiYWNrID0gdm9pZCAwLFxuICAgICAgICAgIGZvcm0gPSB2b2lkIDA7XG4gICAgICBpZiAoZXhpc3RpbmdGYWxsYmFjayA9IHRoaXMuZ2V0RXhpc3RpbmdGYWxsYmFjaygpKSB7XG4gICAgICAgIHJldHVybiBleGlzdGluZ0ZhbGxiYWNrO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmllbGRzU3RyaW5nID0gXCI8ZGl2IGNsYXNzPVxcXCJkei1mYWxsYmFja1xcXCI+XCI7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja1RleHQpIHtcbiAgICAgICAgZmllbGRzU3RyaW5nICs9IFwiPHA+XCIgKyB0aGlzLm9wdGlvbnMuZGljdEZhbGxiYWNrVGV4dCArIFwiPC9wPlwiO1xuICAgICAgfVxuICAgICAgZmllbGRzU3RyaW5nICs9IFwiPGlucHV0IHR5cGU9XFxcImZpbGVcXFwiIG5hbWU9XFxcIlwiICsgdGhpcy5fZ2V0UGFyYW1OYW1lKDApICsgXCJcXFwiIFwiICsgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSA/ICdtdWx0aXBsZT1cIm11bHRpcGxlXCInIDogdW5kZWZpbmVkKSArIFwiIC8+PGlucHV0IHR5cGU9XFxcInN1Ym1pdFxcXCIgdmFsdWU9XFxcIlVwbG9hZCFcXFwiPjwvZGl2PlwiO1xuXG4gICAgICB2YXIgZmllbGRzID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChmaWVsZHNTdHJpbmcpO1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lICE9PSBcIkZPUk1cIikge1xuICAgICAgICBmb3JtID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxmb3JtIGFjdGlvbj1cXFwiXCIgKyB0aGlzLm9wdGlvbnMudXJsICsgXCJcXFwiIGVuY3R5cGU9XFxcIm11bHRpcGFydC9mb3JtLWRhdGFcXFwiIG1ldGhvZD1cXFwiXCIgKyB0aGlzLm9wdGlvbnMubWV0aG9kICsgXCJcXFwiPjwvZm9ybT5cIik7XG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZmllbGRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBlbmN0eXBlIGFuZCBtZXRob2QgYXR0cmlidXRlcyBhcmUgc2V0IHByb3Blcmx5XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJlbmN0eXBlXCIsIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcIm1ldGhvZFwiLCB0aGlzLm9wdGlvbnMubWV0aG9kKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmb3JtICE9IG51bGwgPyBmb3JtIDogZmllbGRzO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgdGhlIGZhbGxiYWNrIGVsZW1lbnRzIGlmIHRoZXkgZXhpc3QgYWxyZWFkeVxuICAgIC8vXG4gICAgLy8gVGhpcyBjb2RlIGhhcyB0byBwYXNzIGluIElFNyA6KFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXhpc3RpbmdGYWxsYmFja1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRFeGlzdGluZ0ZhbGxiYWNrKCkge1xuICAgICAgdmFyIGdldEZhbGxiYWNrID0gZnVuY3Rpb24gZ2V0RmFsbGJhY2soZWxlbWVudHMpIHtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTMgPSBlbGVtZW50cywgX2lzQXJyYXkxMyA9IHRydWUsIF9pMTMgPSAwLCBfaXRlcmF0b3IxMyA9IF9pc0FycmF5MTMgPyBfaXRlcmF0b3IxMyA6IF9pdGVyYXRvcjEzW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYxMjtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTEzKSB7XG4gICAgICAgICAgICBpZiAoX2kxMyA+PSBfaXRlcmF0b3IxMy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjEyID0gX2l0ZXJhdG9yMTNbX2kxMysrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kxMyA9IF9pdGVyYXRvcjEzLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTEzLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjEyID0gX2kxMy52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZWwgPSBfcmVmMTI7XG5cbiAgICAgICAgICBpZiAoLyhefCApZmFsbGJhY2soJHwgKS8udGVzdChlbC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgX2FyciA9IFtcImRpdlwiLCBcImZvcm1cIl07XG4gICAgICBmb3IgKHZhciBfaTE0ID0gMDsgX2kxNCA8IF9hcnIubGVuZ3RoOyBfaTE0KyspIHtcbiAgICAgICAgdmFyIHRhZ05hbWUgPSBfYXJyW19pMTRdO1xuICAgICAgICB2YXIgZmFsbGJhY2s7XG4gICAgICAgIGlmIChmYWxsYmFjayA9IGdldEZhbGxiYWNrKHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lKSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBY3RpdmF0ZXMgYWxsIGxpc3RlbmVycyBzdG9yZWQgaW4gQGxpc3RlbmVyc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwic2V0dXBFdmVudExpc3RlbmVyc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzLm1hcChmdW5jdGlvbiAoZWxlbWVudExpc3RlbmVycykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICBmb3IgKHZhciBldmVudCBpbiBlbGVtZW50TGlzdGVuZXJzLmV2ZW50cykge1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gZWxlbWVudExpc3RlbmVycy5ldmVudHNbZXZlbnRdO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudExpc3RlbmVycy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBEZWFjdGl2YXRlcyBhbGwgbGlzdGVuZXJzIHN0b3JlZCBpbiBAbGlzdGVuZXJzXG5cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVFdmVudExpc3RlbmVyc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVycy5tYXAoZnVuY3Rpb24gKGVsZW1lbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgZm9yICh2YXIgZXZlbnQgaW4gZWxlbWVudExpc3RlbmVycy5ldmVudHMpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGVsZW1lbnRMaXN0ZW5lcnMuZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVsZW1lbnRMaXN0ZW5lcnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlcyBhbGwgZXZlbnQgbGlzdGVuZXJzIGFuZCBjYW5jZWxzIGFsbCBmaWxlcyBpbiB0aGUgcXVldWUgb3IgYmVpbmcgcHJvY2Vzc2VkLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzYWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotY2xpY2thYmxlXCIpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgICAgcmV0dXJuIHRoaXMuZmlsZXMubWFwKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBfdGhpczQuY2FuY2VsVXBsb2FkKGZpbGUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImVuYWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgICBkZWxldGUgdGhpcy5kaXNhYmxlZDtcbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotY2xpY2thYmxlXCIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhIG5pY2VseSBmb3JtYXR0ZWQgZmlsZXNpemVcblxuICB9LCB7XG4gICAga2V5OiBcImZpbGVzaXplXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbGVzaXplKHNpemUpIHtcbiAgICAgIHZhciBzZWxlY3RlZFNpemUgPSAwO1xuICAgICAgdmFyIHNlbGVjdGVkVW5pdCA9IFwiYlwiO1xuXG4gICAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgICAgdmFyIHVuaXRzID0gWyd0YicsICdnYicsICdtYicsICdrYicsICdiJ107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bml0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB1bml0ID0gdW5pdHNbaV07XG4gICAgICAgICAgdmFyIGN1dG9mZiA9IE1hdGgucG93KHRoaXMub3B0aW9ucy5maWxlc2l6ZUJhc2UsIDQgLSBpKSAvIDEwO1xuXG4gICAgICAgICAgaWYgKHNpemUgPj0gY3V0b2ZmKSB7XG4gICAgICAgICAgICBzZWxlY3RlZFNpemUgPSBzaXplIC8gTWF0aC5wb3codGhpcy5vcHRpb25zLmZpbGVzaXplQmFzZSwgNCAtIGkpO1xuICAgICAgICAgICAgc2VsZWN0ZWRVbml0ID0gdW5pdDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGVjdGVkU2l6ZSA9IE1hdGgucm91bmQoMTAgKiBzZWxlY3RlZFNpemUpIC8gMTA7IC8vIEN1dHRpbmcgb2YgZGlnaXRzXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBcIjxzdHJvbmc+XCIgKyBzZWxlY3RlZFNpemUgKyBcIjwvc3Ryb25nPiBcIiArIHRoaXMub3B0aW9ucy5kaWN0RmlsZVNpemVVbml0c1tzZWxlY3RlZFVuaXRdO1xuICAgIH1cblxuICAgIC8vIEFkZHMgb3IgcmVtb3ZlcyB0aGUgYGR6LW1heC1maWxlcy1yZWFjaGVkYCBjbGFzcyBmcm9tIHRoZSBmb3JtLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3VwZGF0ZU1heEZpbGVzUmVhY2hlZENsYXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF91cGRhdGVNYXhGaWxlc1JlYWNoZWRDbGFzcygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RmlsZXMgIT0gbnVsbCAmJiB0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPj0gdGhpcy5vcHRpb25zLm1heEZpbGVzKSB7XG4gICAgICAgIGlmICh0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPT09IHRoaXMub3B0aW9ucy5tYXhGaWxlcykge1xuICAgICAgICAgIHRoaXMuZW1pdCgnbWF4ZmlsZXNyZWFjaGVkJywgdGhpcy5maWxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotbWF4LWZpbGVzLXJlYWNoZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1tYXgtZmlsZXMtcmVhY2hlZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHJvcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkcm9wKGUpIHtcbiAgICAgIGlmICghZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KFwiZHJvcFwiLCBlKTtcblxuICAgICAgLy8gQ29udmVydCB0aGUgRmlsZUxpc3QgdG8gYW4gQXJyYXlcbiAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBJRTExXG4gICAgICB2YXIgZmlsZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZS5kYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZmlsZXNbaV0gPSBlLmRhdGFUcmFuc2Zlci5maWxlc1tpXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KFwiYWRkZWRmaWxlc1wiLCBmaWxlcyk7XG5cbiAgICAgIC8vIEV2ZW4gaWYgaXQncyBhIGZvbGRlciwgZmlsZXMubGVuZ3RoIHdpbGwgY29udGFpbiB0aGUgZm9sZGVycy5cbiAgICAgIGlmIChmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGl0ZW1zID0gZS5kYXRhVHJhbnNmZXIuaXRlbXM7XG5cbiAgICAgICAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCAmJiBpdGVtc1swXS53ZWJraXRHZXRBc0VudHJ5ICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBUaGUgYnJvd3NlciBzdXBwb3J0cyBkcm9wcGluZyBvZiBmb2xkZXJzLCBzbyBoYW5kbGUgaXRlbXMgaW5zdGVhZCBvZiBmaWxlc1xuICAgICAgICAgIHRoaXMuX2FkZEZpbGVzRnJvbUl0ZW1zKGl0ZW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUZpbGVzKGZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwYXN0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXN0ZShlKSB7XG4gICAgICBpZiAoX19ndWFyZF9fKGUgIT0gbnVsbCA/IGUuY2xpcGJvYXJkRGF0YSA6IHVuZGVmaW5lZCwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIHguaXRlbXM7XG4gICAgICB9KSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KFwicGFzdGVcIiwgZSk7XG4gICAgICB2YXIgaXRlbXMgPSBlLmNsaXBib2FyZERhdGEuaXRlbXM7XG5cblxuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkRmlsZXNGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVGaWxlcyhmaWxlcykge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTQgPSBmaWxlcywgX2lzQXJyYXkxNCA9IHRydWUsIF9pMTUgPSAwLCBfaXRlcmF0b3IxNCA9IF9pc0FycmF5MTQgPyBfaXRlcmF0b3IxNCA6IF9pdGVyYXRvcjE0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMTM7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MTQpIHtcbiAgICAgICAgICBpZiAoX2kxNSA+PSBfaXRlcmF0b3IxNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxMyA9IF9pdGVyYXRvcjE0W19pMTUrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kxNSA9IF9pdGVyYXRvcjE0Lm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kxNS5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMTMgPSBfaTE1LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMTM7XG5cbiAgICAgICAgdGhpcy5hZGRGaWxlKGZpbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdoZW4gYSBmb2xkZXIgaXMgZHJvcHBlZCAob3IgZmlsZXMgYXJlIHBhc3RlZCksIGl0ZW1zIG11c3QgYmUgaGFuZGxlZFxuICAgIC8vIGluc3RlYWQgb2YgZmlsZXMuXG5cbiAgfSwge1xuICAgIGtleTogXCJfYWRkRmlsZXNGcm9tSXRlbXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2FkZEZpbGVzRnJvbUl0ZW1zKGl0ZW1zKSB7XG4gICAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxNSA9IGl0ZW1zLCBfaXNBcnJheTE1ID0gdHJ1ZSwgX2kxNiA9IDAsIF9pdGVyYXRvcjE1ID0gX2lzQXJyYXkxNSA/IF9pdGVyYXRvcjE1IDogX2l0ZXJhdG9yMTVbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjE0O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MTUpIHtcbiAgICAgICAgICAgIGlmIChfaTE2ID49IF9pdGVyYXRvcjE1Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTQgPSBfaXRlcmF0b3IxNVtfaTE2KytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTE2ID0gX2l0ZXJhdG9yMTUubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMTYuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTQgPSBfaTE2LnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBpdGVtID0gX3JlZjE0O1xuXG4gICAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICAgIGlmIChpdGVtLndlYmtpdEdldEFzRW50cnkgIT0gbnVsbCAmJiAoZW50cnkgPSBpdGVtLndlYmtpdEdldEFzRW50cnkoKSkpIHtcbiAgICAgICAgICAgIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2goX3RoaXM1LmFkZEZpbGUoaXRlbS5nZXRBc0ZpbGUoKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbnRyeS5pc0RpcmVjdG9yeSkge1xuICAgICAgICAgICAgICAvLyBBcHBlbmQgYWxsIGZpbGVzIGZyb20gdGhhdCBkaXJlY3RvcnkgdG8gZmlsZXNcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2goX3RoaXM1Ll9hZGRGaWxlc0Zyb21EaXJlY3RvcnkoZW50cnksIGVudHJ5Lm5hbWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmdldEFzRmlsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5raW5kID09IG51bGwgfHwgaXRlbS5raW5kID09PSBcImZpbGVcIikge1xuICAgICAgICAgICAgICByZXN1bHQucHVzaChfdGhpczUuYWRkRmlsZShpdGVtLmdldEFzRmlsZSgpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSgpO1xuICAgIH1cblxuICAgIC8vIEdvZXMgdGhyb3VnaCB0aGUgZGlyZWN0b3J5LCBhbmQgYWRkcyBlYWNoIGZpbGUgaXQgZmluZHMgcmVjdXJzaXZlbHlcblxuICB9LCB7XG4gICAga2V5OiBcIl9hZGRGaWxlc0Zyb21EaXJlY3RvcnlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2FkZEZpbGVzRnJvbURpcmVjdG9yeShkaXJlY3RvcnksIHBhdGgpIHtcbiAgICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgICB2YXIgZGlyUmVhZGVyID0gZGlyZWN0b3J5LmNyZWF0ZVJlYWRlcigpO1xuXG4gICAgICB2YXIgZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gZXJyb3JIYW5kbGVyKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBfX2d1YXJkTWV0aG9kX18oY29uc29sZSwgJ2xvZycsIGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgcmV0dXJuIG8ubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgcmVhZEVudHJpZXMgPSBmdW5jdGlvbiByZWFkRW50cmllcygpIHtcbiAgICAgICAgcmV0dXJuIGRpclJlYWRlci5yZWFkRW50cmllcyhmdW5jdGlvbiAoZW50cmllcykge1xuICAgICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjE2ID0gZW50cmllcywgX2lzQXJyYXkxNiA9IHRydWUsIF9pMTcgPSAwLCBfaXRlcmF0b3IxNiA9IF9pc0FycmF5MTYgPyBfaXRlcmF0b3IxNiA6IF9pdGVyYXRvcjE2W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmMTU7XG5cbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5MTYpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2kxNyA+PSBfaXRlcmF0b3IxNi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWYxNSA9IF9pdGVyYXRvcjE2W19pMTcrK107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2kxNyA9IF9pdGVyYXRvcjE2Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2kxNy5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmMTUgPSBfaTE3LnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gX3JlZjE1O1xuXG4gICAgICAgICAgICAgIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgICBlbnRyeS5maWxlKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX3RoaXM2Lm9wdGlvbnMuaWdub3JlSGlkZGVuRmlsZXMgJiYgZmlsZS5uYW1lLnN1YnN0cmluZygwLCAxKSA9PT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGZpbGUuZnVsbFBhdGggPSBwYXRoICsgXCIvXCIgKyBmaWxlLm5hbWU7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM2LmFkZEZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgICAgICBfdGhpczYuX2FkZEZpbGVzRnJvbURpcmVjdG9yeShlbnRyeSwgcGF0aCArIFwiL1wiICsgZW50cnkubmFtZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVjdXJzaXZlbHkgY2FsbCByZWFkRW50cmllcygpIGFnYWluLCBzaW5jZSBicm93c2VyIG9ubHkgaGFuZGxlXG4gICAgICAgICAgICAvLyB0aGUgZmlyc3QgMTAwIGVudHJpZXMuXG4gICAgICAgICAgICAvLyBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EaXJlY3RvcnlSZWFkZXIjcmVhZEVudHJpZXNcbiAgICAgICAgICAgIHJlYWRFbnRyaWVzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LCBlcnJvckhhbmRsZXIpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHJlYWRFbnRyaWVzKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgYGRvbmUoKWAgaXMgY2FsbGVkIHdpdGhvdXQgYXJndW1lbnQgdGhlIGZpbGUgaXMgYWNjZXB0ZWRcbiAgICAvLyBJZiB5b3UgY2FsbCBpdCB3aXRoIGFuIGVycm9yIG1lc3NhZ2UsIHRoZSBmaWxlIGlzIHJlamVjdGVkXG4gICAgLy8gKFRoaXMgYWxsb3dzIGZvciBhc3luY2hyb25vdXMgdmFsaWRhdGlvbilcbiAgICAvL1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gY2hlY2tzIHRoZSBmaWxlc2l6ZSwgYW5kIGlmIHRoZSBmaWxlLnR5cGUgcGFzc2VzIHRoZVxuICAgIC8vIGBhY2NlcHRlZEZpbGVzYCBjaGVjay5cblxuICB9LCB7XG4gICAga2V5OiBcImFjY2VwdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhY2NlcHQoZmlsZSwgZG9uZSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5tYXhGaWxlc2l6ZSAmJiBmaWxlLnNpemUgPiB0aGlzLm9wdGlvbnMubWF4RmlsZXNpemUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICByZXR1cm4gZG9uZSh0aGlzLm9wdGlvbnMuZGljdEZpbGVUb29CaWcucmVwbGFjZShcInt7ZmlsZXNpemV9fVwiLCBNYXRoLnJvdW5kKGZpbGUuc2l6ZSAvIDEwMjQgLyAxMC4yNCkgLyAxMDApLnJlcGxhY2UoXCJ7e21heEZpbGVzaXplfX1cIiwgdGhpcy5vcHRpb25zLm1heEZpbGVzaXplKSk7XG4gICAgICB9IGVsc2UgaWYgKCFEcm9wem9uZS5pc1ZhbGlkRmlsZShmaWxlLCB0aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcykpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUodGhpcy5vcHRpb25zLmRpY3RJbnZhbGlkRmlsZVR5cGUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMubWF4RmlsZXMgIT0gbnVsbCAmJiB0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPj0gdGhpcy5vcHRpb25zLm1heEZpbGVzKSB7XG4gICAgICAgIGRvbmUodGhpcy5vcHRpb25zLmRpY3RNYXhGaWxlc0V4Y2VlZGVkLnJlcGxhY2UoXCJ7e21heEZpbGVzfX1cIiwgdGhpcy5vcHRpb25zLm1heEZpbGVzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXQoXCJtYXhmaWxlc2V4Y2VlZGVkXCIsIGZpbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5hY2NlcHQuY2FsbCh0aGlzLCBmaWxlLCBkb25lKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRGaWxlKGZpbGUpIHtcbiAgICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgICBmaWxlLnVwbG9hZCA9IHtcbiAgICAgICAgdXVpZDogRHJvcHpvbmUudXVpZHY0KCksXG4gICAgICAgIHByb2dyZXNzOiAwLFxuICAgICAgICAvLyBTZXR0aW5nIHRoZSB0b3RhbCB1cGxvYWQgc2l6ZSB0byBmaWxlLnNpemUgZm9yIHRoZSBiZWdpbm5pbmdcbiAgICAgICAgLy8gSXQncyBhY3R1YWwgZGlmZmVyZW50IHRoYW4gdGhlIHNpemUgdG8gYmUgdHJhbnNtaXR0ZWQuXG4gICAgICAgIHRvdGFsOiBmaWxlLnNpemUsXG4gICAgICAgIGJ5dGVzU2VudDogMCxcbiAgICAgICAgZmlsZW5hbWU6IHRoaXMuX3JlbmFtZUZpbGUoZmlsZSksXG4gICAgICAgIGNodW5rZWQ6IHRoaXMub3B0aW9ucy5jaHVua2luZyAmJiAodGhpcy5vcHRpb25zLmZvcmNlQ2h1bmtpbmcgfHwgZmlsZS5zaXplID4gdGhpcy5vcHRpb25zLmNodW5rU2l6ZSksXG4gICAgICAgIHRvdGFsQ2h1bmtDb3VudDogTWF0aC5jZWlsKGZpbGUuc2l6ZSAvIHRoaXMub3B0aW9ucy5jaHVua1NpemUpXG4gICAgICB9O1xuICAgICAgdGhpcy5maWxlcy5wdXNoKGZpbGUpO1xuXG4gICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLkFEREVEO1xuXG4gICAgICB0aGlzLmVtaXQoXCJhZGRlZGZpbGVcIiwgZmlsZSk7XG5cbiAgICAgIHRoaXMuX2VucXVldWVUaHVtYm5haWwoZmlsZSk7XG5cbiAgICAgIHJldHVybiB0aGlzLmFjY2VwdChmaWxlLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgZmlsZS5hY2NlcHRlZCA9IGZhbHNlO1xuICAgICAgICAgIF90aGlzNy5fZXJyb3JQcm9jZXNzaW5nKFtmaWxlXSwgZXJyb3IpOyAvLyBXaWxsIHNldCB0aGUgZmlsZS5zdGF0dXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlLmFjY2VwdGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoX3RoaXM3Lm9wdGlvbnMuYXV0b1F1ZXVlKSB7XG4gICAgICAgICAgICBfdGhpczcuZW5xdWV1ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgfSAvLyBXaWxsIHNldCAuYWNjZXB0ZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF90aGlzNy5fdXBkYXRlTWF4RmlsZXNSZWFjaGVkQ2xhc3MoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdyYXBwZXIgZm9yIGVucXVldWVGaWxlXG5cbiAgfSwge1xuICAgIGtleTogXCJlbnF1ZXVlRmlsZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5xdWV1ZUZpbGVzKGZpbGVzKSB7XG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IxNyA9IGZpbGVzLCBfaXNBcnJheTE3ID0gdHJ1ZSwgX2kxOCA9IDAsIF9pdGVyYXRvcjE3ID0gX2lzQXJyYXkxNyA/IF9pdGVyYXRvcjE3IDogX2l0ZXJhdG9yMTdbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYxNjtcblxuICAgICAgICBpZiAoX2lzQXJyYXkxNykge1xuICAgICAgICAgIGlmIChfaTE4ID49IF9pdGVyYXRvcjE3Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjE2ID0gX2l0ZXJhdG9yMTdbX2kxOCsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTE4ID0gX2l0ZXJhdG9yMTcubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTE4LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxNiA9IF9pMTgudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZSA9IF9yZWYxNjtcblxuICAgICAgICB0aGlzLmVucXVldWVGaWxlKGZpbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImVucXVldWVGaWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVucXVldWVGaWxlKGZpbGUpIHtcbiAgICAgIHZhciBfdGhpczggPSB0aGlzO1xuXG4gICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLkFEREVEICYmIGZpbGUuYWNjZXB0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5RVUVVRUQ7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczgucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICAgICAgfSwgMCk7IC8vIERlZmVycmluZyB0aGUgY2FsbFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGZpbGUgY2FuJ3QgYmUgcXVldWVkIGJlY2F1c2UgaXQgaGFzIGFscmVhZHkgYmVlbiBwcm9jZXNzZWQgb3Igd2FzIHJlamVjdGVkLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2VucXVldWVUaHVtYm5haWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VucXVldWVUaHVtYm5haWwoZmlsZSkge1xuICAgICAgdmFyIF90aGlzOSA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3JlYXRlSW1hZ2VUaHVtYm5haWxzICYmIGZpbGUudHlwZS5tYXRjaCgvaW1hZ2UuKi8pICYmIGZpbGUuc2l6ZSA8PSB0aGlzLm9wdGlvbnMubWF4VGh1bWJuYWlsRmlsZXNpemUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICB0aGlzLl90aHVtYm5haWxRdWV1ZS5wdXNoKGZpbGUpO1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzOS5fcHJvY2Vzc1RodW1ibmFpbFF1ZXVlKCk7XG4gICAgICAgIH0sIDApOyAvLyBEZWZlcnJpbmcgdGhlIGNhbGxcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX3Byb2Nlc3NUaHVtYm5haWxRdWV1ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcHJvY2Vzc1RodW1ibmFpbFF1ZXVlKCkge1xuICAgICAgdmFyIF90aGlzMTAgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5fcHJvY2Vzc2luZ1RodW1ibmFpbCB8fCB0aGlzLl90aHVtYm5haWxRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wcm9jZXNzaW5nVGh1bWJuYWlsID0gdHJ1ZTtcbiAgICAgIHZhciBmaWxlID0gdGhpcy5fdGh1bWJuYWlsUXVldWUuc2hpZnQoKTtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVRodW1ibmFpbChmaWxlLCB0aGlzLm9wdGlvbnMudGh1bWJuYWlsV2lkdGgsIHRoaXMub3B0aW9ucy50aHVtYm5haWxIZWlnaHQsIHRoaXMub3B0aW9ucy50aHVtYm5haWxNZXRob2QsIHRydWUsIGZ1bmN0aW9uIChkYXRhVXJsKSB7XG4gICAgICAgIF90aGlzMTAuZW1pdChcInRodW1ibmFpbFwiLCBmaWxlLCBkYXRhVXJsKTtcbiAgICAgICAgX3RoaXMxMC5fcHJvY2Vzc2luZ1RodW1ibmFpbCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gX3RoaXMxMC5fcHJvY2Vzc1RodW1ibmFpbFF1ZXVlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDYW4gYmUgY2FsbGVkIGJ5IHRoZSB1c2VyIHRvIHJlbW92ZSBhIGZpbGVcblxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZUZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRmlsZShmaWxlKSB7XG4gICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlVQTE9BRElORykge1xuICAgICAgICB0aGlzLmNhbmNlbFVwbG9hZChmaWxlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsZXMgPSB3aXRob3V0KHRoaXMuZmlsZXMsIGZpbGUpO1xuXG4gICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkZmlsZVwiLCBmaWxlKTtcbiAgICAgIGlmICh0aGlzLmZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0KFwicmVzZXRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlcyBhbGwgZmlsZXMgdGhhdCBhcmVuJ3QgY3VycmVudGx5IHByb2Nlc3NlZCBmcm9tIHRoZSBsaXN0XG5cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVBbGxGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVBbGxGaWxlcyhjYW5jZWxJZk5lY2Vzc2FyeSkge1xuICAgICAgLy8gQ3JlYXRlIGEgY29weSBvZiBmaWxlcyBzaW5jZSByZW1vdmVGaWxlKCkgY2hhbmdlcyB0aGUgQGZpbGVzIGFycmF5LlxuICAgICAgaWYgKGNhbmNlbElmTmVjZXNzYXJ5ID09IG51bGwpIHtcbiAgICAgICAgY2FuY2VsSWZOZWNlc3NhcnkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjE4ID0gdGhpcy5maWxlcy5zbGljZSgpLCBfaXNBcnJheTE4ID0gdHJ1ZSwgX2kxOSA9IDAsIF9pdGVyYXRvcjE4ID0gX2lzQXJyYXkxOCA/IF9pdGVyYXRvcjE4IDogX2l0ZXJhdG9yMThbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYxNztcblxuICAgICAgICBpZiAoX2lzQXJyYXkxOCkge1xuICAgICAgICAgIGlmIChfaTE5ID49IF9pdGVyYXRvcjE4Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjE3ID0gX2l0ZXJhdG9yMThbX2kxOSsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTE5ID0gX2l0ZXJhdG9yMTgubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTE5LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxNyA9IF9pMTkudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZSA9IF9yZWYxNztcblxuICAgICAgICBpZiAoZmlsZS5zdGF0dXMgIT09IERyb3B6b25lLlVQTE9BRElORyB8fCBjYW5jZWxJZk5lY2Vzc2FyeSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gUmVzaXplcyBhbiBpbWFnZSBiZWZvcmUgaXQgZ2V0cyBzZW50IHRvIHRoZSBzZXJ2ZXIuIFRoaXMgZnVuY3Rpb24gaXMgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2ZcbiAgICAvLyBgb3B0aW9ucy50cmFuc2Zvcm1GaWxlYCBpZiBgcmVzaXplV2lkdGhgIG9yIGByZXNpemVIZWlnaHRgIGFyZSBzZXQuIFRoZSBjYWxsYmFjayBpcyBpbnZva2VkIHdpdGhcbiAgICAvLyB0aGUgcmVzaXplZCBibG9iLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVzaXplSW1hZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzaXplSW1hZ2UoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kLCBjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzMTEgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVUaHVtYm5haWwoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kLCB0cnVlLCBmdW5jdGlvbiAoZGF0YVVybCwgY2FudmFzKSB7XG4gICAgICAgIGlmIChjYW52YXMgPT0gbnVsbCkge1xuICAgICAgICAgIC8vIFRoZSBpbWFnZSBoYXMgbm90IGJlZW4gcmVzaXplZFxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhmaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcmVzaXplTWltZVR5cGUgPSBfdGhpczExLm9wdGlvbnMucmVzaXplTWltZVR5cGU7XG5cbiAgICAgICAgICBpZiAocmVzaXplTWltZVR5cGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzaXplTWltZVR5cGUgPSBmaWxlLnR5cGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciByZXNpemVkRGF0YVVSTCA9IGNhbnZhcy50b0RhdGFVUkwocmVzaXplTWltZVR5cGUsIF90aGlzMTEub3B0aW9ucy5yZXNpemVRdWFsaXR5KTtcbiAgICAgICAgICBpZiAocmVzaXplTWltZVR5cGUgPT09ICdpbWFnZS9qcGVnJyB8fCByZXNpemVNaW1lVHlwZSA9PT0gJ2ltYWdlL2pwZycpIHtcbiAgICAgICAgICAgIC8vIE5vdyBhZGQgdGhlIG9yaWdpbmFsIEVYSUYgaW5mb3JtYXRpb25cbiAgICAgICAgICAgIHJlc2l6ZWREYXRhVVJMID0gRXhpZlJlc3RvcmUucmVzdG9yZShmaWxlLmRhdGFVUkwsIHJlc2l6ZWREYXRhVVJMKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKERyb3B6b25lLmRhdGFVUkl0b0Jsb2IocmVzaXplZERhdGFVUkwpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZVRodW1ibmFpbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVUaHVtYm5haWwoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kLCBmaXhPcmllbnRhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczEyID0gdGhpcztcblxuICAgICAgdmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBmaWxlLmRhdGFVUkwgPSBmaWxlUmVhZGVyLnJlc3VsdDtcblxuICAgICAgICAvLyBEb24ndCBib3RoZXIgY3JlYXRpbmcgYSB0aHVtYm5haWwgZm9yIFNWRyBpbWFnZXMgc2luY2UgdGhleSdyZSB2ZWN0b3JcbiAgICAgICAgaWYgKGZpbGUudHlwZSA9PT0gXCJpbWFnZS9zdmcreG1sXCIpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FsbGJhY2soZmlsZVJlYWRlci5yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMxMi5jcmVhdGVUaHVtYm5haWxGcm9tVXJsKGZpbGUsIHdpZHRoLCBoZWlnaHQsIHJlc2l6ZU1ldGhvZCwgZml4T3JpZW50YXRpb24sIGNhbGxiYWNrKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZVRodW1ibmFpbEZyb21VcmxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlVGh1bWJuYWlsRnJvbVVybChmaWxlLCB3aWR0aCwgaGVpZ2h0LCByZXNpemVNZXRob2QsIGZpeE9yaWVudGF0aW9uLCBjYWxsYmFjaywgY3Jvc3NPcmlnaW4pIHtcbiAgICAgIHZhciBfdGhpczEzID0gdGhpcztcblxuICAgICAgLy8gTm90IHVzaW5nIGBuZXcgSW1hZ2VgIGhlcmUgYmVjYXVzZSBvZiBhIGJ1ZyBpbiBsYXRlc3QgQ2hyb21lIHZlcnNpb25zLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbnlvL2Ryb3B6b25lL3B1bGwvMjI2XG4gICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblxuICAgICAgaWYgKGNyb3NzT3JpZ2luKSB7XG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9IGNyb3NzT3JpZ2luO1xuICAgICAgfVxuXG4gICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbG9hZEV4aWYgPSBmdW5jdGlvbiBsb2FkRXhpZihjYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjaygxKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBFWElGICE9PSAndW5kZWZpbmVkJyAmJiBFWElGICE9PSBudWxsICYmIGZpeE9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgbG9hZEV4aWYgPSBmdW5jdGlvbiBsb2FkRXhpZihjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIEVYSUYuZ2V0RGF0YShpbWcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKEVYSUYuZ2V0VGFnKHRoaXMsICdPcmllbnRhdGlvbicpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9hZEV4aWYoZnVuY3Rpb24gKG9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgZmlsZS53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgICBmaWxlLmhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICAgICAgICB2YXIgcmVzaXplSW5mbyA9IF90aGlzMTMub3B0aW9ucy5yZXNpemUuY2FsbChfdGhpczEzLCBmaWxlLCB3aWR0aCwgaGVpZ2h0LCByZXNpemVNZXRob2QpO1xuXG4gICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgICAgICBjYW52YXMud2lkdGggPSByZXNpemVJbmZvLnRyZ1dpZHRoO1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSByZXNpemVJbmZvLnRyZ0hlaWdodDtcblxuICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA+IDQpIHtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHJlc2l6ZUluZm8udHJnSGVpZ2h0O1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHJlc2l6ZUluZm8udHJnV2lkdGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3dpdGNoIChvcmllbnRhdGlvbikge1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAvLyBob3Jpem9udGFsIGZsaXBcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShjYW52YXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgLy8gMTgwwrAgcm90YXRlIGxlZnRcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgICBjdHgucm90YXRlKE1hdGguUEkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgLy8gdmVydGljYWwgZmxpcFxuICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKDAsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgLy8gdmVydGljYWwgZmxpcCArIDkwIHJvdGF0ZSByaWdodFxuICAgICAgICAgICAgICBjdHgucm90YXRlKDAuNSAqIE1hdGguUEkpO1xuICAgICAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgLy8gOTDCsCByb3RhdGUgcmlnaHRcbiAgICAgICAgICAgICAgY3R4LnJvdGF0ZSgwLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtY2FudmFzLndpZHRoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgIC8vIGhvcml6b250YWwgZmxpcCArIDkwIHJvdGF0ZSByaWdodFxuICAgICAgICAgICAgICBjdHgucm90YXRlKDAuNSAqIE1hdGguUEkpO1xuICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKGNhbnZhcy5oZWlnaHQsIC1jYW52YXMud2lkdGgpO1xuICAgICAgICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgLy8gOTDCsCByb3RhdGUgbGVmdFxuICAgICAgICAgICAgICBjdHgucm90YXRlKC0wLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgtY2FudmFzLmhlaWdodCwgMCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgYSBidWdmaXggZm9yIGlPUycgc2NhbGluZyBidWcuXG4gICAgICAgICAgZHJhd0ltYWdlSU9TRml4KGN0eCwgaW1nLCByZXNpemVJbmZvLnNyY1ggIT0gbnVsbCA/IHJlc2l6ZUluZm8uc3JjWCA6IDAsIHJlc2l6ZUluZm8uc3JjWSAhPSBudWxsID8gcmVzaXplSW5mby5zcmNZIDogMCwgcmVzaXplSW5mby5zcmNXaWR0aCwgcmVzaXplSW5mby5zcmNIZWlnaHQsIHJlc2l6ZUluZm8udHJnWCAhPSBudWxsID8gcmVzaXplSW5mby50cmdYIDogMCwgcmVzaXplSW5mby50cmdZICE9IG51bGwgPyByZXNpemVJbmZvLnRyZ1kgOiAwLCByZXNpemVJbmZvLnRyZ1dpZHRoLCByZXNpemVJbmZvLnRyZ0hlaWdodCk7XG5cbiAgICAgICAgICB2YXIgdGh1bWJuYWlsID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL3BuZ1wiKTtcblxuICAgICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodGh1bWJuYWlsLCBjYW52YXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICBpbWcub25lcnJvciA9IGNhbGxiYWNrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW1nLnNyYyA9IGZpbGUuZGF0YVVSTDtcbiAgICB9XG5cbiAgICAvLyBHb2VzIHRocm91Z2ggdGhlIHF1ZXVlIGFuZCBwcm9jZXNzZXMgZmlsZXMgaWYgdGhlcmUgYXJlbid0IHRvbyBtYW55IGFscmVhZHkuXG5cbiAgfSwge1xuICAgIGtleTogXCJwcm9jZXNzUXVldWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2Vzc1F1ZXVlKCkge1xuICAgICAgdmFyIHBhcmFsbGVsVXBsb2FkcyA9IHRoaXMub3B0aW9ucy5wYXJhbGxlbFVwbG9hZHM7XG5cbiAgICAgIHZhciBwcm9jZXNzaW5nTGVuZ3RoID0gdGhpcy5nZXRVcGxvYWRpbmdGaWxlcygpLmxlbmd0aDtcbiAgICAgIHZhciBpID0gcHJvY2Vzc2luZ0xlbmd0aDtcblxuICAgICAgLy8gVGhlcmUgYXJlIGFscmVhZHkgYXQgbGVhc3QgYXMgbWFueSBmaWxlcyB1cGxvYWRpbmcgdGhhbiBzaG91bGQgYmVcbiAgICAgIGlmIChwcm9jZXNzaW5nTGVuZ3RoID49IHBhcmFsbGVsVXBsb2Fkcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBxdWV1ZWRGaWxlcyA9IHRoaXMuZ2V0UXVldWVkRmlsZXMoKTtcblxuICAgICAgaWYgKCEocXVldWVkRmlsZXMubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIC8vIFRoZSBmaWxlcyBzaG91bGQgYmUgdXBsb2FkZWQgaW4gb25lIHJlcXVlc3RcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0ZpbGVzKHF1ZXVlZEZpbGVzLnNsaWNlKDAsIHBhcmFsbGVsVXBsb2FkcyAtIHByb2Nlc3NpbmdMZW5ndGgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChpIDwgcGFyYWxsZWxVcGxvYWRzKSB7XG4gICAgICAgICAgaWYgKCFxdWV1ZWRGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IC8vIE5vdGhpbmcgbGVmdCB0byBwcm9jZXNzXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRmlsZShxdWV1ZWRGaWxlcy5zaGlmdCgpKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXcmFwcGVyIGZvciBgcHJvY2Vzc0ZpbGVzYFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicHJvY2Vzc0ZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2Vzc0ZpbGUoZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0ZpbGVzKFtmaWxlXSk7XG4gICAgfVxuXG4gICAgLy8gTG9hZHMgdGhlIGZpbGUsIHRoZW4gY2FsbHMgZmluaXNoZWRMb2FkaW5nKClcblxuICB9LCB7XG4gICAga2V5OiBcInByb2Nlc3NGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9jZXNzRmlsZXMoZmlsZXMpIHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjE5ID0gZmlsZXMsIF9pc0FycmF5MTkgPSB0cnVlLCBfaTIwID0gMCwgX2l0ZXJhdG9yMTkgPSBfaXNBcnJheTE5ID8gX2l0ZXJhdG9yMTkgOiBfaXRlcmF0b3IxOVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjE4O1xuXG4gICAgICAgIGlmIChfaXNBcnJheTE5KSB7XG4gICAgICAgICAgaWYgKF9pMjAgPj0gX2l0ZXJhdG9yMTkubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICBfcmVmMTggPSBfaXRlcmF0b3IxOVtfaTIwKytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMjAgPSBfaXRlcmF0b3IxOS5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMjAuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgX3JlZjE4ID0gX2kyMC52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlID0gX3JlZjE4O1xuXG4gICAgICAgIGZpbGUucHJvY2Vzc2luZyA9IHRydWU7IC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuVVBMT0FESU5HO1xuXG4gICAgICAgIHRoaXMuZW1pdChcInByb2Nlc3NpbmdcIiwgZmlsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwicHJvY2Vzc2luZ211bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudXBsb2FkRmlsZXMoZmlsZXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZ2V0RmlsZXNXaXRoWGhyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRGaWxlc1dpdGhYaHIoeGhyKSB7XG4gICAgICB2YXIgZmlsZXMgPSB2b2lkIDA7XG4gICAgICByZXR1cm4gZmlsZXMgPSB0aGlzLmZpbGVzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gZmlsZS54aHIgPT09IHhocjtcbiAgICAgIH0pLm1hcChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENhbmNlbHMgdGhlIGZpbGUgdXBsb2FkIGFuZCBzZXRzIHRoZSBzdGF0dXMgdG8gQ0FOQ0VMRURcbiAgICAvLyAqKmlmKiogdGhlIGZpbGUgaXMgYWN0dWFsbHkgYmVpbmcgdXBsb2FkZWQuXG4gICAgLy8gSWYgaXQncyBzdGlsbCBpbiB0aGUgcXVldWUsIHRoZSBmaWxlIGlzIGJlaW5nIHJlbW92ZWQgZnJvbSBpdCBhbmQgdGhlIHN0YXR1c1xuICAgIC8vIHNldCB0byBDQU5DRUxFRC5cblxuICB9LCB7XG4gICAga2V5OiBcImNhbmNlbFVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWxVcGxvYWQoZmlsZSkge1xuICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcpIHtcbiAgICAgICAgdmFyIGdyb3VwZWRGaWxlcyA9IHRoaXMuX2dldEZpbGVzV2l0aFhocihmaWxlLnhocik7XG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIwID0gZ3JvdXBlZEZpbGVzLCBfaXNBcnJheTIwID0gdHJ1ZSwgX2kyMSA9IDAsIF9pdGVyYXRvcjIwID0gX2lzQXJyYXkyMCA/IF9pdGVyYXRvcjIwIDogX2l0ZXJhdG9yMjBbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjE5O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MjApIHtcbiAgICAgICAgICAgIGlmIChfaTIxID49IF9pdGVyYXRvcjIwLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTkgPSBfaXRlcmF0b3IyMFtfaTIxKytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTIxID0gX2l0ZXJhdG9yMjAubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMjEuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTkgPSBfaTIxLnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBncm91cGVkRmlsZSA9IF9yZWYxOTtcblxuICAgICAgICAgIGdyb3VwZWRGaWxlLnN0YXR1cyA9IERyb3B6b25lLkNBTkNFTEVEO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZmlsZS54aHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgZmlsZS54aHIuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyMSA9IGdyb3VwZWRGaWxlcywgX2lzQXJyYXkyMSA9IHRydWUsIF9pMjIgPSAwLCBfaXRlcmF0b3IyMSA9IF9pc0FycmF5MjEgPyBfaXRlcmF0b3IyMSA6IF9pdGVyYXRvcjIxW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYyMDtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTIxKSB7XG4gICAgICAgICAgICBpZiAoX2kyMiA+PSBfaXRlcmF0b3IyMS5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjIwID0gX2l0ZXJhdG9yMjFbX2kyMisrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kyMiA9IF9pdGVyYXRvcjIxLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTIyLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjIwID0gX2kyMi52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2dyb3VwZWRGaWxlID0gX3JlZjIwO1xuXG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRcIiwgX2dyb3VwZWRGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRtdWx0aXBsZVwiLCBncm91cGVkRmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5BRERFRCB8fCBmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuUVVFVUVEKSB7XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuQ0FOQ0VMRUQ7XG4gICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkXCIsIGZpbGUpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRtdWx0aXBsZVwiLCBbZmlsZV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzUXVldWUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVzb2x2ZU9wdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXNvbHZlT3B0aW9uKG9wdGlvbikge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgICAgIGFyZ3NbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXBsb2FkRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGxvYWRGaWxlKGZpbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnVwbG9hZEZpbGVzKFtmaWxlXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwbG9hZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZEZpbGVzKGZpbGVzKSB7XG4gICAgICB2YXIgX3RoaXMxNCA9IHRoaXM7XG5cbiAgICAgIHRoaXMuX3RyYW5zZm9ybUZpbGVzKGZpbGVzLCBmdW5jdGlvbiAodHJhbnNmb3JtZWRGaWxlcykge1xuICAgICAgICBpZiAoZmlsZXNbMF0udXBsb2FkLmNodW5rZWQpIHtcbiAgICAgICAgICAvLyBUaGlzIGZpbGUgc2hvdWxkIGJlIHNlbnQgaW4gY2h1bmtzIVxuXG4gICAgICAgICAgLy8gSWYgdGhlIGNodW5raW5nIG9wdGlvbiBpcyBzZXQsIHdlICoqa25vdyoqIHRoYXQgdGhlcmUgY2FuIG9ubHkgYmUgKipvbmUqKiBmaWxlLCBzaW5jZVxuICAgICAgICAgIC8vIHVwbG9hZE11bHRpcGxlIGlzIG5vdCBhbGxvd2VkIHdpdGggdGhpcyBvcHRpb24uXG4gICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1swXTtcbiAgICAgICAgICB2YXIgdHJhbnNmb3JtZWRGaWxlID0gdHJhbnNmb3JtZWRGaWxlc1swXTtcbiAgICAgICAgICB2YXIgc3RhcnRlZENodW5rQ291bnQgPSAwO1xuXG4gICAgICAgICAgZmlsZS51cGxvYWQuY2h1bmtzID0gW107XG5cbiAgICAgICAgICB2YXIgaGFuZGxlTmV4dENodW5rID0gZnVuY3Rpb24gaGFuZGxlTmV4dENodW5rKCkge1xuICAgICAgICAgICAgdmFyIGNodW5rSW5kZXggPSAwO1xuXG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBuZXh0IGl0ZW0gaW4gZmlsZS51cGxvYWQuY2h1bmtzIHRoYXQgaXMgbm90IGRlZmluZWQgeWV0LlxuICAgICAgICAgICAgd2hpbGUgKGZpbGUudXBsb2FkLmNodW5rc1tjaHVua0luZGV4XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGNodW5rSW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhpcyBtZWFucywgdGhhdCBhbGwgY2h1bmtzIGhhdmUgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuXG4gICAgICAgICAgICBpZiAoY2h1bmtJbmRleCA+PSBmaWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQpIHJldHVybjtcblxuICAgICAgICAgICAgc3RhcnRlZENodW5rQ291bnQrKztcblxuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gY2h1bmtJbmRleCAqIF90aGlzMTQub3B0aW9ucy5jaHVua1NpemU7XG4gICAgICAgICAgICB2YXIgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBfdGhpczE0Lm9wdGlvbnMuY2h1bmtTaXplLCBmaWxlLnNpemUpO1xuXG4gICAgICAgICAgICB2YXIgZGF0YUJsb2NrID0ge1xuICAgICAgICAgICAgICBuYW1lOiBfdGhpczE0Ll9nZXRQYXJhbU5hbWUoMCksXG4gICAgICAgICAgICAgIGRhdGE6IHRyYW5zZm9ybWVkRmlsZS53ZWJraXRTbGljZSA/IHRyYW5zZm9ybWVkRmlsZS53ZWJraXRTbGljZShzdGFydCwgZW5kKSA6IHRyYW5zZm9ybWVkRmlsZS5zbGljZShzdGFydCwgZW5kKSxcbiAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGUudXBsb2FkLmZpbGVuYW1lLFxuICAgICAgICAgICAgICBjaHVua0luZGV4OiBjaHVua0luZGV4XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmaWxlLnVwbG9hZC5jaHVua3NbY2h1bmtJbmRleF0gPSB7XG4gICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgIGluZGV4OiBjaHVua0luZGV4LFxuICAgICAgICAgICAgICBkYXRhQmxvY2s6IGRhdGFCbG9jaywgLy8gSW4gY2FzZSB3ZSB3YW50IHRvIHJldHJ5LlxuICAgICAgICAgICAgICBzdGF0dXM6IERyb3B6b25lLlVQTE9BRElORyxcbiAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgICAgICAgIHJldHJpZXM6IDAgLy8gVGhlIG51bWJlciBvZiB0aW1lcyB0aGlzIGJsb2NrIGhhcyBiZWVuIHJldHJpZWQuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfdGhpczE0Ll91cGxvYWREYXRhKGZpbGVzLCBbZGF0YUJsb2NrXSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZpbGUudXBsb2FkLmZpbmlzaGVkQ2h1bmtVcGxvYWQgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgICAgIHZhciBhbGxGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICBjaHVuay5zdGF0dXMgPSBEcm9wem9uZS5TVUNDRVNTO1xuXG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgZGF0YSBmcm9tIHRoZSBjaHVua1xuICAgICAgICAgICAgY2h1bmsuZGF0YUJsb2NrID0gbnVsbDtcbiAgICAgICAgICAgIC8vIExlYXZpbmcgdGhpcyByZWZlcmVuY2UgdG8geGhyIGludGFjdCBoZXJlIHdpbGwgY2F1c2UgbWVtb3J5IGxlYWtzIGluIHNvbWUgYnJvd3NlcnNcbiAgICAgICAgICAgIGNodW5rLnhociA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZS51cGxvYWQudG90YWxDaHVua0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKGZpbGUudXBsb2FkLmNodW5rc1tpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZU5leHRDaHVuaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmaWxlLnVwbG9hZC5jaHVua3NbaV0uc3RhdHVzICE9PSBEcm9wem9uZS5TVUNDRVNTKSB7XG4gICAgICAgICAgICAgICAgYWxsRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxsRmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgX3RoaXMxNC5vcHRpb25zLmNodW5rc1VwbG9hZGVkKGZpbGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczE0Ll9maW5pc2hlZChmaWxlcywgJycsIG51bGwpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKF90aGlzMTQub3B0aW9ucy5wYXJhbGxlbENodW5rVXBsb2Fkcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICBoYW5kbGVOZXh0Q2h1bmsoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlTmV4dENodW5rKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBkYXRhQmxvY2tzID0gW107XG4gICAgICAgICAgZm9yICh2YXIgX2kyMyA9IDA7IF9pMjMgPCBmaWxlcy5sZW5ndGg7IF9pMjMrKykge1xuICAgICAgICAgICAgZGF0YUJsb2Nrc1tfaTIzXSA9IHtcbiAgICAgICAgICAgICAgbmFtZTogX3RoaXMxNC5fZ2V0UGFyYW1OYW1lKF9pMjMpLFxuICAgICAgICAgICAgICBkYXRhOiB0cmFuc2Zvcm1lZEZpbGVzW19pMjNdLFxuICAgICAgICAgICAgICBmaWxlbmFtZTogZmlsZXNbX2kyM10udXBsb2FkLmZpbGVuYW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBfdGhpczE0Ll91cGxvYWREYXRhKGZpbGVzLCBkYXRhQmxvY2tzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8vIFJldHVybnMgdGhlIHJpZ2h0IGNodW5rIGZvciBnaXZlbiBmaWxlIGFuZCB4aHJcblxuICB9LCB7XG4gICAga2V5OiBcIl9nZXRDaHVua1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0Q2h1bmsoZmlsZSwgeGhyKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGUudXBsb2FkLnRvdGFsQ2h1bmtDb3VudDsgaSsrKSB7XG4gICAgICAgIGlmIChmaWxlLnVwbG9hZC5jaHVua3NbaV0gIT09IHVuZGVmaW5lZCAmJiBmaWxlLnVwbG9hZC5jaHVua3NbaV0ueGhyID09PSB4aHIpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS51cGxvYWQuY2h1bmtzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhY3R1YWxseSB1cGxvYWRzIHRoZSBmaWxlKHMpIHRvIHRoZSBzZXJ2ZXIuXG4gICAgLy8gSWYgZGF0YUJsb2NrcyBjb250YWlucyB0aGUgYWN0dWFsIGRhdGEgdG8gdXBsb2FkIChtZWFuaW5nLCB0aGF0IHRoaXMgY291bGQgZWl0aGVyIGJlIHRyYW5zZm9ybWVkXG4gICAgLy8gZmlsZXMsIG9yIGluZGl2aWR1YWwgY2h1bmtzIGZvciBjaHVua2VkIHVwbG9hZCkuXG5cbiAgfSwge1xuICAgIGtleTogXCJfdXBsb2FkRGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfdXBsb2FkRGF0YShmaWxlcywgZGF0YUJsb2Nrcykge1xuICAgICAgdmFyIF90aGlzMTUgPSB0aGlzO1xuXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIC8vIFB1dCB0aGUgeGhyIG9iamVjdCBpbiB0aGUgZmlsZSBvYmplY3RzIHRvIGJlIGFibGUgdG8gcmVmZXJlbmNlIGl0IGxhdGVyLlxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjIgPSBmaWxlcywgX2lzQXJyYXkyMiA9IHRydWUsIF9pMjQgPSAwLCBfaXRlcmF0b3IyMiA9IF9pc0FycmF5MjIgPyBfaXRlcmF0b3IyMiA6IF9pdGVyYXRvcjIyW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMjE7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MjIpIHtcbiAgICAgICAgICBpZiAoX2kyNCA+PSBfaXRlcmF0b3IyMi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYyMSA9IF9pdGVyYXRvcjIyW19pMjQrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kyNCA9IF9pdGVyYXRvcjIyLm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kyNC5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMjEgPSBfaTI0LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMjE7XG5cbiAgICAgICAgZmlsZS54aHIgPSB4aHI7XG4gICAgICB9XG4gICAgICBpZiAoZmlsZXNbMF0udXBsb2FkLmNodW5rZWQpIHtcbiAgICAgICAgLy8gUHV0IHRoZSB4aHIgb2JqZWN0IGluIHRoZSByaWdodCBjaHVuayBvYmplY3QsIHNvIGl0IGNhbiBiZSBhc3NvY2lhdGVkIGxhdGVyLCBhbmQgZm91bmQgd2l0aCBfZ2V0Q2h1bmtcbiAgICAgICAgZmlsZXNbMF0udXBsb2FkLmNodW5rc1tkYXRhQmxvY2tzWzBdLmNodW5rSW5kZXhdLnhociA9IHhocjtcbiAgICAgIH1cblxuICAgICAgdmFyIG1ldGhvZCA9IHRoaXMucmVzb2x2ZU9wdGlvbih0aGlzLm9wdGlvbnMubWV0aG9kLCBmaWxlcyk7XG4gICAgICB2YXIgdXJsID0gdGhpcy5yZXNvbHZlT3B0aW9uKHRoaXMub3B0aW9ucy51cmwsIGZpbGVzKTtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcblxuICAgICAgLy8gU2V0dGluZyB0aGUgdGltZW91dCBhZnRlciBvcGVuIGJlY2F1c2Ugb2YgSUUxMSBpc3N1ZTogaHR0cHM6Ly9naXRsYWIuY29tL21lbm8vZHJvcHpvbmUvaXNzdWVzLzhcbiAgICAgIHhoci50aW1lb3V0ID0gdGhpcy5yZXNvbHZlT3B0aW9uKHRoaXMub3B0aW9ucy50aW1lb3V0LCBmaWxlcyk7XG5cbiAgICAgIC8vIEhhcyB0byBiZSBhZnRlciBgLm9wZW4oKWAuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZW55by9kcm9wem9uZS9pc3N1ZXMvMTc5XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISF0aGlzLm9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgX3RoaXMxNS5fZmluaXNoZWRVcGxvYWRpbmcoZmlsZXMsIHhociwgZSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMxNS5faGFuZGxlVXBsb2FkRXJyb3IoZmlsZXMsIHhocik7XG4gICAgICB9O1xuXG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGRvIG5vdCBoYXZlIHRoZSAudXBsb2FkIHByb3BlcnR5XG4gICAgICB2YXIgcHJvZ3Jlc3NPYmogPSB4aHIudXBsb2FkICE9IG51bGwgPyB4aHIudXBsb2FkIDogeGhyO1xuICAgICAgcHJvZ3Jlc3NPYmoub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBfdGhpczE1Ll91cGRhdGVGaWxlc1VwbG9hZFByb2dyZXNzKGZpbGVzLCB4aHIsIGUpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGhlYWRlcnMgPSB7XG4gICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJuby1jYWNoZVwiLFxuICAgICAgICBcIlgtUmVxdWVzdGVkLVdpdGhcIjogXCJYTUxIdHRwUmVxdWVzdFwiXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgRHJvcHpvbmUuZXh0ZW5kKGhlYWRlcnMsIHRoaXMub3B0aW9ucy5oZWFkZXJzKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaGVhZGVyTmFtZSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHZhciBoZWFkZXJWYWx1ZSA9IGhlYWRlcnNbaGVhZGVyTmFtZV07XG4gICAgICAgIGlmIChoZWFkZXJWYWx1ZSkge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlck5hbWUsIGhlYWRlclZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgICAgLy8gQWRkaW5nIGFsbCBAb3B0aW9ucyBwYXJhbWV0ZXJzXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhcmFtcykge1xuICAgICAgICB2YXIgYWRkaXRpb25hbFBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXM7XG4gICAgICAgIGlmICh0eXBlb2YgYWRkaXRpb25hbFBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGFkZGl0aW9uYWxQYXJhbXMgPSBhZGRpdGlvbmFsUGFyYW1zLmNhbGwodGhpcywgZmlsZXMsIHhociwgZmlsZXNbMF0udXBsb2FkLmNodW5rZWQgPyB0aGlzLl9nZXRDaHVuayhmaWxlc1swXSwgeGhyKSA6IG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGFkZGl0aW9uYWxQYXJhbXMpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBhZGRpdGlvbmFsUGFyYW1zW2tleV07XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIExldCB0aGUgdXNlciBhZGQgYWRkaXRpb25hbCBkYXRhIGlmIG5lY2Vzc2FyeVxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjMgPSBmaWxlcywgX2lzQXJyYXkyMyA9IHRydWUsIF9pMjUgPSAwLCBfaXRlcmF0b3IyMyA9IF9pc0FycmF5MjMgPyBfaXRlcmF0b3IyMyA6IF9pdGVyYXRvcjIzW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMjI7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MjMpIHtcbiAgICAgICAgICBpZiAoX2kyNSA+PSBfaXRlcmF0b3IyMy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYyMiA9IF9pdGVyYXRvcjIzW19pMjUrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kyNSA9IF9pdGVyYXRvcjIzLm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kyNS5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMjIgPSBfaTI1LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9maWxlID0gX3JlZjIyO1xuXG4gICAgICAgIHRoaXMuZW1pdChcInNlbmRpbmdcIiwgX2ZpbGUsIHhociwgZm9ybURhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJzZW5kaW5nbXVsdGlwbGVcIiwgZmlsZXMsIHhociwgZm9ybURhdGEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hZGRGb3JtRWxlbWVudERhdGEoZm9ybURhdGEpO1xuXG4gICAgICAvLyBGaW5hbGx5IGFkZCB0aGUgZmlsZXNcbiAgICAgIC8vIEhhcyB0byBiZSBsYXN0IGJlY2F1c2Ugc29tZSBzZXJ2ZXJzIChlZzogUzMpIGV4cGVjdCB0aGUgZmlsZSB0byBiZSB0aGUgbGFzdCBwYXJhbWV0ZXJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGF0YUJsb2NrID0gZGF0YUJsb2Nrc1tpXTtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGRhdGFCbG9jay5uYW1lLCBkYXRhQmxvY2suZGF0YSwgZGF0YUJsb2NrLmZpbGVuYW1lKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJtaXRSZXF1ZXN0KHhociwgZm9ybURhdGEsIGZpbGVzKTtcbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm1zIGFsbCBmaWxlcyB3aXRoIHRoaXMub3B0aW9ucy50cmFuc2Zvcm1GaWxlIGFuZCBpbnZva2VzIGRvbmUgd2l0aCB0aGUgdHJhbnNmb3JtZWQgZmlsZXMgd2hlbiBkb25lLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3RyYW5zZm9ybUZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF90cmFuc2Zvcm1GaWxlcyhmaWxlcywgZG9uZSkge1xuICAgICAgdmFyIF90aGlzMTYgPSB0aGlzO1xuXG4gICAgICB2YXIgdHJhbnNmb3JtZWRGaWxlcyA9IFtdO1xuICAgICAgLy8gQ2x1bXN5IHdheSBvZiBoYW5kbGluZyBhc3luY2hyb25vdXMgY2FsbHMsIHVudGlsIEkgZ2V0IHRvIGFkZCBhIHByb3BlciBGdXR1cmUgbGlicmFyeS5cbiAgICAgIHZhciBkb25lQ291bnRlciA9IDA7XG5cbiAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKGkpIHtcbiAgICAgICAgX3RoaXMxNi5vcHRpb25zLnRyYW5zZm9ybUZpbGUuY2FsbChfdGhpczE2LCBmaWxlc1tpXSwgZnVuY3Rpb24gKHRyYW5zZm9ybWVkRmlsZSkge1xuICAgICAgICAgIHRyYW5zZm9ybWVkRmlsZXNbaV0gPSB0cmFuc2Zvcm1lZEZpbGU7XG4gICAgICAgICAgaWYgKCsrZG9uZUNvdW50ZXIgPT09IGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZG9uZSh0cmFuc2Zvcm1lZEZpbGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBfbG9vcChpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUYWtlcyBjYXJlIG9mIGFkZGluZyBvdGhlciBpbnB1dCBlbGVtZW50cyBvZiB0aGUgZm9ybSB0byB0aGUgQUpBWCByZXF1ZXN0XG5cbiAgfSwge1xuICAgIGtleTogXCJfYWRkRm9ybUVsZW1lbnREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRGb3JtRWxlbWVudERhdGEoZm9ybURhdGEpIHtcbiAgICAgIC8vIFRha2UgY2FyZSBvZiBvdGhlciBpbnB1dCBlbGVtZW50c1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09PSBcIkZPUk1cIikge1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyNCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIGJ1dHRvblwiKSwgX2lzQXJyYXkyNCA9IHRydWUsIF9pMjYgPSAwLCBfaXRlcmF0b3IyNCA9IF9pc0FycmF5MjQgPyBfaXRlcmF0b3IyNCA6IF9pdGVyYXRvcjI0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYyMztcblxuICAgICAgICAgIGlmIChfaXNBcnJheTI0KSB7XG4gICAgICAgICAgICBpZiAoX2kyNiA+PSBfaXRlcmF0b3IyNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjIzID0gX2l0ZXJhdG9yMjRbX2kyNisrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kyNiA9IF9pdGVyYXRvcjI0Lm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTI2LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjIzID0gX2kyNi52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaW5wdXQgPSBfcmVmMjM7XG5cbiAgICAgICAgICB2YXIgaW5wdXROYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAgICAgICB2YXIgaW5wdXRUeXBlID0gaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKTtcbiAgICAgICAgICBpZiAoaW5wdXRUeXBlKSBpbnB1dFR5cGUgPSBpbnB1dFR5cGUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgIC8vIElmIHRoZSBpbnB1dCBkb2Vzbid0IGhhdmUgYSBuYW1lLCB3ZSBjYW4ndCB1c2UgaXQuXG4gICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dE5hbWUgPT09ICd1bmRlZmluZWQnIHx8IGlucHV0TmFtZSA9PT0gbnVsbCkgY29udGludWU7XG5cbiAgICAgICAgICBpZiAoaW5wdXQudGFnTmFtZSA9PT0gXCJTRUxFQ1RcIiAmJiBpbnB1dC5oYXNBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSkge1xuICAgICAgICAgICAgLy8gUG9zc2libHkgbXVsdGlwbGUgdmFsdWVzXG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyNSA9IGlucHV0Lm9wdGlvbnMsIF9pc0FycmF5MjUgPSB0cnVlLCBfaTI3ID0gMCwgX2l0ZXJhdG9yMjUgPSBfaXNBcnJheTI1ID8gX2l0ZXJhdG9yMjUgOiBfaXRlcmF0b3IyNVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICB2YXIgX3JlZjI0O1xuXG4gICAgICAgICAgICAgIGlmIChfaXNBcnJheTI1KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pMjcgPj0gX2l0ZXJhdG9yMjUubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmMjQgPSBfaXRlcmF0b3IyNVtfaTI3KytdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9pMjcgPSBfaXRlcmF0b3IyNS5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pMjcuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjI0ID0gX2kyNy52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBvcHRpb24gPSBfcmVmMjQ7XG5cbiAgICAgICAgICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChpbnB1dE5hbWUsIG9wdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKCFpbnB1dFR5cGUgfHwgaW5wdXRUeXBlICE9PSBcImNoZWNrYm94XCIgJiYgaW5wdXRUeXBlICE9PSBcInJhZGlvXCIgfHwgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGlucHV0TmFtZSwgaW5wdXQudmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEludm9rZWQgd2hlbiB0aGVyZSBpcyBuZXcgcHJvZ3Jlc3MgaW5mb3JtYXRpb24gYWJvdXQgZ2l2ZW4gZmlsZXMuXG4gICAgLy8gSWYgZSBpcyBub3QgcHJvdmlkZWQsIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgdXBsb2FkIGlzIGZpbmlzaGVkLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3VwZGF0ZUZpbGVzVXBsb2FkUHJvZ3Jlc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3VwZGF0ZUZpbGVzVXBsb2FkUHJvZ3Jlc3MoZmlsZXMsIHhociwgZSkge1xuICAgICAgdmFyIHByb2dyZXNzID0gdm9pZCAwO1xuICAgICAgaWYgKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwcm9ncmVzcyA9IDEwMCAqIGUubG9hZGVkIC8gZS50b3RhbDtcblxuICAgICAgICBpZiAoZmlsZXNbMF0udXBsb2FkLmNodW5rZWQpIHtcbiAgICAgICAgICB2YXIgZmlsZSA9IGZpbGVzWzBdO1xuICAgICAgICAgIC8vIFNpbmNlIHRoaXMgaXMgYSBjaHVua2VkIHVwbG9hZCwgd2UgbmVlZCB0byB1cGRhdGUgdGhlIGFwcHJvcHJpYXRlIGNodW5rIHByb2dyZXNzLlxuICAgICAgICAgIHZhciBjaHVuayA9IHRoaXMuX2dldENodW5rKGZpbGUsIHhocik7XG4gICAgICAgICAgY2h1bmsucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgICBjaHVuay50b3RhbCA9IGUudG90YWw7XG4gICAgICAgICAgY2h1bmsuYnl0ZXNTZW50ID0gZS5sb2FkZWQ7XG4gICAgICAgICAgdmFyIGZpbGVQcm9ncmVzcyA9IDAsXG4gICAgICAgICAgICAgIGZpbGVUb3RhbCA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgZmlsZUJ5dGVzU2VudCA9IHZvaWQgMDtcbiAgICAgICAgICBmaWxlLnVwbG9hZC5wcm9ncmVzcyA9IDA7XG4gICAgICAgICAgZmlsZS51cGxvYWQudG90YWwgPSAwO1xuICAgICAgICAgIGZpbGUudXBsb2FkLmJ5dGVzU2VudCA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbGUudXBsb2FkLmNodW5rc1tpXSAhPT0gdW5kZWZpbmVkICYmIGZpbGUudXBsb2FkLmNodW5rc1tpXS5wcm9ncmVzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGZpbGUudXBsb2FkLnByb2dyZXNzICs9IGZpbGUudXBsb2FkLmNodW5rc1tpXS5wcm9ncmVzcztcbiAgICAgICAgICAgICAgZmlsZS51cGxvYWQudG90YWwgKz0gZmlsZS51cGxvYWQuY2h1bmtzW2ldLnRvdGFsO1xuICAgICAgICAgICAgICBmaWxlLnVwbG9hZC5ieXRlc1NlbnQgKz0gZmlsZS51cGxvYWQuY2h1bmtzW2ldLmJ5dGVzU2VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZmlsZS51cGxvYWQucHJvZ3Jlc3MgPSBmaWxlLnVwbG9hZC5wcm9ncmVzcyAvIGZpbGUudXBsb2FkLnRvdGFsQ2h1bmtDb3VudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyNiA9IGZpbGVzLCBfaXNBcnJheTI2ID0gdHJ1ZSwgX2kyOCA9IDAsIF9pdGVyYXRvcjI2ID0gX2lzQXJyYXkyNiA/IF9pdGVyYXRvcjI2IDogX2l0ZXJhdG9yMjZbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgIHZhciBfcmVmMjU7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheTI2KSB7XG4gICAgICAgICAgICAgIGlmIChfaTI4ID49IF9pdGVyYXRvcjI2Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWYyNSA9IF9pdGVyYXRvcjI2W19pMjgrK107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfaTI4ID0gX2l0ZXJhdG9yMjYubmV4dCgpO1xuICAgICAgICAgICAgICBpZiAoX2kyOC5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjI1ID0gX2kyOC52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9maWxlMiA9IF9yZWYyNTtcblxuICAgICAgICAgICAgX2ZpbGUyLnVwbG9hZC5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICAgICAgX2ZpbGUyLnVwbG9hZC50b3RhbCA9IGUudG90YWw7XG4gICAgICAgICAgICBfZmlsZTIudXBsb2FkLmJ5dGVzU2VudCA9IGUubG9hZGVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyNyA9IGZpbGVzLCBfaXNBcnJheTI3ID0gdHJ1ZSwgX2kyOSA9IDAsIF9pdGVyYXRvcjI3ID0gX2lzQXJyYXkyNyA/IF9pdGVyYXRvcjI3IDogX2l0ZXJhdG9yMjdbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjI2O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MjcpIHtcbiAgICAgICAgICAgIGlmIChfaTI5ID49IF9pdGVyYXRvcjI3Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjYgPSBfaXRlcmF0b3IyN1tfaTI5KytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTI5ID0gX2l0ZXJhdG9yMjcubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMjkuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjYgPSBfaTI5LnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfZmlsZTMgPSBfcmVmMjY7XG5cbiAgICAgICAgICB0aGlzLmVtaXQoXCJ1cGxvYWRwcm9ncmVzc1wiLCBfZmlsZTMsIF9maWxlMy51cGxvYWQucHJvZ3Jlc3MsIF9maWxlMy51cGxvYWQuYnl0ZXNTZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gdGhlIGZpbGUgZmluaXNoZWQgdXBsb2FkaW5nXG5cbiAgICAgICAgdmFyIGFsbEZpbGVzRmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgIHByb2dyZXNzID0gMTAwO1xuXG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjI4ID0gZmlsZXMsIF9pc0FycmF5MjggPSB0cnVlLCBfaTMwID0gMCwgX2l0ZXJhdG9yMjggPSBfaXNBcnJheTI4ID8gX2l0ZXJhdG9yMjggOiBfaXRlcmF0b3IyOFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgIHZhciBfcmVmMjc7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkyOCkge1xuICAgICAgICAgICAgaWYgKF9pMzAgPj0gX2l0ZXJhdG9yMjgubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYyNyA9IF9pdGVyYXRvcjI4W19pMzArK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pMzAgPSBfaXRlcmF0b3IyOC5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoX2kzMC5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYyNyA9IF9pMzAudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9maWxlNCA9IF9yZWYyNztcblxuICAgICAgICAgIGlmIChfZmlsZTQudXBsb2FkLnByb2dyZXNzICE9PSAxMDAgfHwgX2ZpbGU0LnVwbG9hZC5ieXRlc1NlbnQgIT09IF9maWxlNC51cGxvYWQudG90YWwpIHtcbiAgICAgICAgICAgIGFsbEZpbGVzRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX2ZpbGU0LnVwbG9hZC5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICAgIF9maWxlNC51cGxvYWQuYnl0ZXNTZW50ID0gX2ZpbGU0LnVwbG9hZC50b3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGhpbmcgdG8gZG8sIGFsbCBmaWxlcyBhbHJlYWR5IGF0IDEwMCVcbiAgICAgICAgaWYgKGFsbEZpbGVzRmluaXNoZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyOSA9IGZpbGVzLCBfaXNBcnJheTI5ID0gdHJ1ZSwgX2kzMSA9IDAsIF9pdGVyYXRvcjI5ID0gX2lzQXJyYXkyOSA/IF9pdGVyYXRvcjI5IDogX2l0ZXJhdG9yMjlbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjI4O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MjkpIHtcbiAgICAgICAgICAgIGlmIChfaTMxID49IF9pdGVyYXRvcjI5Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjggPSBfaXRlcmF0b3IyOVtfaTMxKytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTMxID0gX2l0ZXJhdG9yMjkubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMzEuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjggPSBfaTMxLnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfZmlsZTUgPSBfcmVmMjg7XG5cbiAgICAgICAgICB0aGlzLmVtaXQoXCJ1cGxvYWRwcm9ncmVzc1wiLCBfZmlsZTUsIHByb2dyZXNzLCBfZmlsZTUudXBsb2FkLmJ5dGVzU2VudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZpbmlzaGVkVXBsb2FkaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9maW5pc2hlZFVwbG9hZGluZyhmaWxlcywgeGhyLCBlKSB7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB2b2lkIDA7XG5cbiAgICAgIGlmIChmaWxlc1swXS5zdGF0dXMgPT09IERyb3B6b25lLkNBTkNFTEVEKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHhoci5yZXNwb25zZVR5cGUgIT09ICdhcnJheWJ1ZmZlcicgJiYgeGhyLnJlc3BvbnNlVHlwZSAhPT0gJ2Jsb2InKSB7XG4gICAgICAgIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICBpZiAoeGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiY29udGVudC10eXBlXCIpICYmIH54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJjb250ZW50LXR5cGVcIikuaW5kZXhPZihcImFwcGxpY2F0aW9uL2pzb25cIikpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBcIkludmFsaWQgSlNPTiByZXNwb25zZSBmcm9tIHNlcnZlci5cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fdXBkYXRlRmlsZXNVcGxvYWRQcm9ncmVzcyhmaWxlcyk7XG5cbiAgICAgIGlmICghKDIwMCA8PSB4aHIuc3RhdHVzICYmIHhoci5zdGF0dXMgPCAzMDApKSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZVVwbG9hZEVycm9yKGZpbGVzLCB4aHIsIHJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmaWxlc1swXS51cGxvYWQuY2h1bmtlZCkge1xuICAgICAgICAgIGZpbGVzWzBdLnVwbG9hZC5maW5pc2hlZENodW5rVXBsb2FkKHRoaXMuX2dldENodW5rKGZpbGVzWzBdLCB4aHIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9maW5pc2hlZChmaWxlcywgcmVzcG9uc2UsIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9oYW5kbGVVcGxvYWRFcnJvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlVXBsb2FkRXJyb3IoZmlsZXMsIHhociwgcmVzcG9uc2UpIHtcbiAgICAgIGlmIChmaWxlc1swXS5zdGF0dXMgPT09IERyb3B6b25lLkNBTkNFTEVEKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVzWzBdLnVwbG9hZC5jaHVua2VkICYmIHRoaXMub3B0aW9ucy5yZXRyeUNodW5rcykge1xuICAgICAgICB2YXIgY2h1bmsgPSB0aGlzLl9nZXRDaHVuayhmaWxlc1swXSwgeGhyKTtcbiAgICAgICAgaWYgKGNodW5rLnJldHJpZXMrKyA8IHRoaXMub3B0aW9ucy5yZXRyeUNodW5rc0xpbWl0KSB7XG4gICAgICAgICAgdGhpcy5fdXBsb2FkRGF0YShmaWxlcywgW2NodW5rLmRhdGFCbG9ja10pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1JldHJpZWQgdGhpcyBjaHVuayB0b28gb2Z0ZW4uIEdpdmluZyB1cC4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IzMCA9IGZpbGVzLCBfaXNBcnJheTMwID0gdHJ1ZSwgX2kzMiA9IDAsIF9pdGVyYXRvcjMwID0gX2lzQXJyYXkzMCA/IF9pdGVyYXRvcjMwIDogX2l0ZXJhdG9yMzBbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYyOTtcblxuICAgICAgICBpZiAoX2lzQXJyYXkzMCkge1xuICAgICAgICAgIGlmIChfaTMyID49IF9pdGVyYXRvcjMwLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjI5ID0gX2l0ZXJhdG9yMzBbX2kzMisrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTMyID0gX2l0ZXJhdG9yMzAubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTMyLmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYyOSA9IF9pMzIudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZSA9IF9yZWYyOTtcblxuICAgICAgICB0aGlzLl9lcnJvclByb2Nlc3NpbmcoZmlsZXMsIHJlc3BvbnNlIHx8IHRoaXMub3B0aW9ucy5kaWN0UmVzcG9uc2VFcnJvci5yZXBsYWNlKFwie3tzdGF0dXNDb2RlfX1cIiwgeGhyLnN0YXR1cyksIHhocik7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN1Ym1pdFJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3VibWl0UmVxdWVzdCh4aHIsIGZvcm1EYXRhLCBmaWxlcykge1xuICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICAgIH1cblxuICAgIC8vIENhbGxlZCBpbnRlcm5hbGx5IHdoZW4gcHJvY2Vzc2luZyBpcyBmaW5pc2hlZC5cbiAgICAvLyBJbmRpdmlkdWFsIGNhbGxiYWNrcyBoYXZlIHRvIGJlIGNhbGxlZCBpbiB0aGUgYXBwcm9wcmlhdGUgc2VjdGlvbnMuXG5cbiAgfSwge1xuICAgIGtleTogXCJfZmluaXNoZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2ZpbmlzaGVkKGZpbGVzLCByZXNwb25zZVRleHQsIGUpIHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjMxID0gZmlsZXMsIF9pc0FycmF5MzEgPSB0cnVlLCBfaTMzID0gMCwgX2l0ZXJhdG9yMzEgPSBfaXNBcnJheTMxID8gX2l0ZXJhdG9yMzEgOiBfaXRlcmF0b3IzMVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjMwO1xuXG4gICAgICAgIGlmIChfaXNBcnJheTMxKSB7XG4gICAgICAgICAgaWYgKF9pMzMgPj0gX2l0ZXJhdG9yMzEubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICBfcmVmMzAgPSBfaXRlcmF0b3IzMVtfaTMzKytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMzMgPSBfaXRlcmF0b3IzMS5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMzMuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgX3JlZjMwID0gX2kzMy52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlID0gX3JlZjMwO1xuXG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuU1VDQ0VTUztcbiAgICAgICAgdGhpcy5lbWl0KFwic3VjY2Vzc1wiLCBmaWxlLCByZXNwb25zZVRleHQsIGUpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwic3VjY2Vzc211bHRpcGxlXCIsIGZpbGVzLCByZXNwb25zZVRleHQsIGUpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZW11bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENhbGxlZCBpbnRlcm5hbGx5IHdoZW4gcHJvY2Vzc2luZyBpcyBmaW5pc2hlZC5cbiAgICAvLyBJbmRpdmlkdWFsIGNhbGxiYWNrcyBoYXZlIHRvIGJlIGNhbGxlZCBpbiB0aGUgYXBwcm9wcmlhdGUgc2VjdGlvbnMuXG5cbiAgfSwge1xuICAgIGtleTogXCJfZXJyb3JQcm9jZXNzaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lcnJvclByb2Nlc3NpbmcoZmlsZXMsIG1lc3NhZ2UsIHhocikge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMzIgPSBmaWxlcywgX2lzQXJyYXkzMiA9IHRydWUsIF9pMzQgPSAwLCBfaXRlcmF0b3IzMiA9IF9pc0FycmF5MzIgPyBfaXRlcmF0b3IzMiA6IF9pdGVyYXRvcjMyW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMzE7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MzIpIHtcbiAgICAgICAgICBpZiAoX2kzNCA+PSBfaXRlcmF0b3IzMi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYzMSA9IF9pdGVyYXRvcjMyW19pMzQrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kzNCA9IF9pdGVyYXRvcjMyLm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kzNC5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMzEgPSBfaTM0LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMzE7XG5cbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5FUlJPUjtcbiAgICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZmlsZSwgbWVzc2FnZSwgeGhyKTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuZW1pdChcImVycm9ybXVsdGlwbGVcIiwgZmlsZXMsIG1lc3NhZ2UsIHhocik7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlbXVsdGlwbGVcIiwgZmlsZXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Qcm9jZXNzUXVldWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwidXVpZHY0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHV1aWR2NCgpIHtcbiAgICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCxcbiAgICAgICAgICAgIHYgPSBjID09PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcbiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERyb3B6b25lO1xufShFbWl0dGVyKTtcblxuRHJvcHpvbmUuaW5pdENsYXNzKCk7XG5cbkRyb3B6b25lLnZlcnNpb24gPSBcIjUuNS4xXCI7XG5cbi8vIFRoaXMgaXMgYSBtYXAgb2Ygb3B0aW9ucyBmb3IgeW91ciBkaWZmZXJlbnQgZHJvcHpvbmVzLiBBZGQgY29uZmlndXJhdGlvbnNcbi8vIHRvIHRoaXMgb2JqZWN0IGZvciB5b3VyIGRpZmZlcmVudCBkcm9wem9uZSBlbGVtZW5zLlxuLy9cbi8vIEV4YW1wbGU6XG4vL1xuLy8gICAgIERyb3B6b25lLm9wdGlvbnMubXlEcm9wem9uZUVsZW1lbnRJZCA9IHsgbWF4RmlsZXNpemU6IDEgfTtcbi8vXG4vLyBUbyBkaXNhYmxlIGF1dG9EaXNjb3ZlciBmb3IgYSBzcGVjaWZpYyBlbGVtZW50LCB5b3UgY2FuIHNldCBgZmFsc2VgIGFzIGFuIG9wdGlvbjpcbi8vXG4vLyAgICAgRHJvcHpvbmUub3B0aW9ucy5teURpc2FibGVkRWxlbWVudElkID0gZmFsc2U7XG4vL1xuLy8gQW5kIGluIGh0bWw6XG4vL1xuLy8gICAgIDxmb3JtIGFjdGlvbj1cIi91cGxvYWRcIiBpZD1cIm15LWRyb3B6b25lLWVsZW1lbnQtaWRcIiBjbGFzcz1cImRyb3B6b25lXCI+PC9mb3JtPlxuRHJvcHpvbmUub3B0aW9ucyA9IHt9O1xuXG4vLyBSZXR1cm5zIHRoZSBvcHRpb25zIGZvciBhbiBlbGVtZW50IG9yIHVuZGVmaW5lZCBpZiBub25lIGF2YWlsYWJsZS5cbkRyb3B6b25lLm9wdGlvbnNGb3JFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgLy8gR2V0IHRoZSBgRHJvcHpvbmUub3B0aW9ucy5lbGVtZW50SWRgIGZvciB0aGlzIGVsZW1lbnQgaWYgaXQgZXhpc3RzXG4gIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImlkXCIpKSB7XG4gICAgcmV0dXJuIERyb3B6b25lLm9wdGlvbnNbY2FtZWxpemUoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cbi8vIEhvbGRzIGEgbGlzdCBvZiBhbGwgZHJvcHpvbmUgaW5zdGFuY2VzXG5Ecm9wem9uZS5pbnN0YW5jZXMgPSBbXTtcblxuLy8gUmV0dXJucyB0aGUgZHJvcHpvbmUgZm9yIGdpdmVuIGVsZW1lbnQgaWYgYW55XG5Ecm9wem9uZS5mb3JFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudCk7XG4gIH1cbiAgaWYgKChlbGVtZW50ICE9IG51bGwgPyBlbGVtZW50LmRyb3B6b25lIDogdW5kZWZpbmVkKSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gRHJvcHpvbmUgZm91bmQgZm9yIGdpdmVuIGVsZW1lbnQuIFRoaXMgaXMgcHJvYmFibHkgYmVjYXVzZSB5b3UncmUgdHJ5aW5nIHRvIGFjY2VzcyBpdCBiZWZvcmUgRHJvcHpvbmUgaGFkIHRoZSB0aW1lIHRvIGluaXRpYWxpemUuIFVzZSB0aGUgYGluaXRgIG9wdGlvbiB0byBzZXR1cCBhbnkgYWRkaXRpb25hbCBvYnNlcnZlcnMgb24geW91ciBEcm9wem9uZS5cIik7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQuZHJvcHpvbmU7XG59O1xuXG4vLyBTZXQgdG8gZmFsc2UgaWYgeW91IGRvbid0IHdhbnQgRHJvcHpvbmUgdG8gYXV0b21hdGljYWxseSBmaW5kIGFuZCBhdHRhY2ggdG8gLmRyb3B6b25lIGVsZW1lbnRzLlxuRHJvcHpvbmUuYXV0b0Rpc2NvdmVyID0gdHJ1ZTtcblxuLy8gTG9va3MgZm9yIGFsbCAuZHJvcHpvbmUgZWxlbWVudHMgYW5kIGNyZWF0ZXMgYSBkcm9wem9uZSBmb3IgdGhlbVxuRHJvcHpvbmUuZGlzY292ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkcm9wem9uZXMgPSB2b2lkIDA7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgZHJvcHpvbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcm9wem9uZVwiKTtcbiAgfSBlbHNlIHtcbiAgICBkcm9wem9uZXMgPSBbXTtcbiAgICAvLyBJRSA6KFxuICAgIHZhciBjaGVja0VsZW1lbnRzID0gZnVuY3Rpb24gY2hlY2tFbGVtZW50cyhlbGVtZW50cykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IzMyA9IGVsZW1lbnRzLCBfaXNBcnJheTMzID0gdHJ1ZSwgX2kzNSA9IDAsIF9pdGVyYXRvcjMzID0gX2lzQXJyYXkzMyA/IF9pdGVyYXRvcjMzIDogX2l0ZXJhdG9yMzNbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjMyO1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MzMpIHtcbiAgICAgICAgICAgIGlmIChfaTM1ID49IF9pdGVyYXRvcjMzLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMzIgPSBfaXRlcmF0b3IzM1tfaTM1KytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTM1ID0gX2l0ZXJhdG9yMzMubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMzUuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMzIgPSBfaTM1LnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBlbCA9IF9yZWYzMjtcblxuICAgICAgICAgIGlmICgvKF58IClkcm9wem9uZSgkfCApLy50ZXN0KGVsLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRyb3B6b25lcy5wdXNoKGVsKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KCk7XG4gICAgfTtcbiAgICBjaGVja0VsZW1lbnRzKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpKTtcbiAgICBjaGVja0VsZW1lbnRzKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZm9ybVwiKSk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBfaXRlcmF0b3IzNCA9IGRyb3B6b25lcywgX2lzQXJyYXkzNCA9IHRydWUsIF9pMzYgPSAwLCBfaXRlcmF0b3IzNCA9IF9pc0FycmF5MzQgPyBfaXRlcmF0b3IzNCA6IF9pdGVyYXRvcjM0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICB2YXIgX3JlZjMzO1xuXG4gICAgICBpZiAoX2lzQXJyYXkzNCkge1xuICAgICAgICBpZiAoX2kzNiA+PSBfaXRlcmF0b3IzNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmMzMgPSBfaXRlcmF0b3IzNFtfaTM2KytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2kzNiA9IF9pdGVyYXRvcjM0Lm5leHQoKTtcbiAgICAgICAgaWYgKF9pMzYuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWYzMyA9IF9pMzYudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBkcm9wem9uZSA9IF9yZWYzMztcblxuICAgICAgLy8gQ3JlYXRlIGEgZHJvcHpvbmUgdW5sZXNzIGF1dG8gZGlzY292ZXIgaGFzIGJlZW4gZGlzYWJsZWQgZm9yIHNwZWNpZmljIGVsZW1lbnRcbiAgICAgIGlmIChEcm9wem9uZS5vcHRpb25zRm9yRWxlbWVudChkcm9wem9uZSkgIT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKG5ldyBEcm9wem9uZShkcm9wem9uZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2godW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSgpO1xufTtcblxuLy8gU2luY2UgdGhlIHdob2xlIERyYWcnbidEcm9wIEFQSSBpcyBwcmV0dHkgbmV3LCBzb21lIGJyb3dzZXJzIGltcGxlbWVudCBpdCxcbi8vIGJ1dCBub3QgY29ycmVjdGx5LlxuLy8gU28gSSBjcmVhdGVkIGEgYmxhY2tsaXN0IG9mIHVzZXJBZ2VudHMuIFllcywgeWVzLiBCcm93c2VyIHNuaWZmaW5nLCBJIGtub3cuXG4vLyBCdXQgd2hhdCB0byBkbyB3aGVuIGJyb3dzZXJzICp0aGVvcmV0aWNhbGx5KiBzdXBwb3J0IGFuIEFQSSwgYnV0IGNyYXNoXG4vLyB3aGVuIHVzaW5nIGl0LlxuLy9cbi8vIFRoaXMgaXMgYSBsaXN0IG9mIHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGVzdGVkIGFnYWluc3QgbmF2aWdhdG9yLnVzZXJBZ2VudFxuLy9cbi8vICoqIEl0IHNob3VsZCBvbmx5IGJlIHVzZWQgb24gYnJvd3NlciB0aGF0ICpkbyogc3VwcG9ydCB0aGUgQVBJLCBidXRcbi8vIGluY29ycmVjdGx5ICoqXG4vL1xuRHJvcHpvbmUuYmxhY2tsaXN0ZWRCcm93c2VycyA9IFtcbi8vIFRoZSBtYWMgb3MgYW5kIHdpbmRvd3MgcGhvbmUgdmVyc2lvbiBvZiBvcGVyYSAxMiBzZWVtcyB0byBoYXZlIGEgcHJvYmxlbSB3aXRoIHRoZSBGaWxlIGRyYWcnbidkcm9wIEFQSS5cbi9vcGVyYS4qKE1hY2ludG9zaHxXaW5kb3dzIFBob25lKS4qdmVyc2lvblxcLzEyL2ldO1xuXG4vLyBDaGVja3MgaWYgdGhlIGJyb3dzZXIgaXMgc3VwcG9ydGVkXG5Ecm9wem9uZS5pc0Jyb3dzZXJTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjYXBhYmxlQnJvd3NlciA9IHRydWU7XG5cbiAgaWYgKHdpbmRvdy5GaWxlICYmIHdpbmRvdy5GaWxlUmVhZGVyICYmIHdpbmRvdy5GaWxlTGlzdCAmJiB3aW5kb3cuQmxvYiAmJiB3aW5kb3cuRm9ybURhdGEgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcikge1xuICAgIGlmICghKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIikpKSB7XG4gICAgICBjYXBhYmxlQnJvd3NlciA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgQVBJLCBidXQgbWF5IGJlIGJsYWNrbGlzdGVkLlxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMzUgPSBEcm9wem9uZS5ibGFja2xpc3RlZEJyb3dzZXJzLCBfaXNBcnJheTM1ID0gdHJ1ZSwgX2kzNyA9IDAsIF9pdGVyYXRvcjM1ID0gX2lzQXJyYXkzNSA/IF9pdGVyYXRvcjM1IDogX2l0ZXJhdG9yMzVbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYzNDtcblxuICAgICAgICBpZiAoX2lzQXJyYXkzNSkge1xuICAgICAgICAgIGlmIChfaTM3ID49IF9pdGVyYXRvcjM1Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjM0ID0gX2l0ZXJhdG9yMzVbX2kzNysrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTM3ID0gX2l0ZXJhdG9yMzUubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTM3LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYzNCA9IF9pMzcudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVnZXggPSBfcmVmMzQ7XG5cbiAgICAgICAgaWYgKHJlZ2V4LnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgICBjYXBhYmxlQnJvd3NlciA9IGZhbHNlO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNhcGFibGVCcm93c2VyID0gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gY2FwYWJsZUJyb3dzZXI7XG59O1xuXG5Ecm9wem9uZS5kYXRhVVJJdG9CbG9iID0gZnVuY3Rpb24gKGRhdGFVUkkpIHtcbiAgLy8gY29udmVydCBiYXNlNjQgdG8gcmF3IGJpbmFyeSBkYXRhIGhlbGQgaW4gYSBzdHJpbmdcbiAgLy8gZG9lc24ndCBoYW5kbGUgVVJMRW5jb2RlZCBEYXRhVVJJcyAtIHNlZSBTTyBhbnN3ZXIgIzY4NTAyNzYgZm9yIGNvZGUgdGhhdCBkb2VzIHRoaXNcbiAgdmFyIGJ5dGVTdHJpbmcgPSBhdG9iKGRhdGFVUkkuc3BsaXQoJywnKVsxXSk7XG5cbiAgLy8gc2VwYXJhdGUgb3V0IHRoZSBtaW1lIGNvbXBvbmVudFxuICB2YXIgbWltZVN0cmluZyA9IGRhdGFVUkkuc3BsaXQoJywnKVswXS5zcGxpdCgnOicpWzFdLnNwbGl0KCc7JylbMF07XG5cbiAgLy8gd3JpdGUgdGhlIGJ5dGVzIG9mIHRoZSBzdHJpbmcgdG8gYW4gQXJyYXlCdWZmZXJcbiAgdmFyIGFiID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVTdHJpbmcubGVuZ3RoKTtcbiAgdmFyIGlhID0gbmV3IFVpbnQ4QXJyYXkoYWIpO1xuICBmb3IgKHZhciBpID0gMCwgZW5kID0gYnl0ZVN0cmluZy5sZW5ndGgsIGFzYyA9IDAgPD0gZW5kOyBhc2MgPyBpIDw9IGVuZCA6IGkgPj0gZW5kOyBhc2MgPyBpKysgOiBpLS0pIHtcbiAgICBpYVtpXSA9IGJ5dGVTdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgfVxuXG4gIC8vIHdyaXRlIHRoZSBBcnJheUJ1ZmZlciB0byBhIGJsb2JcbiAgcmV0dXJuIG5ldyBCbG9iKFthYl0sIHsgdHlwZTogbWltZVN0cmluZyB9KTtcbn07XG5cbi8vIFJldHVybnMgYW4gYXJyYXkgd2l0aG91dCB0aGUgcmVqZWN0ZWQgaXRlbVxudmFyIHdpdGhvdXQgPSBmdW5jdGlvbiB3aXRob3V0KGxpc3QsIHJlamVjdGVkSXRlbSkge1xuICByZXR1cm4gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbSAhPT0gcmVqZWN0ZWRJdGVtO1xuICB9KS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfSk7XG59O1xuXG4vLyBhYmMtZGVmX2doaSAtPiBhYmNEZWZHaGlcbnZhciBjYW1lbGl6ZSA9IGZ1bmN0aW9uIGNhbWVsaXplKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1fXShcXHcpL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiBtYXRjaC5jaGFyQXQoMSkudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59O1xuXG4vLyBDcmVhdGVzIGFuIGVsZW1lbnQgZnJvbSBzdHJpbmdcbkRyb3B6b25lLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXYuaW5uZXJIVE1MID0gc3RyaW5nO1xuICByZXR1cm4gZGl2LmNoaWxkTm9kZXNbMF07XG59O1xuXG4vLyBUZXN0cyBpZiBnaXZlbiBlbGVtZW50IGlzIGluc2lkZSAob3Igc2ltcGx5IGlzKSB0aGUgY29udGFpbmVyXG5Ecm9wem9uZS5lbGVtZW50SW5zaWRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gQ29mZmVlc2NyaXB0IGRvZXNuJ3Qgc3VwcG9ydCBkby93aGlsZSBsb29wc1xuICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Ecm9wem9uZS5nZXRFbGVtZW50ID0gZnVuY3Rpb24gKGVsLCBuYW1lKSB7XG4gIHZhciBlbGVtZW50ID0gdm9pZCAwO1xuICBpZiAodHlwZW9mIGVsID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICB9IGVsc2UgaWYgKGVsLm5vZGVUeXBlICE9IG51bGwpIHtcbiAgICBlbGVtZW50ID0gZWw7XG4gIH1cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYFwiICsgbmFtZSArIFwiYCBvcHRpb24gcHJvdmlkZWQuIFBsZWFzZSBwcm92aWRlIGEgQ1NTIHNlbGVjdG9yIG9yIGEgcGxhaW4gSFRNTCBlbGVtZW50LlwiKTtcbiAgfVxuICByZXR1cm4gZWxlbWVudDtcbn07XG5cbkRyb3B6b25lLmdldEVsZW1lbnRzID0gZnVuY3Rpb24gKGVscywgbmFtZSkge1xuICB2YXIgZWwgPSB2b2lkIDAsXG4gICAgICBlbGVtZW50cyA9IHZvaWQgMDtcbiAgaWYgKGVscyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgZWxlbWVudHMgPSBbXTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMzYgPSBlbHMsIF9pc0FycmF5MzYgPSB0cnVlLCBfaTM4ID0gMCwgX2l0ZXJhdG9yMzYgPSBfaXNBcnJheTM2ID8gX2l0ZXJhdG9yMzYgOiBfaXRlcmF0b3IzNltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICBpZiAoX2lzQXJyYXkzNikge1xuICAgICAgICAgIGlmIChfaTM4ID49IF9pdGVyYXRvcjM2Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgZWwgPSBfaXRlcmF0b3IzNltfaTM4KytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMzggPSBfaXRlcmF0b3IzNi5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMzguZG9uZSkgYnJlYWs7XG4gICAgICAgICAgZWwgPSBfaTM4LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudHMucHVzaCh0aGlzLmdldEVsZW1lbnQoZWwsIG5hbWUpKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlbGVtZW50cyA9IG51bGw7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbHMgPT09IFwic3RyaW5nXCIpIHtcbiAgICBlbGVtZW50cyA9IFtdO1xuICAgIGZvciAodmFyIF9pdGVyYXRvcjM3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbHMpLCBfaXNBcnJheTM3ID0gdHJ1ZSwgX2kzOSA9IDAsIF9pdGVyYXRvcjM3ID0gX2lzQXJyYXkzNyA/IF9pdGVyYXRvcjM3IDogX2l0ZXJhdG9yMzdbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgIGlmIChfaXNBcnJheTM3KSB7XG4gICAgICAgIGlmIChfaTM5ID49IF9pdGVyYXRvcjM3Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgIGVsID0gX2l0ZXJhdG9yMzdbX2kzOSsrXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9pMzkgPSBfaXRlcmF0b3IzNy5uZXh0KCk7XG4gICAgICAgIGlmIChfaTM5LmRvbmUpIGJyZWFrO1xuICAgICAgICBlbCA9IF9pMzkudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnRzLnB1c2goZWwpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChlbHMubm9kZVR5cGUgIT0gbnVsbCkge1xuICAgIGVsZW1lbnRzID0gW2Vsc107XG4gIH1cblxuICBpZiAoZWxlbWVudHMgPT0gbnVsbCB8fCAhZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBgXCIgKyBuYW1lICsgXCJgIG9wdGlvbiBwcm92aWRlZC4gUGxlYXNlIHByb3ZpZGUgYSBDU1Mgc2VsZWN0b3IsIGEgcGxhaW4gSFRNTCBlbGVtZW50IG9yIGEgbGlzdCBvZiB0aG9zZS5cIik7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudHM7XG59O1xuXG4vLyBBc2tzIHRoZSB1c2VyIHRoZSBxdWVzdGlvbiBhbmQgY2FsbHMgYWNjZXB0ZWQgb3IgcmVqZWN0ZWQgYWNjb3JkaW5nbHlcbi8vXG4vLyBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBqdXN0IHVzZXMgYHdpbmRvdy5jb25maXJtYCBhbmQgdGhlbiBjYWxscyB0aGVcbi8vIGFwcHJvcHJpYXRlIGNhbGxiYWNrLlxuRHJvcHpvbmUuY29uZmlybSA9IGZ1bmN0aW9uIChxdWVzdGlvbiwgYWNjZXB0ZWQsIHJlamVjdGVkKSB7XG4gIGlmICh3aW5kb3cuY29uZmlybShxdWVzdGlvbikpIHtcbiAgICByZXR1cm4gYWNjZXB0ZWQoKTtcbiAgfSBlbHNlIGlmIChyZWplY3RlZCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHJlamVjdGVkKCk7XG4gIH1cbn07XG5cbi8vIFZhbGlkYXRlcyB0aGUgbWltZSB0eXBlIGxpa2UgdGhpczpcbi8vXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0hUTUwvRWxlbWVudC9pbnB1dCNhdHRyLWFjY2VwdFxuRHJvcHpvbmUuaXNWYWxpZEZpbGUgPSBmdW5jdGlvbiAoZmlsZSwgYWNjZXB0ZWRGaWxlcykge1xuICBpZiAoIWFjY2VwdGVkRmlsZXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBJZiB0aGVyZSBhcmUgbm8gYWNjZXB0ZWQgbWltZSB0eXBlcywgaXQncyBPS1xuICBhY2NlcHRlZEZpbGVzID0gYWNjZXB0ZWRGaWxlcy5zcGxpdChcIixcIik7XG5cbiAgdmFyIG1pbWVUeXBlID0gZmlsZS50eXBlO1xuICB2YXIgYmFzZU1pbWVUeXBlID0gbWltZVR5cGUucmVwbGFjZSgvXFwvLiokLywgXCJcIik7XG5cbiAgZm9yICh2YXIgX2l0ZXJhdG9yMzggPSBhY2NlcHRlZEZpbGVzLCBfaXNBcnJheTM4ID0gdHJ1ZSwgX2k0MCA9IDAsIF9pdGVyYXRvcjM4ID0gX2lzQXJyYXkzOCA/IF9pdGVyYXRvcjM4IDogX2l0ZXJhdG9yMzhbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICB2YXIgX3JlZjM1O1xuXG4gICAgaWYgKF9pc0FycmF5MzgpIHtcbiAgICAgIGlmIChfaTQwID49IF9pdGVyYXRvcjM4Lmxlbmd0aCkgYnJlYWs7XG4gICAgICBfcmVmMzUgPSBfaXRlcmF0b3IzOFtfaTQwKytdO1xuICAgIH0gZWxzZSB7XG4gICAgICBfaTQwID0gX2l0ZXJhdG9yMzgubmV4dCgpO1xuICAgICAgaWYgKF9pNDAuZG9uZSkgYnJlYWs7XG4gICAgICBfcmVmMzUgPSBfaTQwLnZhbHVlO1xuICAgIH1cblxuICAgIHZhciB2YWxpZFR5cGUgPSBfcmVmMzU7XG5cbiAgICB2YWxpZFR5cGUgPSB2YWxpZFR5cGUudHJpbSgpO1xuICAgIGlmICh2YWxpZFR5cGUuY2hhckF0KDApID09PSBcIi5cIikge1xuICAgICAgaWYgKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodmFsaWRUeXBlLnRvTG93ZXJDYXNlKCksIGZpbGUubmFtZS5sZW5ndGggLSB2YWxpZFR5cGUubGVuZ3RoKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh2YWxpZFR5cGUpKSB7XG4gICAgICAvLyBUaGlzIGlzIHNvbWV0aGluZyBsaWtlIGEgaW1hZ2UvKiBtaW1lIHR5cGVcbiAgICAgIGlmIChiYXNlTWltZVR5cGUgPT09IHZhbGlkVHlwZS5yZXBsYWNlKC9cXC8uKiQvLCBcIlwiKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1pbWVUeXBlID09PSB2YWxpZFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gQXVnbWVudCBqUXVlcnlcbmlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJyAmJiBqUXVlcnkgIT09IG51bGwpIHtcbiAgalF1ZXJ5LmZuLmRyb3B6b25lID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgRHJvcHpvbmUodGhpcywgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH07XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUgIT09IG51bGwpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBEcm9wem9uZTtcbn0gZWxzZSB7XG4gIHdpbmRvdy5Ecm9wem9uZSA9IERyb3B6b25lO1xufVxuXG4vLyBEcm9wem9uZSBmaWxlIHN0YXR1cyBjb2Rlc1xuRHJvcHpvbmUuQURERUQgPSBcImFkZGVkXCI7XG5cbkRyb3B6b25lLlFVRVVFRCA9IFwicXVldWVkXCI7XG4vLyBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIE5vdywgaWYgYSBmaWxlIGlzIGFjY2VwdGVkLCBpdCdzIGVpdGhlciBxdWV1ZWRcbi8vIG9yIHVwbG9hZGluZy5cbkRyb3B6b25lLkFDQ0VQVEVEID0gRHJvcHpvbmUuUVVFVUVEO1xuXG5Ecm9wem9uZS5VUExPQURJTkcgPSBcInVwbG9hZGluZ1wiO1xuRHJvcHpvbmUuUFJPQ0VTU0lORyA9IERyb3B6b25lLlVQTE9BRElORzsgLy8gYWxpYXNcblxuRHJvcHpvbmUuQ0FOQ0VMRUQgPSBcImNhbmNlbGVkXCI7XG5Ecm9wem9uZS5FUlJPUiA9IFwiZXJyb3JcIjtcbkRyb3B6b25lLlNVQ0NFU1MgPSBcInN1Y2Nlc3NcIjtcblxuLypcblxuIEJ1Z2ZpeCBmb3IgaU9TIDYgYW5kIDdcbiBTb3VyY2U6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTE5MjkwOTkvaHRtbDUtY2FudmFzLWRyYXdpbWFnZS1yYXRpby1idWctaW9zXG4gYmFzZWQgb24gdGhlIHdvcmsgb2YgaHR0cHM6Ly9naXRodWIuY29tL3N0b21pdGEvaW9zLWltYWdlZmlsZS1tZWdhcGl4ZWxcblxuICovXG5cbi8vIERldGVjdGluZyB2ZXJ0aWNhbCBzcXVhc2ggaW4gbG9hZGVkIGltYWdlLlxuLy8gRml4ZXMgYSBidWcgd2hpY2ggc3F1YXNoIGltYWdlIHZlcnRpY2FsbHkgd2hpbGUgZHJhd2luZyBpbnRvIGNhbnZhcyBmb3Igc29tZSBpbWFnZXMuXG4vLyBUaGlzIGlzIGEgYnVnIGluIGlPUzYgZGV2aWNlcy4gVGhpcyBmdW5jdGlvbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zdG9taXRhL2lvcy1pbWFnZWZpbGUtbWVnYXBpeGVsXG52YXIgZGV0ZWN0VmVydGljYWxTcXVhc2ggPSBmdW5jdGlvbiBkZXRlY3RWZXJ0aWNhbFNxdWFzaChpbWcpIHtcbiAgdmFyIGl3ID0gaW1nLm5hdHVyYWxXaWR0aDtcbiAgdmFyIGloID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjYW52YXMud2lkdGggPSAxO1xuICBjYW52YXMuaGVpZ2h0ID0gaWg7XG4gIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG5cbiAgdmFyIF9jdHgkZ2V0SW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgxLCAwLCAxLCBpaCksXG4gICAgICBkYXRhID0gX2N0eCRnZXRJbWFnZURhdGEuZGF0YTtcblxuICAvLyBzZWFyY2ggaW1hZ2UgZWRnZSBwaXhlbCBwb3NpdGlvbiBpbiBjYXNlIGl0IGlzIHNxdWFzaGVkIHZlcnRpY2FsbHkuXG5cblxuICB2YXIgc3kgPSAwO1xuICB2YXIgZXkgPSBpaDtcbiAgdmFyIHB5ID0gaWg7XG4gIHdoaWxlIChweSA+IHN5KSB7XG4gICAgdmFyIGFscGhhID0gZGF0YVsocHkgLSAxKSAqIDQgKyAzXTtcblxuICAgIGlmIChhbHBoYSA9PT0gMCkge1xuICAgICAgZXkgPSBweTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3kgPSBweTtcbiAgICB9XG5cbiAgICBweSA9IGV5ICsgc3kgPj4gMTtcbiAgfVxuICB2YXIgcmF0aW8gPSBweSAvIGloO1xuXG4gIGlmIChyYXRpbyA9PT0gMCkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYXRpbztcbiAgfVxufTtcblxuLy8gQSByZXBsYWNlbWVudCBmb3IgY29udGV4dC5kcmF3SW1hZ2Vcbi8vIChhcmdzIGFyZSBmb3Igc291cmNlIGFuZCBkZXN0aW5hdGlvbikuXG52YXIgZHJhd0ltYWdlSU9TRml4ID0gZnVuY3Rpb24gZHJhd0ltYWdlSU9TRml4KGN0eCwgaW1nLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGgpIHtcbiAgdmFyIHZlcnRTcXVhc2hSYXRpbyA9IGRldGVjdFZlcnRpY2FsU3F1YXNoKGltZyk7XG4gIHJldHVybiBjdHguZHJhd0ltYWdlKGltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoIC8gdmVydFNxdWFzaFJhdGlvKTtcbn07XG5cbi8vIEJhc2VkIG9uIE1pbmlmeUpwZWdcbi8vIFNvdXJjZTogaHR0cDovL3d3dy5wZXJyeS5jei9maWxlcy9FeGlmUmVzdG9yZXIuanNcbi8vIGh0dHA6Ly9lbGljb24uYmxvZzU3LmZjMi5jb20vYmxvZy1lbnRyeS0yMDYuaHRtbFxuXG52YXIgRXhpZlJlc3RvcmUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEV4aWZSZXN0b3JlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFeGlmUmVzdG9yZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRXhpZlJlc3RvcmUsIG51bGwsIFt7XG4gICAga2V5OiBcImluaXRDbGFzc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0Q2xhc3MoKSB7XG4gICAgICB0aGlzLktFWV9TVFIgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJlbmNvZGU2NFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmNvZGU2NChpbnB1dCkge1xuICAgICAgdmFyIG91dHB1dCA9ICcnO1xuICAgICAgdmFyIGNocjEgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgY2hyMiA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBjaHIzID0gJyc7XG4gICAgICB2YXIgZW5jMSA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBlbmMyID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGVuYzMgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgZW5jNCA9ICcnO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY2hyMSA9IGlucHV0W2krK107XG4gICAgICAgIGNocjIgPSBpbnB1dFtpKytdO1xuICAgICAgICBjaHIzID0gaW5wdXRbaSsrXTtcbiAgICAgICAgZW5jMSA9IGNocjEgPj4gMjtcbiAgICAgICAgZW5jMiA9IChjaHIxICYgMykgPDwgNCB8IGNocjIgPj4gNDtcbiAgICAgICAgZW5jMyA9IChjaHIyICYgMTUpIDw8IDIgfCBjaHIzID4+IDY7XG4gICAgICAgIGVuYzQgPSBjaHIzICYgNjM7XG4gICAgICAgIGlmIChpc05hTihjaHIyKSkge1xuICAgICAgICAgIGVuYzMgPSBlbmM0ID0gNjQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOYU4oY2hyMykpIHtcbiAgICAgICAgICBlbmM0ID0gNjQ7XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgdGhpcy5LRVlfU1RSLmNoYXJBdChlbmMxKSArIHRoaXMuS0VZX1NUUi5jaGFyQXQoZW5jMikgKyB0aGlzLktFWV9TVFIuY2hhckF0KGVuYzMpICsgdGhpcy5LRVlfU1RSLmNoYXJBdChlbmM0KTtcbiAgICAgICAgY2hyMSA9IGNocjIgPSBjaHIzID0gJyc7XG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSAnJztcbiAgICAgICAgaWYgKCEoaSA8IGlucHV0Lmxlbmd0aCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVzdG9yZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXN0b3JlKG9yaWdGaWxlQmFzZTY0LCByZXNpemVkRmlsZUJhc2U2NCkge1xuICAgICAgaWYgKCFvcmlnRmlsZUJhc2U2NC5tYXRjaCgnZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwnKSkge1xuICAgICAgICByZXR1cm4gcmVzaXplZEZpbGVCYXNlNjQ7XG4gICAgICB9XG4gICAgICB2YXIgcmF3SW1hZ2UgPSB0aGlzLmRlY29kZTY0KG9yaWdGaWxlQmFzZTY0LnJlcGxhY2UoJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsJywgJycpKTtcbiAgICAgIHZhciBzZWdtZW50cyA9IHRoaXMuc2xpY2UyU2VnbWVudHMocmF3SW1hZ2UpO1xuICAgICAgdmFyIGltYWdlID0gdGhpcy5leGlmTWFuaXB1bGF0aW9uKHJlc2l6ZWRGaWxlQmFzZTY0LCBzZWdtZW50cyk7XG4gICAgICByZXR1cm4gXCJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LFwiICsgdGhpcy5lbmNvZGU2NChpbWFnZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImV4aWZNYW5pcHVsYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZXhpZk1hbmlwdWxhdGlvbihyZXNpemVkRmlsZUJhc2U2NCwgc2VnbWVudHMpIHtcbiAgICAgIHZhciBleGlmQXJyYXkgPSB0aGlzLmdldEV4aWZBcnJheShzZWdtZW50cyk7XG4gICAgICB2YXIgbmV3SW1hZ2VBcnJheSA9IHRoaXMuaW5zZXJ0RXhpZihyZXNpemVkRmlsZUJhc2U2NCwgZXhpZkFycmF5KTtcbiAgICAgIHZhciBhQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkobmV3SW1hZ2VBcnJheSk7XG4gICAgICByZXR1cm4gYUJ1ZmZlcjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXhpZkFycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEV4aWZBcnJheShzZWdtZW50cykge1xuICAgICAgdmFyIHNlZyA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciB4ID0gMDtcbiAgICAgIHdoaWxlICh4IDwgc2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHNlZyA9IHNlZ21lbnRzW3hdO1xuICAgICAgICBpZiAoc2VnWzBdID09PSAyNTUgJiBzZWdbMV0gPT09IDIyNSkge1xuICAgICAgICAgIHJldHVybiBzZWc7XG4gICAgICAgIH1cbiAgICAgICAgeCsrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbnNlcnRFeGlmXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluc2VydEV4aWYocmVzaXplZEZpbGVCYXNlNjQsIGV4aWZBcnJheSkge1xuICAgICAgdmFyIGltYWdlRGF0YSA9IHJlc2l6ZWRGaWxlQmFzZTY0LnJlcGxhY2UoJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsJywgJycpO1xuICAgICAgdmFyIGJ1ZiA9IHRoaXMuZGVjb2RlNjQoaW1hZ2VEYXRhKTtcbiAgICAgIHZhciBzZXBhcmF0ZVBvaW50ID0gYnVmLmluZGV4T2YoMjU1LCAzKTtcbiAgICAgIHZhciBtYWUgPSBidWYuc2xpY2UoMCwgc2VwYXJhdGVQb2ludCk7XG4gICAgICB2YXIgYXRvID0gYnVmLnNsaWNlKHNlcGFyYXRlUG9pbnQpO1xuICAgICAgdmFyIGFycmF5ID0gbWFlO1xuICAgICAgYXJyYXkgPSBhcnJheS5jb25jYXQoZXhpZkFycmF5KTtcbiAgICAgIGFycmF5ID0gYXJyYXkuY29uY2F0KGF0byk7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNsaWNlMlNlZ21lbnRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNsaWNlMlNlZ21lbnRzKHJhd0ltYWdlQXJyYXkpIHtcbiAgICAgIHZhciBoZWFkID0gMDtcbiAgICAgIHZhciBzZWdtZW50cyA9IFtdO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGxlbmd0aDtcbiAgICAgICAgaWYgKHJhd0ltYWdlQXJyYXlbaGVhZF0gPT09IDI1NSAmIHJhd0ltYWdlQXJyYXlbaGVhZCArIDFdID09PSAyMTgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmF3SW1hZ2VBcnJheVtoZWFkXSA9PT0gMjU1ICYgcmF3SW1hZ2VBcnJheVtoZWFkICsgMV0gPT09IDIxNikge1xuICAgICAgICAgIGhlYWQgKz0gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZW5ndGggPSByYXdJbWFnZUFycmF5W2hlYWQgKyAyXSAqIDI1NiArIHJhd0ltYWdlQXJyYXlbaGVhZCArIDNdO1xuICAgICAgICAgIHZhciBlbmRQb2ludCA9IGhlYWQgKyBsZW5ndGggKyAyO1xuICAgICAgICAgIHZhciBzZWcgPSByYXdJbWFnZUFycmF5LnNsaWNlKGhlYWQsIGVuZFBvaW50KTtcbiAgICAgICAgICBzZWdtZW50cy5wdXNoKHNlZyk7XG4gICAgICAgICAgaGVhZCA9IGVuZFBvaW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChoZWFkID4gcmF3SW1hZ2VBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlZ21lbnRzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWNvZGU2NFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWNvZGU2NChpbnB1dCkge1xuICAgICAgdmFyIG91dHB1dCA9ICcnO1xuICAgICAgdmFyIGNocjEgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgY2hyMiA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBjaHIzID0gJyc7XG4gICAgICB2YXIgZW5jMSA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBlbmMyID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGVuYzMgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgZW5jNCA9ICcnO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIGJ1ZiA9IFtdO1xuICAgICAgLy8gcmVtb3ZlIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBBLVosIGEteiwgMC05LCArLCAvLCBvciA9XG4gICAgICB2YXIgYmFzZTY0dGVzdCA9IC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZztcbiAgICAgIGlmIChiYXNlNjR0ZXN0LmV4ZWMoaW5wdXQpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignVGhlcmUgd2VyZSBpbnZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGluIHRoZSBpbnB1dCB0ZXh0LlxcblZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGFyZSBBLVosIGEteiwgMC05LCBcXCcrXFwnLCBcXCcvXFwnLGFuZCBcXCc9XFwnXFxuRXhwZWN0IGVycm9ycyBpbiBkZWNvZGluZy4nKTtcbiAgICAgIH1cbiAgICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9cXD1dL2csICcnKTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGVuYzEgPSB0aGlzLktFWV9TVFIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzIgPSB0aGlzLktFWV9TVFIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzMgPSB0aGlzLktFWV9TVFIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzQgPSB0aGlzLktFWV9TVFIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGNocjEgPSBlbmMxIDw8IDIgfCBlbmMyID4+IDQ7XG4gICAgICAgIGNocjIgPSAoZW5jMiAmIDE1KSA8PCA0IHwgZW5jMyA+PiAyO1xuICAgICAgICBjaHIzID0gKGVuYzMgJiAzKSA8PCA2IHwgZW5jNDtcbiAgICAgICAgYnVmLnB1c2goY2hyMSk7XG4gICAgICAgIGlmIChlbmMzICE9PSA2NCkge1xuICAgICAgICAgIGJ1Zi5wdXNoKGNocjIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmM0ICE9PSA2NCkge1xuICAgICAgICAgIGJ1Zi5wdXNoKGNocjMpO1xuICAgICAgICB9XG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9ICcnO1xuICAgICAgICBlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gJyc7XG4gICAgICAgIGlmICghKGkgPCBpbnB1dC5sZW5ndGgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBidWY7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEV4aWZSZXN0b3JlO1xufSgpO1xuXG5FeGlmUmVzdG9yZS5pbml0Q2xhc3MoKTtcblxuLypcbiAqIGNvbnRlbnRsb2FkZWQuanNcbiAqXG4gKiBBdXRob3I6IERpZWdvIFBlcmluaSAoZGllZ28ucGVyaW5pIGF0IGdtYWlsLmNvbSlcbiAqIFN1bW1hcnk6IGNyb3NzLWJyb3dzZXIgd3JhcHBlciBmb3IgRE9NQ29udGVudExvYWRlZFxuICogVXBkYXRlZDogMjAxMDEwMjBcbiAqIExpY2Vuc2U6IE1JVFxuICogVmVyc2lvbjogMS4yXG4gKlxuICogVVJMOlxuICogaHR0cDovL2phdmFzY3JpcHQubndib3guY29tL0NvbnRlbnRMb2FkZWQvXG4gKiBodHRwOi8vamF2YXNjcmlwdC5ud2JveC5jb20vQ29udGVudExvYWRlZC9NSVQtTElDRU5TRVxuICovXG5cbi8vIEB3aW4gd2luZG93IHJlZmVyZW5jZVxuLy8gQGZuIGZ1bmN0aW9uIHJlZmVyZW5jZVxudmFyIGNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbiBjb250ZW50TG9hZGVkKHdpbiwgZm4pIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdmFyIHRvcCA9IHRydWU7XG4gIHZhciBkb2MgPSB3aW4uZG9jdW1lbnQ7XG4gIHZhciByb290ID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgdmFyIGFkZCA9IGRvYy5hZGRFdmVudExpc3RlbmVyID8gXCJhZGRFdmVudExpc3RlbmVyXCIgOiBcImF0dGFjaEV2ZW50XCI7XG4gIHZhciByZW0gPSBkb2MuYWRkRXZlbnRMaXN0ZW5lciA/IFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiIDogXCJkZXRhY2hFdmVudFwiO1xuICB2YXIgcHJlID0gZG9jLmFkZEV2ZW50TGlzdGVuZXIgPyBcIlwiIDogXCJvblwiO1xuICB2YXIgaW5pdCA9IGZ1bmN0aW9uIGluaXQoZSkge1xuICAgIGlmIChlLnR5cGUgPT09IFwicmVhZHlzdGF0ZWNoYW5nZVwiICYmIGRvYy5yZWFkeVN0YXRlICE9PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgKGUudHlwZSA9PT0gXCJsb2FkXCIgPyB3aW4gOiBkb2MpW3JlbV0ocHJlICsgZS50eXBlLCBpbml0LCBmYWxzZSk7XG4gICAgaWYgKCFkb25lICYmIChkb25lID0gdHJ1ZSkpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHdpbiwgZS50eXBlIHx8IGUpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcG9sbCA9IGZ1bmN0aW9uIHBvbGwoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJvb3QuZG9TY3JvbGwoXCJsZWZ0XCIpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldFRpbWVvdXQocG9sbCwgNTApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdChcInBvbGxcIik7XG4gIH07XG5cbiAgaWYgKGRvYy5yZWFkeVN0YXRlICE9PSBcImNvbXBsZXRlXCIpIHtcbiAgICBpZiAoZG9jLmNyZWF0ZUV2ZW50T2JqZWN0ICYmIHJvb3QuZG9TY3JvbGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRvcCA9ICF3aW4uZnJhbWVFbGVtZW50O1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgICBpZiAodG9wKSB7XG4gICAgICAgIHBvbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZG9jW2FkZF0ocHJlICsgXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQsIGZhbHNlKTtcbiAgICBkb2NbYWRkXShwcmUgKyBcInJlYWR5c3RhdGVjaGFuZ2VcIiwgaW5pdCwgZmFsc2UpO1xuICAgIHJldHVybiB3aW5bYWRkXShwcmUgKyBcImxvYWRcIiwgaW5pdCwgZmFsc2UpO1xuICB9XG59O1xuXG4vLyBBcyBhIHNpbmdsZSBmdW5jdGlvbiB0byBiZSBhYmxlIHRvIHdyaXRlIHRlc3RzLlxuRHJvcHpvbmUuX2F1dG9EaXNjb3ZlckZ1bmN0aW9uID0gZnVuY3Rpb24gKCkge1xuICBpZiAoRHJvcHpvbmUuYXV0b0Rpc2NvdmVyKSB7XG4gICAgcmV0dXJuIERyb3B6b25lLmRpc2NvdmVyKCk7XG4gIH1cbn07XG5jb250ZW50TG9hZGVkKHdpbmRvdywgRHJvcHpvbmUuX2F1dG9EaXNjb3ZlckZ1bmN0aW9uKTtcblxuZnVuY3Rpb24gX19ndWFyZF9fKHZhbHVlLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwgPyB0cmFuc2Zvcm0odmFsdWUpIDogdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gX19ndWFyZE1ldGhvZF9fKG9iaiwgbWV0aG9kTmFtZSwgdHJhbnNmb3JtKSB7XG4gIGlmICh0eXBlb2Ygb2JqICE9PSAndW5kZWZpbmVkJyAmJiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9ialttZXRob2ROYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0cmFuc2Zvcm0ob2JqLCBtZXRob2ROYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iLCIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcIlNpZW1hXCIsW10sdCk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy5TaWVtYT10KCk6ZS5TaWVtYT10KCl9KFwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6dGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtmdW5jdGlvbiB0KHIpe2lmKGlbcl0pcmV0dXJuIGlbcl0uZXhwb3J0czt2YXIgbj1pW3JdPXtpOnIsbDohMSxleHBvcnRzOnt9fTtyZXR1cm4gZVtyXS5jYWxsKG4uZXhwb3J0cyxuLG4uZXhwb3J0cyx0KSxuLmw9ITAsbi5leHBvcnRzfXZhciBpPXt9O3JldHVybiB0Lm09ZSx0LmM9aSx0LmQ9ZnVuY3Rpb24oZSxpLHIpe3QubyhlLGkpfHxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxpLHtjb25maWd1cmFibGU6ITEsZW51bWVyYWJsZTohMCxnZXQ6cn0pfSx0Lm49ZnVuY3Rpb24oZSl7dmFyIGk9ZSYmZS5fX2VzTW9kdWxlP2Z1bmN0aW9uKCl7cmV0dXJuIGUuZGVmYXVsdH06ZnVuY3Rpb24oKXtyZXR1cm4gZX07cmV0dXJuIHQuZChpLFwiYVwiLGkpLGl9LHQubz1mdW5jdGlvbihlLHQpe3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSx0KX0sdC5wPVwiXCIsdCh0LnM9MCl9KFtmdW5jdGlvbihlLHQsaSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcihlLHQpe2lmKCEoZSBpbnN0YW5jZW9mIHQpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG49XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX0scz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXtmb3IodmFyIGk9MDtpPHQubGVuZ3RoO2krKyl7dmFyIHI9dFtpXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsci5rZXkscil9fXJldHVybiBmdW5jdGlvbih0LGkscil7cmV0dXJuIGkmJmUodC5wcm90b3R5cGUsaSksciYmZSh0LHIpLHR9fSgpLGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe3ZhciBpPXRoaXM7aWYocih0aGlzLGUpLHRoaXMuY29uZmlnPWUubWVyZ2VTZXR0aW5ncyh0KSx0aGlzLnNlbGVjdG9yPVwic3RyaW5nXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy5zZWxlY3Rvcj9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuY29uZmlnLnNlbGVjdG9yKTp0aGlzLmNvbmZpZy5zZWxlY3RvcixudWxsPT09dGhpcy5zZWxlY3Rvcil0aHJvdyBuZXcgRXJyb3IoXCJTb21ldGhpbmcgd3Jvbmcgd2l0aCB5b3VyIHNlbGVjdG9yIPCfmK1cIik7dGhpcy5yZXNvbHZlU2xpZGVzTnVtYmVyKCksdGhpcy5zZWxlY3RvcldpZHRoPXRoaXMuc2VsZWN0b3Iub2Zmc2V0V2lkdGgsdGhpcy5pbm5lckVsZW1lbnRzPVtdLnNsaWNlLmNhbGwodGhpcy5zZWxlY3Rvci5jaGlsZHJlbiksdGhpcy5jdXJyZW50U2xpZGU9dGhpcy5jb25maWcubG9vcD90aGlzLmNvbmZpZy5zdGFydEluZGV4JXRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg6TWF0aC5tYXgoMCxNYXRoLm1pbih0aGlzLmNvbmZpZy5zdGFydEluZGV4LHRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgtdGhpcy5wZXJQYWdlKSksdGhpcy50cmFuc2Zvcm1Qcm9wZXJ0eT1lLndlYmtpdE9yTm90KCksW1wicmVzaXplSGFuZGxlclwiLFwidG91Y2hzdGFydEhhbmRsZXJcIixcInRvdWNoZW5kSGFuZGxlclwiLFwidG91Y2htb3ZlSGFuZGxlclwiLFwibW91c2Vkb3duSGFuZGxlclwiLFwibW91c2V1cEhhbmRsZXJcIixcIm1vdXNlbGVhdmVIYW5kbGVyXCIsXCJtb3VzZW1vdmVIYW5kbGVyXCIsXCJjbGlja0hhbmRsZXJcIl0uZm9yRWFjaChmdW5jdGlvbihlKXtpW2VdPWlbZV0uYmluZChpKX0pLHRoaXMuaW5pdCgpfXJldHVybiBzKGUsW3trZXk6XCJhdHRhY2hFdmVudHNcIix2YWx1ZTpmdW5jdGlvbigpe3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5yZXNpemVIYW5kbGVyKSx0aGlzLmNvbmZpZy5kcmFnZ2FibGUmJih0aGlzLnBvaW50ZXJEb3duPSExLHRoaXMuZHJhZz17c3RhcnRYOjAsZW5kWDowLHN0YXJ0WTowLGxldEl0R286bnVsbCxwcmV2ZW50Q2xpY2s6ITF9LHRoaXMuc2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0aGlzLnRvdWNoc3RhcnRIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHRoaXMudG91Y2hlbmRIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIix0aGlzLnRvdWNobW92ZUhhbmRsZXIpLHRoaXMuc2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHRoaXMubW91c2Vkb3duSGFuZGxlciksdGhpcy5zZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLHRoaXMubW91c2V1cEhhbmRsZXIpLHRoaXMuc2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIix0aGlzLm1vdXNlbGVhdmVIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIix0aGlzLm1vdXNlbW92ZUhhbmRsZXIpLHRoaXMuc2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdGhpcy5jbGlja0hhbmRsZXIpKX19LHtrZXk6XCJkZXRhY2hFdmVudHNcIix2YWx1ZTpmdW5jdGlvbigpe3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5yZXNpemVIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdGhpcy50b3VjaHN0YXJ0SGFuZGxlciksdGhpcy5zZWxlY3Rvci5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0aGlzLnRvdWNoZW5kSGFuZGxlciksdGhpcy5zZWxlY3Rvci5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsdGhpcy50b3VjaG1vdmVIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIix0aGlzLm1vdXNlZG93bkhhbmRsZXIpLHRoaXMuc2VsZWN0b3IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIix0aGlzLm1vdXNldXBIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsdGhpcy5tb3VzZWxlYXZlSGFuZGxlciksdGhpcy5zZWxlY3Rvci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsdGhpcy5tb3VzZW1vdmVIYW5kbGVyKSx0aGlzLnNlbGVjdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLHRoaXMuY2xpY2tIYW5kbGVyKX19LHtrZXk6XCJpbml0XCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmF0dGFjaEV2ZW50cygpLHRoaXMuc2VsZWN0b3Iuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIix0aGlzLnNlbGVjdG9yLnN0eWxlLmRpcmVjdGlvbj10aGlzLmNvbmZpZy5ydGw/XCJydGxcIjpcImx0clwiLHRoaXMuYnVpbGRTbGlkZXJGcmFtZSgpLHRoaXMuY29uZmlnLm9uSW5pdC5jYWxsKHRoaXMpfX0se2tleTpcImJ1aWxkU2xpZGVyRnJhbWVcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMuc2VsZWN0b3JXaWR0aC90aGlzLnBlclBhZ2UsdD10aGlzLmNvbmZpZy5sb29wP3RoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgrMip0aGlzLnBlclBhZ2U6dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDt0aGlzLnNsaWRlckZyYW1lPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksdGhpcy5zbGlkZXJGcmFtZS5zdHlsZS53aWR0aD1lKnQrXCJweFwiLHRoaXMuZW5hYmxlVHJhbnNpdGlvbigpLHRoaXMuY29uZmlnLmRyYWdnYWJsZSYmKHRoaXMuc2VsZWN0b3Iuc3R5bGUuY3Vyc29yPVwiLXdlYmtpdC1ncmFiXCIpO3ZhciBpPWRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtpZih0aGlzLmNvbmZpZy5sb29wKWZvcih2YXIgcj10aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoLXRoaXMucGVyUGFnZTtyPHRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg7cisrKXt2YXIgbj10aGlzLmJ1aWxkU2xpZGVyRnJhbWVJdGVtKHRoaXMuaW5uZXJFbGVtZW50c1tyXS5jbG9uZU5vZGUoITApKTtpLmFwcGVuZENoaWxkKG4pfWZvcih2YXIgcz0wO3M8dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDtzKyspe3ZhciBsPXRoaXMuYnVpbGRTbGlkZXJGcmFtZUl0ZW0odGhpcy5pbm5lckVsZW1lbnRzW3NdKTtpLmFwcGVuZENoaWxkKGwpfWlmKHRoaXMuY29uZmlnLmxvb3ApZm9yKHZhciBvPTA7bzx0aGlzLnBlclBhZ2U7bysrKXt2YXIgYT10aGlzLmJ1aWxkU2xpZGVyRnJhbWVJdGVtKHRoaXMuaW5uZXJFbGVtZW50c1tvXS5jbG9uZU5vZGUoITApKTtpLmFwcGVuZENoaWxkKGEpfXRoaXMuc2xpZGVyRnJhbWUuYXBwZW5kQ2hpbGQoaSksdGhpcy5zZWxlY3Rvci5pbm5lckhUTUw9XCJcIix0aGlzLnNlbGVjdG9yLmFwcGVuZENoaWxkKHRoaXMuc2xpZGVyRnJhbWUpLHRoaXMuc2xpZGVUb0N1cnJlbnQoKX19LHtrZXk6XCJidWlsZFNsaWRlckZyYW1lSXRlbVwiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7cmV0dXJuIHQuc3R5bGUuY3NzRmxvYXQ9dGhpcy5jb25maWcucnRsP1wicmlnaHRcIjpcImxlZnRcIix0LnN0eWxlLmZsb2F0PXRoaXMuY29uZmlnLnJ0bD9cInJpZ2h0XCI6XCJsZWZ0XCIsdC5zdHlsZS53aWR0aD0odGhpcy5jb25maWcubG9vcD8xMDAvKHRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgrMip0aGlzLnBlclBhZ2UpOjEwMC90aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoKStcIiVcIix0LmFwcGVuZENoaWxkKGUpLHR9fSx7a2V5OlwicmVzb2x2ZVNsaWRlc051bWJlclwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoXCJudW1iZXJcIj09dHlwZW9mIHRoaXMuY29uZmlnLnBlclBhZ2UpdGhpcy5wZXJQYWdlPXRoaXMuY29uZmlnLnBlclBhZ2U7ZWxzZSBpZihcIm9iamVjdFwiPT09bih0aGlzLmNvbmZpZy5wZXJQYWdlKSl7dGhpcy5wZXJQYWdlPTE7Zm9yKHZhciBlIGluIHRoaXMuY29uZmlnLnBlclBhZ2Upd2luZG93LmlubmVyV2lkdGg+PWUmJih0aGlzLnBlclBhZ2U9dGhpcy5jb25maWcucGVyUGFnZVtlXSl9fX0se2tleTpcInByZXZcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXToxLHQ9YXJndW1lbnRzWzFdO2lmKCEodGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDw9dGhpcy5wZXJQYWdlKSl7dmFyIGk9dGhpcy5jdXJyZW50U2xpZGU7aWYodGhpcy5jb25maWcubG9vcCl7aWYodGhpcy5jdXJyZW50U2xpZGUtZTwwKXt0aGlzLmRpc2FibGVUcmFuc2l0aW9uKCk7dmFyIHI9dGhpcy5jdXJyZW50U2xpZGUrdGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aCxuPXRoaXMucGVyUGFnZSxzPXIrbixsPSh0aGlzLmNvbmZpZy5ydGw/MTotMSkqcyoodGhpcy5zZWxlY3RvcldpZHRoL3RoaXMucGVyUGFnZSksbz10aGlzLmNvbmZpZy5kcmFnZ2FibGU/dGhpcy5kcmFnLmVuZFgtdGhpcy5kcmFnLnN0YXJ0WDowO3RoaXMuc2xpZGVyRnJhbWUuc3R5bGVbdGhpcy50cmFuc2Zvcm1Qcm9wZXJ0eV09XCJ0cmFuc2xhdGUzZChcIisobCtvKStcInB4LCAwLCAwKVwiLHRoaXMuY3VycmVudFNsaWRlPXItZX1lbHNlIHRoaXMuY3VycmVudFNsaWRlPXRoaXMuY3VycmVudFNsaWRlLWV9ZWxzZSB0aGlzLmN1cnJlbnRTbGlkZT1NYXRoLm1heCh0aGlzLmN1cnJlbnRTbGlkZS1lLDApO2khPT10aGlzLmN1cnJlbnRTbGlkZSYmKHRoaXMuc2xpZGVUb0N1cnJlbnQodGhpcy5jb25maWcubG9vcCksdGhpcy5jb25maWcub25DaGFuZ2UuY2FsbCh0aGlzKSx0JiZ0LmNhbGwodGhpcykpfX19LHtrZXk6XCJuZXh0XCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06MSx0PWFyZ3VtZW50c1sxXTtpZighKHRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg8PXRoaXMucGVyUGFnZSkpe3ZhciBpPXRoaXMuY3VycmVudFNsaWRlO2lmKHRoaXMuY29uZmlnLmxvb3Ape2lmKHRoaXMuY3VycmVudFNsaWRlK2U+dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aC10aGlzLnBlclBhZ2Upe3RoaXMuZGlzYWJsZVRyYW5zaXRpb24oKTt2YXIgcj10aGlzLmN1cnJlbnRTbGlkZS10aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoLG49dGhpcy5wZXJQYWdlLHM9cituLGw9KHRoaXMuY29uZmlnLnJ0bD8xOi0xKSpzKih0aGlzLnNlbGVjdG9yV2lkdGgvdGhpcy5wZXJQYWdlKSxvPXRoaXMuY29uZmlnLmRyYWdnYWJsZT90aGlzLmRyYWcuZW5kWC10aGlzLmRyYWcuc3RhcnRYOjA7dGhpcy5zbGlkZXJGcmFtZS5zdHlsZVt0aGlzLnRyYW5zZm9ybVByb3BlcnR5XT1cInRyYW5zbGF0ZTNkKFwiKyhsK28pK1wicHgsIDAsIDApXCIsdGhpcy5jdXJyZW50U2xpZGU9citlfWVsc2UgdGhpcy5jdXJyZW50U2xpZGU9dGhpcy5jdXJyZW50U2xpZGUrZX1lbHNlIHRoaXMuY3VycmVudFNsaWRlPU1hdGgubWluKHRoaXMuY3VycmVudFNsaWRlK2UsdGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aC10aGlzLnBlclBhZ2UpO2khPT10aGlzLmN1cnJlbnRTbGlkZSYmKHRoaXMuc2xpZGVUb0N1cnJlbnQodGhpcy5jb25maWcubG9vcCksdGhpcy5jb25maWcub25DaGFuZ2UuY2FsbCh0aGlzKSx0JiZ0LmNhbGwodGhpcykpfX19LHtrZXk6XCJkaXNhYmxlVHJhbnNpdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5zbGlkZXJGcmFtZS5zdHlsZS53ZWJraXRUcmFuc2l0aW9uPVwiYWxsIDBtcyBcIit0aGlzLmNvbmZpZy5lYXNpbmcsdGhpcy5zbGlkZXJGcmFtZS5zdHlsZS50cmFuc2l0aW9uPVwiYWxsIDBtcyBcIit0aGlzLmNvbmZpZy5lYXNpbmd9fSx7a2V5OlwiZW5hYmxlVHJhbnNpdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5zbGlkZXJGcmFtZS5zdHlsZS53ZWJraXRUcmFuc2l0aW9uPVwiYWxsIFwiK3RoaXMuY29uZmlnLmR1cmF0aW9uK1wibXMgXCIrdGhpcy5jb25maWcuZWFzaW5nLHRoaXMuc2xpZGVyRnJhbWUuc3R5bGUudHJhbnNpdGlvbj1cImFsbCBcIit0aGlzLmNvbmZpZy5kdXJhdGlvbitcIm1zIFwiK3RoaXMuY29uZmlnLmVhc2luZ319LHtrZXk6XCJnb1RvXCIsdmFsdWU6ZnVuY3Rpb24oZSx0KXtpZighKHRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg8PXRoaXMucGVyUGFnZSkpe3ZhciBpPXRoaXMuY3VycmVudFNsaWRlO3RoaXMuY3VycmVudFNsaWRlPXRoaXMuY29uZmlnLmxvb3A/ZSV0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoOk1hdGgubWluKE1hdGgubWF4KGUsMCksdGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aC10aGlzLnBlclBhZ2UpLGkhPT10aGlzLmN1cnJlbnRTbGlkZSYmKHRoaXMuc2xpZGVUb0N1cnJlbnQoKSx0aGlzLmNvbmZpZy5vbkNoYW5nZS5jYWxsKHRoaXMpLHQmJnQuY2FsbCh0aGlzKSl9fX0se2tleTpcInNsaWRlVG9DdXJyZW50XCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxpPXRoaXMuY29uZmlnLmxvb3A/dGhpcy5jdXJyZW50U2xpZGUrdGhpcy5wZXJQYWdlOnRoaXMuY3VycmVudFNsaWRlLHI9KHRoaXMuY29uZmlnLnJ0bD8xOi0xKSppKih0aGlzLnNlbGVjdG9yV2lkdGgvdGhpcy5wZXJQYWdlKTtlP3JlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe3JlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe3QuZW5hYmxlVHJhbnNpdGlvbigpLHQuc2xpZGVyRnJhbWUuc3R5bGVbdC50cmFuc2Zvcm1Qcm9wZXJ0eV09XCJ0cmFuc2xhdGUzZChcIityK1wicHgsIDAsIDApXCJ9KX0pOnRoaXMuc2xpZGVyRnJhbWUuc3R5bGVbdGhpcy50cmFuc2Zvcm1Qcm9wZXJ0eV09XCJ0cmFuc2xhdGUzZChcIityK1wicHgsIDAsIDApXCJ9fSx7a2V5OlwidXBkYXRlQWZ0ZXJEcmFnXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT0odGhpcy5jb25maWcucnRsPy0xOjEpKih0aGlzLmRyYWcuZW5kWC10aGlzLmRyYWcuc3RhcnRYKSx0PU1hdGguYWJzKGUpLGk9dGhpcy5jb25maWcubXVsdGlwbGVEcmFnP01hdGguY2VpbCh0Lyh0aGlzLnNlbGVjdG9yV2lkdGgvdGhpcy5wZXJQYWdlKSk6MSxyPWU+MCYmdGhpcy5jdXJyZW50U2xpZGUtaTwwLG49ZTwwJiZ0aGlzLmN1cnJlbnRTbGlkZStpPnRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgtdGhpcy5wZXJQYWdlO2U+MCYmdD50aGlzLmNvbmZpZy50aHJlc2hvbGQmJnRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg+dGhpcy5wZXJQYWdlP3RoaXMucHJldihpKTplPDAmJnQ+dGhpcy5jb25maWcudGhyZXNob2xkJiZ0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoPnRoaXMucGVyUGFnZSYmdGhpcy5uZXh0KGkpLHRoaXMuc2xpZGVUb0N1cnJlbnQocnx8bil9fSx7a2V5OlwicmVzaXplSGFuZGxlclwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5yZXNvbHZlU2xpZGVzTnVtYmVyKCksdGhpcy5jdXJyZW50U2xpZGUrdGhpcy5wZXJQYWdlPnRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGgmJih0aGlzLmN1cnJlbnRTbGlkZT10aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoPD10aGlzLnBlclBhZ2U/MDp0aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoLXRoaXMucGVyUGFnZSksdGhpcy5zZWxlY3RvcldpZHRoPXRoaXMuc2VsZWN0b3Iub2Zmc2V0V2lkdGgsdGhpcy5idWlsZFNsaWRlckZyYW1lKCl9fSx7a2V5OlwiY2xlYXJEcmFnXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmRyYWc9e3N0YXJ0WDowLGVuZFg6MCxzdGFydFk6MCxsZXRJdEdvOm51bGwscHJldmVudENsaWNrOnRoaXMuZHJhZy5wcmV2ZW50Q2xpY2t9fX0se2tleTpcInRvdWNoc3RhcnRIYW5kbGVyXCIsdmFsdWU6ZnVuY3Rpb24oZSl7LTEhPT1bXCJURVhUQVJFQVwiLFwiT1BUSU9OXCIsXCJJTlBVVFwiLFwiU0VMRUNUXCJdLmluZGV4T2YoZS50YXJnZXQubm9kZU5hbWUpfHwoZS5zdG9wUHJvcGFnYXRpb24oKSx0aGlzLnBvaW50ZXJEb3duPSEwLHRoaXMuZHJhZy5zdGFydFg9ZS50b3VjaGVzWzBdLnBhZ2VYLHRoaXMuZHJhZy5zdGFydFk9ZS50b3VjaGVzWzBdLnBhZ2VZKX19LHtrZXk6XCJ0b3VjaGVuZEhhbmRsZXJcIix2YWx1ZTpmdW5jdGlvbihlKXtlLnN0b3BQcm9wYWdhdGlvbigpLHRoaXMucG9pbnRlckRvd249ITEsdGhpcy5lbmFibGVUcmFuc2l0aW9uKCksdGhpcy5kcmFnLmVuZFgmJnRoaXMudXBkYXRlQWZ0ZXJEcmFnKCksdGhpcy5jbGVhckRyYWcoKX19LHtrZXk6XCJ0b3VjaG1vdmVIYW5kbGVyXCIsdmFsdWU6ZnVuY3Rpb24oZSl7aWYoZS5zdG9wUHJvcGFnYXRpb24oKSxudWxsPT09dGhpcy5kcmFnLmxldEl0R28mJih0aGlzLmRyYWcubGV0SXRHbz1NYXRoLmFicyh0aGlzLmRyYWcuc3RhcnRZLWUudG91Y2hlc1swXS5wYWdlWSk8TWF0aC5hYnModGhpcy5kcmFnLnN0YXJ0WC1lLnRvdWNoZXNbMF0ucGFnZVgpKSx0aGlzLnBvaW50ZXJEb3duJiZ0aGlzLmRyYWcubGV0SXRHbyl7ZS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuZHJhZy5lbmRYPWUudG91Y2hlc1swXS5wYWdlWCx0aGlzLnNsaWRlckZyYW1lLnN0eWxlLndlYmtpdFRyYW5zaXRpb249XCJhbGwgMG1zIFwiK3RoaXMuY29uZmlnLmVhc2luZyx0aGlzLnNsaWRlckZyYW1lLnN0eWxlLnRyYW5zaXRpb249XCJhbGwgMG1zIFwiK3RoaXMuY29uZmlnLmVhc2luZzt2YXIgdD10aGlzLmNvbmZpZy5sb29wP3RoaXMuY3VycmVudFNsaWRlK3RoaXMucGVyUGFnZTp0aGlzLmN1cnJlbnRTbGlkZSxpPXQqKHRoaXMuc2VsZWN0b3JXaWR0aC90aGlzLnBlclBhZ2UpLHI9dGhpcy5kcmFnLmVuZFgtdGhpcy5kcmFnLnN0YXJ0WCxuPXRoaXMuY29uZmlnLnJ0bD9pK3I6aS1yO3RoaXMuc2xpZGVyRnJhbWUuc3R5bGVbdGhpcy50cmFuc2Zvcm1Qcm9wZXJ0eV09XCJ0cmFuc2xhdGUzZChcIisodGhpcy5jb25maWcucnRsPzE6LTEpKm4rXCJweCwgMCwgMClcIn19fSx7a2V5OlwibW91c2Vkb3duSGFuZGxlclwiLHZhbHVlOmZ1bmN0aW9uKGUpey0xIT09W1wiVEVYVEFSRUFcIixcIk9QVElPTlwiLFwiSU5QVVRcIixcIlNFTEVDVFwiXS5pbmRleE9mKGUudGFyZ2V0Lm5vZGVOYW1lKXx8KGUucHJldmVudERlZmF1bHQoKSxlLnN0b3BQcm9wYWdhdGlvbigpLHRoaXMucG9pbnRlckRvd249ITAsdGhpcy5kcmFnLnN0YXJ0WD1lLnBhZ2VYKX19LHtrZXk6XCJtb3VzZXVwSGFuZGxlclwiLHZhbHVlOmZ1bmN0aW9uKGUpe2Uuc3RvcFByb3BhZ2F0aW9uKCksdGhpcy5wb2ludGVyRG93bj0hMSx0aGlzLnNlbGVjdG9yLnN0eWxlLmN1cnNvcj1cIi13ZWJraXQtZ3JhYlwiLHRoaXMuZW5hYmxlVHJhbnNpdGlvbigpLHRoaXMuZHJhZy5lbmRYJiZ0aGlzLnVwZGF0ZUFmdGVyRHJhZygpLHRoaXMuY2xlYXJEcmFnKCl9fSx7a2V5OlwibW91c2Vtb3ZlSGFuZGxlclwiLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKGUucHJldmVudERlZmF1bHQoKSx0aGlzLnBvaW50ZXJEb3duKXtcIkFcIj09PWUudGFyZ2V0Lm5vZGVOYW1lJiYodGhpcy5kcmFnLnByZXZlbnRDbGljaz0hMCksdGhpcy5kcmFnLmVuZFg9ZS5wYWdlWCx0aGlzLnNlbGVjdG9yLnN0eWxlLmN1cnNvcj1cIi13ZWJraXQtZ3JhYmJpbmdcIix0aGlzLnNsaWRlckZyYW1lLnN0eWxlLndlYmtpdFRyYW5zaXRpb249XCJhbGwgMG1zIFwiK3RoaXMuY29uZmlnLmVhc2luZyx0aGlzLnNsaWRlckZyYW1lLnN0eWxlLnRyYW5zaXRpb249XCJhbGwgMG1zIFwiK3RoaXMuY29uZmlnLmVhc2luZzt2YXIgdD10aGlzLmNvbmZpZy5sb29wP3RoaXMuY3VycmVudFNsaWRlK3RoaXMucGVyUGFnZTp0aGlzLmN1cnJlbnRTbGlkZSxpPXQqKHRoaXMuc2VsZWN0b3JXaWR0aC90aGlzLnBlclBhZ2UpLHI9dGhpcy5kcmFnLmVuZFgtdGhpcy5kcmFnLnN0YXJ0WCxuPXRoaXMuY29uZmlnLnJ0bD9pK3I6aS1yO3RoaXMuc2xpZGVyRnJhbWUuc3R5bGVbdGhpcy50cmFuc2Zvcm1Qcm9wZXJ0eV09XCJ0cmFuc2xhdGUzZChcIisodGhpcy5jb25maWcucnRsPzE6LTEpKm4rXCJweCwgMCwgMClcIn19fSx7a2V5OlwibW91c2VsZWF2ZUhhbmRsZXJcIix2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLnBvaW50ZXJEb3duJiYodGhpcy5wb2ludGVyRG93bj0hMSx0aGlzLnNlbGVjdG9yLnN0eWxlLmN1cnNvcj1cIi13ZWJraXQtZ3JhYlwiLHRoaXMuZHJhZy5lbmRYPWUucGFnZVgsdGhpcy5kcmFnLnByZXZlbnRDbGljaz0hMSx0aGlzLmVuYWJsZVRyYW5zaXRpb24oKSx0aGlzLnVwZGF0ZUFmdGVyRHJhZygpLHRoaXMuY2xlYXJEcmFnKCkpfX0se2tleTpcImNsaWNrSGFuZGxlclwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuZHJhZy5wcmV2ZW50Q2xpY2smJmUucHJldmVudERlZmF1bHQoKSx0aGlzLmRyYWcucHJldmVudENsaWNrPSExfX0se2tleTpcInJlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKGUsdCl7aWYoZTwwfHxlPj10aGlzLmlubmVyRWxlbWVudHMubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkl0ZW0gdG8gcmVtb3ZlIGRvZXNuJ3QgZXhpc3Qg8J+YrVwiKTt2YXIgaT1lPHRoaXMuY3VycmVudFNsaWRlLHI9dGhpcy5jdXJyZW50U2xpZGUrdGhpcy5wZXJQYWdlLTE9PT1lOyhpfHxyKSYmdGhpcy5jdXJyZW50U2xpZGUtLSx0aGlzLmlubmVyRWxlbWVudHMuc3BsaWNlKGUsMSksdGhpcy5idWlsZFNsaWRlckZyYW1lKCksdCYmdC5jYWxsKHRoaXMpfX0se2tleTpcImluc2VydFwiLHZhbHVlOmZ1bmN0aW9uKGUsdCxpKXtpZih0PDB8fHQ+dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aCsxKXRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBpbnNldCBpdCBhdCB0aGlzIGluZGV4IPCfmK1cIik7aWYoLTEhPT10aGlzLmlubmVyRWxlbWVudHMuaW5kZXhPZihlKSl0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc2FtZSBpdGVtIGluIGEgY2Fyb3VzZWw/IFJlYWxseT8gTm9wZSDwn5itXCIpO3ZhciByPXQ8PXRoaXMuY3VycmVudFNsaWRlPjAmJnRoaXMuaW5uZXJFbGVtZW50cy5sZW5ndGg7dGhpcy5jdXJyZW50U2xpZGU9cj90aGlzLmN1cnJlbnRTbGlkZSsxOnRoaXMuY3VycmVudFNsaWRlLHRoaXMuaW5uZXJFbGVtZW50cy5zcGxpY2UodCwwLGUpLHRoaXMuYnVpbGRTbGlkZXJGcmFtZSgpLGkmJmkuY2FsbCh0aGlzKX19LHtrZXk6XCJwcmVwZW5kXCIsdmFsdWU6ZnVuY3Rpb24oZSx0KXt0aGlzLmluc2VydChlLDApLHQmJnQuY2FsbCh0aGlzKX19LHtrZXk6XCJhcHBlbmRcIix2YWx1ZTpmdW5jdGlvbihlLHQpe3RoaXMuaW5zZXJ0KGUsdGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aCsxKSx0JiZ0LmNhbGwodGhpcyl9fSx7a2V5OlwiZGVzdHJveVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0mJmFyZ3VtZW50c1swXSx0PWFyZ3VtZW50c1sxXTtpZih0aGlzLmRldGFjaEV2ZW50cygpLHRoaXMuc2VsZWN0b3Iuc3R5bGUuY3Vyc29yPVwiYXV0b1wiLGUpe2Zvcih2YXIgaT1kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkscj0wO3I8dGhpcy5pbm5lckVsZW1lbnRzLmxlbmd0aDtyKyspaS5hcHBlbmRDaGlsZCh0aGlzLmlubmVyRWxlbWVudHNbcl0pO3RoaXMuc2VsZWN0b3IuaW5uZXJIVE1MPVwiXCIsdGhpcy5zZWxlY3Rvci5hcHBlbmRDaGlsZChpKSx0aGlzLnNlbGVjdG9yLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpfXQmJnQuY2FsbCh0aGlzKX19XSxbe2tleTpcIm1lcmdlU2V0dGluZ3NcIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD17c2VsZWN0b3I6XCIuc2llbWFcIixkdXJhdGlvbjoyMDAsZWFzaW5nOlwiZWFzZS1vdXRcIixwZXJQYWdlOjEsc3RhcnRJbmRleDowLGRyYWdnYWJsZTohMCxtdWx0aXBsZURyYWc6ITAsdGhyZXNob2xkOjIwLGxvb3A6ITEscnRsOiExLG9uSW5pdDpmdW5jdGlvbigpe30sb25DaGFuZ2U6ZnVuY3Rpb24oKXt9fSxpPWU7Zm9yKHZhciByIGluIGkpdFtyXT1pW3JdO3JldHVybiB0fX0se2tleTpcIndlYmtpdE9yTm90XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnRyYW5zZm9ybT9cInRyYW5zZm9ybVwiOlwiV2Via2l0VHJhbnNmb3JtXCJ9fV0pLGV9KCk7dC5kZWZhdWx0PWwsZS5leHBvcnRzPXQuZGVmYXVsdH1dKX0pOyIsImV4cG9ydCBmdW5jdGlvbiBidG5TdWNjZXNzT25TdWJtaXQoKSB7XG4gIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdEJ1dHRvblwiKTtcbiAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi1wcmltYXJ5Jyk7XG4gIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4tc3VjY2VzcycpO1xuICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgYnV0dG9uLmlubmVySFRNTCA9ICdFcmxlZGlndCEnO1xufTtcbiIsIi8vcG9zdERhdGEoYGh0dHA6Ly9leGFtcGxlLmNvbS9hbnN3ZXJgLCB7YW5zd2VyOiA0Mn0pXG4vLyAgLnRoZW4oZGF0YSA9PiBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSkpIC8vIEpTT04tc3RyaW5nIGZyb20gYHJlc3BvbnNlLmpzb24oKWAgY2FsbFxuLy8gIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVEYXRhKHVybCA9IGBgKSB7XG4gIC8vIERlZmF1bHQgb3B0aW9ucyBhcmUgbWFya2VkIHdpdGggKlxuICAgIHJldHVybiBmZXRjaCh1cmwsIHtcbiAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLCAvLyAqR0VULCBQT1NULCBQVVQsIERFTEVURSwgZXRjLlxuICAgICAgICBtb2RlOiBcImNvcnNcIiwgLy8gbm8tY29ycywgY29ycywgKnNhbWUtb3JpZ2luXG4gICAgICAgIGNhY2hlOiBcIm5vLWNhY2hlXCIsIC8vICpkZWZhdWx0LCBuby1jYWNoZSwgcmVsb2FkLCBmb3JjZS1jYWNoZSwgb25seS1pZi1jYWNoZWRcbiAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgLy8gaW5jbHVkZSwgKnNhbWUtb3JpZ2luLCBvbWl0XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIC8vIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZGlyZWN0OiBcImZvbGxvd1wiLCAvLyBtYW51YWwsICpmb2xsb3csIGVycm9yXG4gICAgICAgIHJlZmVycmVyOiBcIm5vLXJlZmVycmVyXCIsIC8vIG5vLXJlZmVycmVyLCAqY2xpZW50XG4gICAgfSlcbiAgICAudGhlbigoKSA9PiBsb2NhdGlvbi5yZWxvYWQodHJ1ZSkpOyAvLyBwYXJzZXMgcmVzcG9uc2UgdG8gSlNPTlxufVxuIiwiLyogVmlldyBpbiBmdWxsc2NyZWVuICovXG5leHBvcnQgZnVuY3Rpb24gb3BlbkZ1bGxzY3JlZW4oZWxlbSkge1xuICBpZiAoZWxlbS5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgIGVsZW0ucmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgfSBlbHNlIGlmIChlbGVtLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7IC8qIEZpcmVmb3ggKi9cbiAgICBlbGVtLm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoZWxlbS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikgeyAvKiBDaHJvbWUsIFNhZmFyaSBhbmQgT3BlcmEgKi9cbiAgICBlbGVtLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoZWxlbS5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7IC8qIElFL0VkZ2UgKi9cbiAgICBlbGVtLm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgfVxufVxuXG4vKiBDbG9zZSBmdWxsc2NyZWVuICovXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VGdWxsc2NyZWVuKCkge1xuICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHsgLyogRmlyZWZveCAqL1xuICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgfSBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbikgeyAvKiBDaHJvbWUsIFNhZmFyaSBhbmQgT3BlcmEgKi9cbiAgICBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4pIHsgLyogSUUvRWRnZSAqL1xuICAgIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4oKTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFjdGlvblVSTCgpIHtcbiAgdmFyIGFjY2Vzc0NvZGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWNjZXNzQ29kZUlucHV0XCIpO1xuICB2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50ZXJBbGJ1bUZvcm1cIik7XG4gIGZvcm0uYWN0aW9uID0gXCIvYWxidW0vXCIgKyBhY2Nlc3NDb2RlSW5wdXQudmFsdWU7XG59O1xuIiwiaW1wb3J0IERyb3B6b25lIGZyb20gJ2Ryb3B6b25lJ1xuaW1wb3J0IFNpZW1hIGZyb20gJ3NpZW1hJ1xuaW1wb3J0IHsgYnRuU3VjY2Vzc09uU3VibWl0IH0gZnJvbSBcIi4vYnRuX3N1Y2Nlc3Nfb25fc3VibWl0XCI7XG5pbXBvcnQgeyBkZWxldGVEYXRhIH0gZnJvbSBcIi4vZGVsZXRlX3JlcXVlc3RcIjtcbmltcG9ydCB7IG9wZW5GdWxsc2NyZWVuLCBjbG9zZUZ1bGxzY3JlZW4gfSBmcm9tIFwiLi9mdWxsc2NyZWVuXCI7XG5pbXBvcnQgeyBjcmVhdGVBY3Rpb25VUkwgfSBmcm9tIFwiLi9jcmVhdGVfYWN0aW9uX3VybFwiO1xuXG53aW5kb3cuZGVsZXRlRGF0YSA9IGRlbGV0ZURhdGFcbndpbmRvdy5vcGVuRnVsbHNjcmVlbiA9IG9wZW5GdWxsc2NyZWVuXG53aW5kb3cuY2xvc2VGdWxsc2NyZWVuID0gY2xvc2VGdWxsc2NyZWVuXG53aW5kb3cuY3JlYXRlQWN0aW9uVVJMID0gY3JlYXRlQWN0aW9uVVJMXG53aW5kb3cuU2llbWEgPSBTaWVtYVxuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhhc1N1Ym1pdEJ1dHRvblwiKS5mb3JFYWNoKChmb3JtKSA9PiB7XG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBidG5TdWNjZXNzT25TdWJtaXQpO1xufSk7XG5cbkRyb3B6b25lLm9wdGlvbnMucGFydHlVcGxvYWQgPSB7XG4gIGFjY2VwdGVkRmlsZXM6ICdpbWFnZS8qJyxcbiAgbWF4RmlsZXNpemU6IDcsXG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMub24oXCJzZW5kaW5nXCIsIGZ1bmN0aW9uKGZpbGUsIHhociwgZm9ybURhdGEpe1xuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiYWxidW1pZFwiLCBcImxvcmVtaXBzdW1cIik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbn07XG4iXSwibmFtZXMiOlsidGhpcyIsIkRyb3B6b25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBLElBQUksWUFBWSxHQUFHLFlBQVksRUFBRSxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksT0FBTyxJQUFJLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxVQUFVLFdBQVcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBVyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sV0FBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7QUFFcGpCLFNBQVMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLElBQUksY0FBYyxDQUFDLDJEQUEyRCxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxLQUFLLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7O0FBRWhQLFNBQVMsU0FBUyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRSxJQUFJLE9BQU8sVUFBVSxLQUFLLFVBQVUsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywwREFBMEQsR0FBRyxPQUFPLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLEVBQUUsTUFBTSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsR0FBRyxRQUFRLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxFQUFFOztBQUU5ZSxTQUFTLGVBQWUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsWUFBWSxXQUFXLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxFQUFFLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0N6SixJQUFJLE9BQU8sR0FBRyxZQUFZO0VBQ3hCLFNBQVMsT0FBTyxHQUFHO0lBQ2pCLGVBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDaEM7O0VBRUQsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JCLEdBQUcsRUFBRSxJQUFJOzs7SUFHVCxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtNQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDOztNQUV4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUM3QjtNQUNELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ2hDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLE1BQU07SUFDWCxLQUFLLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO01BQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7TUFDeEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7TUFFdkMsSUFBSSxTQUFTLEVBQUU7UUFDYixLQUFLLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1VBQ3RHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xDOztRQUVELEtBQUssSUFBSSxTQUFTLEdBQUcsU0FBUyxFQUFFLFFBQVEsR0FBRyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsUUFBUSxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7VUFDMUgsSUFBSSxJQUFJLENBQUM7O1VBRVQsQUFBYztZQUNaLElBQUksRUFBRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTTtZQUNsQyxJQUFJLEdBQUcsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7V0FDeEIsQUFJQTs7VUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7O1VBRXBCLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzVCO09BQ0Y7O01BRUQsT0FBTyxJQUFJLENBQUM7S0FDYjs7Ozs7O0dBTUYsRUFBRTtJQUNELEdBQUcsRUFBRSxLQUFLO0lBQ1YsS0FBSyxFQUFFLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7TUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7T0FDYjs7O01BR0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN2QyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsT0FBTyxJQUFJLENBQUM7T0FDYjs7O01BR0QsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMxQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsT0FBTyxJQUFJLENBQUM7T0FDYjs7O01BR0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekMsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTtVQUNuQixTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztVQUN2QixNQUFNO1NBQ1A7T0FDRjs7TUFFRCxPQUFPLElBQUksQ0FBQztLQUNiO0dBQ0YsQ0FBQyxDQUFDLENBQUM7O0VBRUosT0FBTyxPQUFPLENBQUM7Q0FDaEIsRUFBRSxDQUFDOztBQUVKLElBQUksUUFBUSxHQUFHLFVBQVUsUUFBUSxFQUFFO0VBQ2pDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7O0VBRTlCLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDNUIsR0FBRyxFQUFFLFdBQVc7SUFDaEIsS0FBSyxFQUFFLFNBQVMsU0FBUyxHQUFHOzs7TUFHMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7O01BT2pDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFFLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7O01BRTFiLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHOzs7Ozs7O1FBTzlCLEdBQUcsRUFBRSxJQUFJOzs7Ozs7UUFNVCxNQUFNLEVBQUUsTUFBTTs7Ozs7UUFLZCxlQUFlLEVBQUUsS0FBSzs7Ozs7UUFLdEIsT0FBTyxFQUFFLEtBQUs7Ozs7OztRQU1kLGVBQWUsRUFBRSxDQUFDOzs7Ozs7Ozs7UUFTbEIsY0FBYyxFQUFFLEtBQUs7Ozs7Ozs7O1FBUXJCLFFBQVEsRUFBRSxLQUFLOzs7Ozs7O1FBT2YsYUFBYSxFQUFFLEtBQUs7Ozs7O1FBS3BCLFNBQVMsRUFBRSxPQUFPOzs7OztRQUtsQixvQkFBb0IsRUFBRSxLQUFLOzs7OztRQUszQixXQUFXLEVBQUUsS0FBSzs7Ozs7UUFLbEIsZ0JBQWdCLEVBQUUsQ0FBQzs7Ozs7OztRQU9uQixXQUFXLEVBQUUsR0FBRzs7Ozs7OztRQU9oQixTQUFTLEVBQUUsTUFBTTs7Ozs7UUFLakIscUJBQXFCLEVBQUUsSUFBSTs7Ozs7UUFLM0Isb0JBQW9CLEVBQUUsRUFBRTs7Ozs7UUFLeEIsY0FBYyxFQUFFLEdBQUc7Ozs7O1FBS25CLGVBQWUsRUFBRSxHQUFHOzs7Ozs7UUFNcEIsZUFBZSxFQUFFLE1BQU07Ozs7Ozs7Ozs7UUFVdkIsV0FBVyxFQUFFLElBQUk7Ozs7O1FBS2pCLFlBQVksRUFBRSxJQUFJOzs7Ozs7O1FBT2xCLGNBQWMsRUFBRSxJQUFJOzs7OztRQUtwQixhQUFhLEVBQUUsR0FBRzs7Ozs7O1FBTWxCLFlBQVksRUFBRSxTQUFTOzs7Ozs7OztRQVF2QixZQUFZLEVBQUUsSUFBSTs7Ozs7UUFLbEIsUUFBUSxFQUFFLElBQUk7Ozs7OztRQU1kLE9BQU8sRUFBRSxJQUFJOzs7Ozs7Ozs7O1FBVWIsU0FBUyxFQUFFLElBQUk7Ozs7O1FBS2YsaUJBQWlCLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7OztRQWF2QixhQUFhLEVBQUUsSUFBSTs7Ozs7O1FBTW5CLGlCQUFpQixFQUFFLElBQUk7Ozs7Ozs7Ozs7OztRQVl2QixnQkFBZ0IsRUFBRSxJQUFJOzs7Ozs7UUFNdEIsU0FBUyxFQUFFLElBQUk7Ozs7Ozs7UUFPZixjQUFjLEVBQUUsS0FBSzs7Ozs7Ozs7UUFRckIsaUJBQWlCLEVBQUUsSUFBSTs7Ozs7Ozs7O1FBU3ZCLG9CQUFvQixFQUFFLE1BQU07Ozs7Ozs7Ozs7UUFVNUIsT0FBTyxFQUFFLElBQUk7Ozs7O1FBS2IsY0FBYyxFQUFFLElBQUk7Ozs7Ozs7UUFPcEIsVUFBVSxFQUFFLElBQUk7Ozs7Ozs7O1FBUWhCLGFBQWEsRUFBRSxLQUFLOzs7OztRQUtwQixrQkFBa0IsRUFBRSwyQkFBMkI7Ozs7O1FBSy9DLG1CQUFtQixFQUFFLHlEQUF5RDs7Ozs7OztRQU85RSxnQkFBZ0IsRUFBRSxpRkFBaUY7Ozs7OztRQU1uRyxjQUFjLEVBQUUsc0VBQXNFOzs7OztRQUt0RixtQkFBbUIsRUFBRSxzQ0FBc0M7Ozs7OztRQU0zRCxpQkFBaUIsRUFBRSw0Q0FBNEM7Ozs7O1FBSy9ELGdCQUFnQixFQUFFLGVBQWU7Ozs7O1FBS2pDLGtCQUFrQixFQUFFLGtCQUFrQjs7Ozs7UUFLdEMsNEJBQTRCLEVBQUUsOENBQThDOzs7OztRQUs1RSxjQUFjLEVBQUUsYUFBYTs7Ozs7UUFLN0IsMEJBQTBCLEVBQUUsSUFBSTs7Ozs7O1FBTWhDLG9CQUFvQixFQUFFLG9DQUFvQzs7Ozs7O1FBTTFELGlCQUFpQixFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFOzs7OztRQUtyRSxJQUFJLEVBQUUsU0FBUyxJQUFJLEdBQUcsRUFBRTs7Ozs7Ozs7Ozs7OztRQWF4QixNQUFNLEVBQUUsU0FBUyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7VUFDekMsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPO2NBQ0wsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7Y0FDOUIsWUFBWSxFQUFFLEtBQUssQ0FBQyxLQUFLO2NBQ3pCLGVBQWUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7Y0FDaEMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUztjQUNuQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlO2NBQ3BELGlCQUFpQixFQUFFLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2FBQ3hELENBQUM7V0FDSDtTQUNGOzs7Ozs7Ozs7Ozs7UUFZRCxNQUFNLEVBQUUsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtVQUNsQyxPQUFPLElBQUksRUFBRSxDQUFDO1NBQ2Y7Ozs7Ozs7OztRQVNELGNBQWMsRUFBRSxTQUFTLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO1VBQ2xELElBQUksRUFBRSxDQUFDO1NBQ1I7Ozs7Ozs7UUFPRCxRQUFRLEVBQUUsU0FBUyxRQUFRLEdBQUc7O1VBRTVCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQyxDQUFDO1VBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLDJCQUEyQixDQUFDOztVQUU5RSxLQUFLLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxHQUFHLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLFVBQVUsR0FBRyxTQUFTLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtZQUNoSyxJQUFJLEtBQUssQ0FBQzs7WUFFVixBQUFlO2NBQ2IsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNO2NBQ3BDLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUMzQixBQUlBOztZQUVELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQzs7WUFFbEIsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2NBQ2hELGNBQWMsR0FBRyxLQUFLLENBQUM7Y0FDdkIsS0FBSyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7Y0FDL0IsTUFBTTthQUNQO1dBQ0Y7VUFDRCxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ25CLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLCtDQUErQyxDQUFDLENBQUM7WUFDekYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7V0FDMUM7O1VBRUQsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQzFELElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtjQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7YUFDckQsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO2NBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzthQUNuRDtXQUNGOztVQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7U0FDekQ7Ozs7Ozs7Ozs7Ozs7OztRQWVELE1BQU0sRUFBRSxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUU7VUFDekQsSUFBSSxJQUFJLEdBQUc7WUFDVCxJQUFJLEVBQUUsQ0FBQztZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ3BCLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTTtXQUN2QixDQUFDOztVQUVGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O1VBR3hDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ25DLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3RCLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1dBQ3pCLE1BQU0sSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ3hCLEtBQUssR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO1dBQzNCLE1BQU0sSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ3pCLE1BQU0sR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDO1dBQzNCOzs7VUFHRCxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1VBQ3ZDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O1VBRTFDLElBQUksUUFBUSxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUM7O1VBRTlCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLEVBQUU7O1lBRXBELElBQUksWUFBWSxLQUFLLE1BQU0sRUFBRTtjQUMzQixJQUFJLFFBQVEsR0FBRyxRQUFRLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztlQUMzQyxNQUFNO2dCQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztlQUMzQzthQUNGLE1BQU0sSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFOztjQUVyQyxJQUFJLFFBQVEsR0FBRyxRQUFRLEVBQUU7Z0JBQ3ZCLE1BQU0sR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDO2VBQzNCLE1BQU07Z0JBQ0wsS0FBSyxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7ZUFDM0I7YUFDRixNQUFNO2NBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxZQUFZLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFDaEU7V0FDRjs7VUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztVQUM3QyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQzs7VUFFL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7VUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7O1VBRXhCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7Ozs7Ozs7Ozs7OztRQVlELGFBQWEsRUFBRSxTQUFTLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO1VBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN6RixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1dBQ3JILE1BQU07WUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNuQjtTQUNGOzs7Ozs7Ozs7Ozs7Ozs7OztRQWlCRCxlQUFlLEVBQUUsb3NHQUFvc0c7Ozs7Ozs7Ozs7Ozs7Ozs7UUFnQnJ0RyxJQUFJLEVBQUUsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFO1VBQ3JCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsU0FBUyxFQUFFLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ25DLE9BQU8sRUFBRSxTQUFTLE9BQU8sQ0FBQyxDQUFDLEVBQUU7VUFDM0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDdkQ7UUFDRCxTQUFTLEVBQUUsU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFO1VBQy9CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsUUFBUSxFQUFFLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtVQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNwRDtRQUNELFNBQVMsRUFBRSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7VUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDdkQ7UUFDRCxLQUFLLEVBQUUsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUU7Ozs7O1FBSzNCLEtBQUssRUFBRSxTQUFTLEtBQUssR0FBRztVQUN0QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNwRDs7Ozs7UUFLRCxTQUFTLEVBQUUsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO1VBQ2xDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7VUFFbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7V0FDMUM7O1VBRUQsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDbEYsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDOztZQUUzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN4RCxLQUFLLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLFNBQVMsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO2NBQzlLLElBQUksS0FBSyxDQUFDOztjQUVWLEFBQWU7Z0JBQ2IsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNO2dCQUNwQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7ZUFDM0IsQUFJQTs7Y0FFRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7O2NBRWpCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzthQUM5QjtZQUNELEtBQUssSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFNBQVMsR0FBRyxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsU0FBUyxHQUFHLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7Y0FDOUssQUFBZTtnQkFDYixJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU07Z0JBQ3BDLElBQUksR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztlQUMxQixBQUlBOztjQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0M7O1lBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTtjQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsdUVBQXVFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLENBQUM7Y0FDMUosSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ25EOztZQUVELElBQUksZUFBZSxHQUFHLFNBQVMsZUFBZSxDQUFDLENBQUMsRUFBRTtjQUNoRCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7Y0FDbkIsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO2NBQ3BCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsU0FBUyxFQUFFO2dCQUN0QyxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSxZQUFZO2tCQUMvRSxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hDLENBQUMsQ0FBQztlQUNKLE1BQU07Z0JBQ0wsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLDBCQUEwQixFQUFFO2tCQUM3QyxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxZQUFZO29CQUM3RSxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7bUJBQ2hDLENBQUMsQ0FBQztpQkFDSixNQUFNO2tCQUNMLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDaEM7ZUFDRjthQUNGLENBQUM7O1lBRUYsS0FBSyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLEVBQUUsU0FBUyxHQUFHLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLFVBQVUsR0FBRyxTQUFTLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtjQUNoTCxJQUFJLEtBQUssQ0FBQzs7Y0FFVixBQUFlO2dCQUNiLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTTtnQkFDcEMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2VBQzNCLEFBSUE7O2NBRUQsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDOztjQUV2QixVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2FBQ3ZEO1dBQ0Y7U0FDRjs7OztRQUlELFdBQVcsRUFBRSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7VUFDdEMsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDekUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztXQUNqRTtVQUNELE9BQU8sSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7U0FDM0M7Ozs7O1FBS0QsU0FBUyxFQUFFLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7VUFDM0MsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3hELEtBQUssSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLFNBQVMsR0FBRyxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsU0FBUyxHQUFHLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7Y0FDbkwsSUFBSSxLQUFLLENBQUM7O2NBRVYsQUFBZTtnQkFDYixJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU07Z0JBQ3BDLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztlQUMzQixBQUlBOztjQUVELElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDOztjQUU3QixnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztjQUNqQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO2FBQ2hDOztZQUVELE9BQU8sVUFBVSxDQUFDLFlBQVk7Y0FDNUIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQzthQUM5RCxFQUFFLENBQUMsQ0FBQyxDQUFDO1dBQ1A7U0FDRjs7Ozs7UUFLRCxLQUFLLEVBQUUsU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtVQUNuQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Y0FDaEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7YUFDekI7WUFDRCxLQUFLLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUMsRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLFNBQVMsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO2NBQ3RMLElBQUksS0FBSyxDQUFDOztjQUVWLEFBQWU7Z0JBQ2IsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNO2dCQUNwQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7ZUFDM0IsQUFJQTs7Y0FFRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7O2NBRWpCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO2FBQzVCO1dBQ0Y7U0FDRjtRQUNELGFBQWEsRUFBRSxTQUFTLGFBQWEsR0FBRyxFQUFFOzs7Ozs7UUFNMUMsVUFBVSxFQUFFLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtVQUNwQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ25ELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtjQUNwQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7YUFDbkU7V0FDRjtTQUNGO1FBQ0Qsa0JBQWtCLEVBQUUsU0FBUyxrQkFBa0IsR0FBRyxFQUFFOzs7Ozs7UUFNcEQsY0FBYyxFQUFFLFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFO1VBQ2pFLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixLQUFLLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUMsRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLFNBQVMsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO2NBQ3hMLElBQUksS0FBSyxDQUFDOztjQUVWLEFBQWU7Z0JBQ2IsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNO2dCQUNwQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7ZUFDM0IsQUFJQTs7Y0FFRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7O2NBRWpCLElBQUksQ0FBQyxRQUFRLEtBQUssVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUM7YUFDMUY7V0FDRjtTQUNGOzs7OztRQUtELG1CQUFtQixFQUFFLFNBQVMsbUJBQW1CLEdBQUcsRUFBRTs7Ozs7O1FBTXRELE9BQU8sRUFBRSxTQUFTLE9BQU8sR0FBRyxFQUFFO1FBQzlCLGVBQWUsRUFBRSxTQUFTLGVBQWUsR0FBRyxFQUFFOzs7OztRQUs5QyxPQUFPLEVBQUUsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFO1VBQzlCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztXQUN4RDtTQUNGO1FBQ0QsZUFBZSxFQUFFLFNBQVMsZUFBZSxHQUFHLEVBQUU7Ozs7UUFJOUMsUUFBUSxFQUFFLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtVQUNoQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDbEU7UUFDRCxnQkFBZ0IsRUFBRSxTQUFTLGdCQUFnQixHQUFHLEVBQUU7Ozs7O1FBS2hELFFBQVEsRUFBRSxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUU7VUFDaEMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1dBQzFEO1VBQ0QsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1dBQ3pEO1NBQ0Y7UUFDRCxnQkFBZ0IsRUFBRSxTQUFTLGdCQUFnQixHQUFHLEVBQUU7UUFDaEQsZ0JBQWdCLEVBQUUsU0FBUyxnQkFBZ0IsR0FBRyxFQUFFO1FBQ2hELGVBQWUsRUFBRSxTQUFTLGVBQWUsR0FBRyxFQUFFO1FBQzlDLGFBQWEsRUFBRSxTQUFTLGFBQWEsR0FBRyxFQUFFO1FBQzFDLFVBQVUsRUFBRSxTQUFTLFVBQVUsR0FBRyxFQUFFO09BQ3JDLENBQUM7O01BRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO01BQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO0tBQzdDOzs7O0dBSUYsRUFBRTtJQUNELEdBQUcsRUFBRSxRQUFRO0lBQ2IsS0FBSyxFQUFFLFNBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRTtNQUM3QixLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2hILE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3ZDOztNQUVELEtBQUssSUFBSSxVQUFVLEdBQUcsT0FBTyxFQUFFLFNBQVMsR0FBRyxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsU0FBUyxHQUFHLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7UUFDL0gsSUFBSSxLQUFLLENBQUM7O1FBRVYsQUFBZTtVQUNiLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTTtVQUNwQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDM0IsQUFJQTs7UUFFRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7O1FBRW5CLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO1VBQ3RCLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQ25CO09BQ0Y7TUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0dBQ0YsQ0FBQyxDQUFDLENBQUM7O0VBRUosU0FBUyxRQUFRLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtJQUM3QixlQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztJQUVoQyxJQUFJLEtBQUssR0FBRywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0lBRWpILElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDbEIsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0lBRW5CLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQzs7SUFFakMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQzs7SUFFaEcsS0FBSyxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUM3QixLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUNyQixLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7SUFFakIsSUFBSSxPQUFPLEtBQUssQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO01BQ3JDLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDdkQ7OztJQUdELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtNQUNwRCxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FDOUM7O0lBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtNQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7S0FDL0M7OztJQUdELFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7SUFHL0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDOztJQUUvQixJQUFJLGNBQWMsR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztJQUU1RixLQUFLLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLE9BQU8sSUFBSSxJQUFJLEdBQUcsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDOzs7SUFHMUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO01BQ2pFLElBQUksSUFBSSxDQUFDOztNQUVULE9BQU8sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSwwQkFBMEIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDM0Y7OztJQUdELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFO01BQzdCLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzFEOztJQUVELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtNQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDckM7O0lBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO01BQ2xFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0dBQW9HLENBQUMsQ0FBQztLQUN2SDs7SUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO01BQzFELE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztLQUN0RTs7O0lBR0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO01BQ25DLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7TUFDOUQsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0tBQ3hDOzs7SUFHRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxJQUFJLElBQUksRUFBRTtNQUN4QyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLElBQUksRUFBRTtRQUN6QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNsRSxDQUFDO0tBQ0g7O0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7O0lBRTFELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEtBQUssUUFBUSxDQUFDLFVBQVUsRUFBRTs7TUFFbkUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDM0M7OztJQUdELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsS0FBSyxLQUFLLEVBQUU7TUFDN0MsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1FBQ25DLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztPQUNyRyxNQUFNO1FBQ0wsS0FBSyxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7T0FDekM7S0FDRjs7SUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO01BQzNCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO1FBQ3BDLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUMzQyxNQUFNO1FBQ0wsS0FBSyxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7T0FDdEY7S0FDRjs7SUFFRCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixPQUFPLEtBQUssQ0FBQztHQUNkOzs7OztFQUtELFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QixHQUFHLEVBQUUsa0JBQWtCO0lBQ3ZCLEtBQUssRUFBRSxTQUFTLGdCQUFnQixHQUFHO01BQ2pDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDdkMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO09BQ3RCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDckIsT0FBTyxJQUFJLENBQUM7T0FDYixDQUFDLENBQUM7S0FDSjs7Ozs7R0FLRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGtCQUFrQjtJQUN2QixLQUFLLEVBQUUsU0FBUyxnQkFBZ0IsR0FBRztNQUNqQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO09BQ3ZCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDckIsT0FBTyxJQUFJLENBQUM7T0FDYixDQUFDLENBQUM7S0FDSjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsb0JBQW9CO0lBQ3pCLEtBQUssRUFBRSxTQUFTLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtNQUN6QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUM7T0FDL0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksRUFBRTtRQUNyQixPQUFPLElBQUksQ0FBQztPQUNiLENBQUMsQ0FBQztLQUNKOzs7O0dBSUYsRUFBRTtJQUNELEdBQUcsRUFBRSxnQkFBZ0I7SUFDckIsS0FBSyxFQUFFLFNBQVMsY0FBYyxHQUFHO01BQy9CLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqRDtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsbUJBQW1CO0lBQ3hCLEtBQUssRUFBRSxTQUFTLGlCQUFpQixHQUFHO01BQ2xDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNwRDtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsZUFBZTtJQUNwQixLQUFLLEVBQUUsU0FBUyxhQUFhLEdBQUc7TUFDOUIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hEOzs7O0dBSUYsRUFBRTtJQUNELEdBQUcsRUFBRSxnQkFBZ0I7SUFDckIsS0FBSyxFQUFFLFNBQVMsY0FBYyxHQUFHO01BQy9CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDdkMsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxDQUFDO09BQzlFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDckIsT0FBTyxJQUFJLENBQUM7T0FDYixDQUFDLENBQUM7S0FDSjs7Ozs7R0FLRixFQUFFO0lBQ0QsR0FBRyxFQUFFLE1BQU07SUFDWCxLQUFLLEVBQUUsU0FBUyxJQUFJLEdBQUc7TUFDckIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7TUFHbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLENBQUM7T0FDN0Q7O01BRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsRUFBRTtRQUM3RixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLDZDQUE2QyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQztPQUNySjs7TUFFRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7UUFDakMsSUFBSSxvQkFBb0IsR0FBRyxTQUFTLG9CQUFvQixHQUFHO1VBQ3pELElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRTtZQUMxQixNQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1dBQ3ZFO1VBQ0QsTUFBTSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1VBQ3pELE1BQU0sQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztVQUNwRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDbkUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1dBQzdEO1VBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7O1VBRXJELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1dBQzdFO1VBQ0QsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFDbkMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7V0FDeEU7Ozs7VUFJRCxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1VBQ25ELE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7VUFDbkQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztVQUN2QyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1VBQ3hDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7VUFDMUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztVQUN6QyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1VBQ3JILE9BQU8sTUFBTSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBWTtZQUNuRSxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQzs7WUFFekMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2NBQ2hCLEtBQUssSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7Z0JBQ3BJLElBQUksS0FBSyxDQUFDOztnQkFFVixBQUFnQjtrQkFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07a0JBQ3RDLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztpQkFDN0IsQUFJQTs7Z0JBRUQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDOztnQkFFakIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztlQUN0QjthQUNGO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDakMsT0FBTyxvQkFBb0IsRUFBRSxDQUFDO1dBQy9CLENBQUMsQ0FBQztTQUNKLENBQUM7UUFDRixvQkFBb0IsRUFBRSxDQUFDO09BQ3hCOztNQUVELElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDOzs7OztNQUsvRCxLQUFLLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtRQUMxSSxJQUFJLE1BQU0sQ0FBQzs7UUFFWCxBQUFnQjtVQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtVQUN0QyxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7U0FDOUIsQUFJQTs7UUFFRCxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUM7O1FBRXZCLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztPQUM3Qzs7TUFFRCxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQVk7UUFDcEMsT0FBTyxNQUFNLENBQUMseUJBQXlCLEVBQUUsQ0FBQztPQUMzQyxDQUFDLENBQUM7O01BRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsWUFBWTtRQUNqQyxPQUFPLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO09BQzNDLENBQUMsQ0FBQzs7TUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtRQUNsQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ3RDLENBQUMsQ0FBQzs7O01BR0gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxJQUFJLEVBQUU7UUFDbEMsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOztVQUUxSCxPQUFPLFVBQVUsQ0FBQyxZQUFZO1lBQzVCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztXQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ1A7T0FDRixDQUFDLENBQUM7O01BRUgsSUFBSSxhQUFhLEdBQUcsU0FBUyxhQUFhLENBQUMsQ0FBQyxFQUFFO1FBQzVDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUU7VUFDcEIsT0FBTyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDM0IsTUFBTTtVQUNMLE9BQU8sQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDOUI7T0FDRixDQUFDOzs7TUFHRixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUM7UUFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1FBQ3JCLE1BQU0sRUFBRTtVQUNOLFdBQVcsRUFBRSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7WUFDakMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztXQUNwQztVQUNELFdBQVcsRUFBRSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7WUFDakMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7V0FDcEM7VUFDRCxVQUFVLEVBQUUsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFOzs7O1lBSS9CLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ2xCLElBQUk7Y0FDRixJQUFJLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7YUFDckMsQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFO1lBQ2xCLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sS0FBSyxJQUFJLElBQUksVUFBVSxLQUFLLElBQUksR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDOztZQUVyRixhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztXQUNuQztVQUNELFdBQVcsRUFBRSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7WUFDakMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztXQUNwQztVQUNELE1BQU0sRUFBRSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDdkIsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUN2QjtVQUNELFNBQVMsRUFBRSxTQUFTLE9BQU8sQ0FBQyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztXQUNsQzs7Ozs7O1NBTUYsRUFBRSxDQUFDLENBQUM7O01BRVAsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLGdCQUFnQixFQUFFO1FBQ3pELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7VUFDM0IsT0FBTyxFQUFFLGdCQUFnQjtVQUN6QixNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUsU0FBUyxLQUFLLENBQUMsR0FBRyxFQUFFOztjQUUzQixJQUFJLGdCQUFnQixLQUFLLE1BQU0sQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFO2dCQUMzSixNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO2VBQ2hDO2NBQ0QsT0FBTyxJQUFJLENBQUM7YUFDYjtXQUNGO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDOztNQUVILElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7TUFFZCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyQzs7OztHQUlGLEVBQUU7SUFDRCxHQUFHLEVBQUUsU0FBUztJQUNkLEtBQUssRUFBRSxTQUFTLE9BQU8sR0FBRztNQUN4QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7TUFDZixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO01BQzFCLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEdBQUcsU0FBUyxFQUFFO1FBQzlFLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7T0FDN0I7TUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO01BQzdCLE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdkU7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLDJCQUEyQjtJQUNoQyxLQUFLLEVBQUUsU0FBUyx5QkFBeUIsR0FBRztNQUMxQyxJQUFJLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxDQUFDO01BQ2pDLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztNQUN2QixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7O01BRW5CLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7TUFFeEMsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFO1FBQ3RCLEtBQUssSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7VUFDcEosSUFBSSxNQUFNLENBQUM7O1VBRVgsQUFBZ0I7WUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07WUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1dBQzlCLEFBSUE7O1VBRUQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDOztVQUVsQixjQUFjLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7VUFDeEMsVUFBVSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ2pDO1FBQ0QsbUJBQW1CLEdBQUcsR0FBRyxHQUFHLGNBQWMsR0FBRyxVQUFVLENBQUM7T0FDekQsTUFBTTtRQUNMLG1CQUFtQixHQUFHLEdBQUcsQ0FBQztPQUMzQjs7TUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQzFGOzs7OztHQUtGLEVBQUU7SUFDRCxHQUFHLEVBQUUsZUFBZTtJQUNwQixLQUFLLEVBQUUsU0FBUyxhQUFhLENBQUMsQ0FBQyxFQUFFO01BQy9CLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7UUFDaEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNsQyxNQUFNO1FBQ0wsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7T0FDekY7S0FDRjs7Ozs7R0FLRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGFBQWE7SUFDbEIsS0FBSyxFQUFFLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtNQUNoQyxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO1FBQ2pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztPQUNsQjtNQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEM7Ozs7Ozs7R0FPRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGlCQUFpQjtJQUN0QixLQUFLLEVBQUUsU0FBUyxlQUFlLEdBQUc7TUFDaEMsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7VUFDekIsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO01BQ2xCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUU7UUFDakQsT0FBTyxnQkFBZ0IsQ0FBQztPQUN6Qjs7TUFFRCxJQUFJLFlBQVksR0FBRyw2QkFBNkIsQ0FBQztNQUNqRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7UUFDakMsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztPQUNoRTtNQUNELFlBQVksSUFBSSw4QkFBOEIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsR0FBRyxvREFBb0QsQ0FBQzs7TUFFMU0sSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztNQUNsRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRTtRQUNuQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyw4Q0FBOEMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQztRQUMxSixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQzFCLE1BQU07O1FBRUwsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDMUQ7TUFDRCxPQUFPLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNyQzs7Ozs7O0dBTUYsRUFBRTtJQUNELEdBQUcsRUFBRSxxQkFBcUI7SUFDMUIsS0FBSyxFQUFFLFNBQVMsbUJBQW1CLEdBQUc7TUFDcEMsSUFBSSxXQUFXLEdBQUcsU0FBUyxXQUFXLENBQUMsUUFBUSxFQUFFO1FBQy9DLEtBQUssSUFBSSxXQUFXLEdBQUcsUUFBUSxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7VUFDdkksSUFBSSxNQUFNLENBQUM7O1VBRVgsQUFBZ0I7WUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07WUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1dBQzlCLEFBSUE7O1VBRUQsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDOztVQUVoQixJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0MsT0FBTyxFQUFFLENBQUM7V0FDWDtTQUNGO09BQ0YsQ0FBQzs7TUFFRixJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztNQUMzQixLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUM3QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxRQUFRLENBQUM7UUFDYixJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFO1VBQ3RFLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO09BQ0Y7S0FDRjs7OztHQUlGLEVBQUU7SUFDRCxHQUFHLEVBQUUscUJBQXFCO0lBQzFCLEtBQUssRUFBRSxTQUFTLG1CQUFtQixHQUFHO01BQ3BDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxnQkFBZ0IsRUFBRTtRQUNwRCxPQUFPLFlBQVk7VUFDakIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1VBQ2hCLEtBQUssSUFBSSxLQUFLLElBQUksZ0JBQWdCLENBQUMsTUFBTSxFQUFFO1lBQ3pDLElBQUksUUFBUSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7V0FDaEY7VUFDRCxPQUFPLE1BQU0sQ0FBQztTQUNmLEVBQUUsQ0FBQztPQUNMLENBQUMsQ0FBQztLQUNKOzs7O0dBSUYsRUFBRTtJQUNELEdBQUcsRUFBRSxzQkFBc0I7SUFDM0IsS0FBSyxFQUFFLFNBQVMsb0JBQW9CLEdBQUc7TUFDckMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLGdCQUFnQixFQUFFO1FBQ3BELE9BQU8sWUFBWTtVQUNqQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7VUFDaEIsS0FBSyxJQUFJLEtBQUssSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7WUFDekMsSUFBSSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztXQUNuRjtVQUNELE9BQU8sTUFBTSxDQUFDO1NBQ2YsRUFBRSxDQUFDO09BQ0wsQ0FBQyxDQUFDO0tBQ0o7Ozs7R0FJRixFQUFFO0lBQ0QsR0FBRyxFQUFFLFNBQVM7SUFDZCxLQUFLLEVBQUUsU0FBUyxPQUFPLEdBQUc7TUFDeEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOztNQUVsQixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFO1FBQ2hELE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7T0FDakQsQ0FBQyxDQUFDO01BQ0gsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7TUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O01BRXJCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDcEMsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2xDLENBQUMsQ0FBQztLQUNKO0dBQ0YsRUFBRTtJQUNELEdBQUcsRUFBRSxRQUFRO0lBQ2IsS0FBSyxFQUFFLFNBQVMsTUFBTSxHQUFHO01BQ3ZCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztNQUNyQixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFO1FBQ2hELE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7T0FDOUMsQ0FBQyxDQUFDO01BQ0gsT0FBTyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztLQUNuQzs7OztHQUlGLEVBQUU7SUFDRCxHQUFHLEVBQUUsVUFBVTtJQUNmLEtBQUssRUFBRSxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUU7TUFDN0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO01BQ3JCLElBQUksWUFBWSxHQUFHLEdBQUcsQ0FBQzs7TUFFdkIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7O1FBRTFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1VBQ3JDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUNwQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7O1VBRTdELElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRTtZQUNsQixZQUFZLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDcEIsTUFBTTtXQUNQO1NBQ0Y7O1FBRUQsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUNuRDs7TUFFRCxPQUFPLFVBQVUsR0FBRyxZQUFZLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDaEc7Ozs7R0FJRixFQUFFO0lBQ0QsR0FBRyxFQUFFLDZCQUE2QjtJQUNsQyxLQUFLLEVBQUUsU0FBUywyQkFBMkIsR0FBRztNQUM1QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7UUFDNUYsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7VUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO09BQzNELE1BQU07UUFDTCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO09BQzlEO0tBQ0Y7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLE1BQU07SUFDWCxLQUFLLEVBQUUsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFO01BQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFO1FBQ25CLE9BQU87T0FDUjtNQUNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7O01BSXJCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztNQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3BDOztNQUVELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7TUFHL0IsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ2hCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDOztRQUVqQyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLEVBQUU7O1VBRTlELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQyxNQUFNO1VBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6QjtPQUNGO0tBQ0Y7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLE9BQU87SUFDWixLQUFLLEVBQUUsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO01BQ3ZCLElBQUksU0FBUyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGFBQWEsR0FBRyxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUU7UUFDbEUsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO09BQ2hCLENBQUMsSUFBSSxJQUFJLEVBQUU7UUFDVixPQUFPO09BQ1I7O01BRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDdEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7OztNQUdsQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDaEIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDdkM7S0FDRjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsYUFBYTtJQUNsQixLQUFLLEVBQUUsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO01BQ2pDLEtBQUssSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7UUFDcEksSUFBSSxNQUFNLENBQUM7O1FBRVgsQUFBZ0I7VUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07VUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzlCLEFBSUE7O1FBRUQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDOztRQUVsQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3BCO0tBQ0Y7Ozs7O0dBS0YsRUFBRTtJQUNELEdBQUcsRUFBRSxvQkFBb0I7SUFDekIsS0FBSyxFQUFFLFNBQVMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO01BQ3hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7TUFFbEIsT0FBTyxZQUFZO1FBQ2pCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLElBQUksV0FBVyxHQUFHLEtBQUssRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO1VBQ3BJLElBQUksTUFBTSxDQUFDOztVQUVYLEFBQWdCO1lBQ2QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNO1lBQ3RDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztXQUM5QixBQUlBOztVQUVELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQzs7VUFFbEIsSUFBSSxLQUFLLENBQUM7VUFDVixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUU7WUFDdEUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2NBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQy9DLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFOztjQUU1QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDL0QsTUFBTTtjQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDeEI7V0FDRixNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDakMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtjQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMvQyxNQUFNO2NBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN4QjtXQUNGLE1BQU07WUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1dBQ3hCO1NBQ0Y7UUFDRCxPQUFPLE1BQU0sQ0FBQztPQUNmLEVBQUUsQ0FBQztLQUNMOzs7O0dBSUYsRUFBRTtJQUNELEdBQUcsRUFBRSx3QkFBd0I7SUFDN0IsS0FBSyxFQUFFLFNBQVMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRTtNQUN0RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7O01BRWxCLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7TUFFekMsSUFBSSxZQUFZLEdBQUcsU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFO1FBQzlDLE9BQU8sZUFBZSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUU7VUFDbEQsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JCLENBQUMsQ0FBQztPQUNKLENBQUM7O01BRUYsSUFBSSxXQUFXLEdBQUcsU0FBUyxXQUFXLEdBQUc7UUFDdkMsT0FBTyxTQUFTLENBQUMsV0FBVyxDQUFDLFVBQVUsT0FBTyxFQUFFO1VBQzlDLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEIsS0FBSyxJQUFJLFdBQVcsR0FBRyxPQUFPLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtjQUN0SSxJQUFJLE1BQU0sQ0FBQzs7Y0FFWCxBQUFnQjtnQkFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07Z0JBQ3RDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztlQUM5QixBQUlBOztjQUVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQzs7Y0FFbkIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNoQixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFO2tCQUN6QixJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtvQkFDekUsT0FBTzttQkFDUjtrQkFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztrQkFDdkMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM3QixDQUFDLENBQUM7ZUFDSixNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtnQkFDNUIsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztlQUMvRDthQUNGOzs7OztZQUtELFdBQVcsRUFBRSxDQUFDO1dBQ2Y7VUFDRCxPQUFPLElBQUksQ0FBQztTQUNiLEVBQUUsWUFBWSxDQUFDLENBQUM7T0FDbEIsQ0FBQzs7TUFFRixPQUFPLFdBQVcsRUFBRSxDQUFDO0tBQ3RCOzs7Ozs7Ozs7R0FTRixFQUFFO0lBQ0QsR0FBRyxFQUFFLFFBQVE7SUFDYixLQUFLLEVBQUUsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtNQUNqQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLElBQUksRUFBRTtRQUNsRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUNuSyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQ2xFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztPQUMvQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUNuRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN2RixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDNUMsTUFBTTtRQUNMLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDbkQ7S0FDRjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsU0FBUztJQUNkLEtBQUssRUFBRSxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7TUFDNUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOztNQUVsQixJQUFJLENBQUMsTUFBTSxHQUFHO1FBQ1osSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDdkIsUUFBUSxFQUFFLENBQUM7OztRQUdYLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSTtRQUNoQixTQUFTLEVBQUUsQ0FBQztRQUNaLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztRQUNoQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNwRyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO09BQy9ELENBQUM7TUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7TUFFdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDOztNQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQzs7TUFFN0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDOztNQUU3QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFO1FBQ3hDLElBQUksS0FBSyxFQUFFO1VBQ1QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7VUFDdEIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDeEMsTUFBTTtVQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1VBQ3JCLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDNUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUMxQjtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztPQUM3QyxDQUFDLENBQUM7S0FDSjs7OztHQUlGLEVBQUU7SUFDRCxHQUFHLEVBQUUsY0FBYztJQUNuQixLQUFLLEVBQUUsU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFO01BQ2xDLEtBQUssSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7UUFDcEksSUFBSSxNQUFNLENBQUM7O1FBRVgsQUFBZ0I7VUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07VUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzlCLEFBSUE7O1FBRUQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDOztRQUVsQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3hCO01BQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsYUFBYTtJQUNsQixLQUFLLEVBQUUsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFO01BQ2hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7TUFFbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFDNUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtVQUNqQyxPQUFPLFVBQVUsQ0FBQyxZQUFZO1lBQzVCLE9BQU8sTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1dBQzlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDUDtPQUNGLE1BQU07UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGtGQUFrRixDQUFDLENBQUM7T0FDckc7S0FDRjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsbUJBQW1CO0lBQ3hCLEtBQUssRUFBRSxTQUFTLGlCQUFpQixDQUFDLElBQUksRUFBRTtNQUN0QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7O01BRWxCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxHQUFHLElBQUksRUFBRTtRQUNwSSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxPQUFPLFVBQVUsQ0FBQyxZQUFZO1VBQzVCLE9BQU8sTUFBTSxDQUFDLHNCQUFzQixFQUFFLENBQUM7U0FDeEMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUNQO0tBQ0Y7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLHdCQUF3QjtJQUM3QixLQUFLLEVBQUUsU0FBUyxzQkFBc0IsR0FBRztNQUN2QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7O01BRW5CLElBQUksSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNsRSxPQUFPO09BQ1I7O01BRUQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztNQUNqQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO01BQ3hDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLFVBQVUsT0FBTyxFQUFFO1FBQ2xKLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QyxPQUFPLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1FBQ3JDLE9BQU8sT0FBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7T0FDekMsQ0FBQyxDQUFDO0tBQ0o7Ozs7R0FJRixFQUFFO0lBQ0QsR0FBRyxFQUFFLFlBQVk7SUFDakIsS0FBSyxFQUFFLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtNQUMvQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3pCO01BQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzs7TUFFdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDL0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDM0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQzNCO0tBQ0Y7Ozs7R0FJRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGdCQUFnQjtJQUNyQixLQUFLLEVBQUUsU0FBUyxjQUFjLENBQUMsaUJBQWlCLEVBQUU7O01BRWhELElBQUksaUJBQWlCLElBQUksSUFBSSxFQUFFO1FBQzdCLGlCQUFpQixHQUFHLEtBQUssQ0FBQztPQUMzQjtNQUNELEtBQUssSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO1FBQ2pKLElBQUksTUFBTSxDQUFDOztRQUVYLEFBQWdCO1VBQ2QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNO1VBQ3RDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUM5QixBQUlBOztRQUVELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQzs7UUFFbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxTQUFTLElBQUksaUJBQWlCLEVBQUU7VUFDM0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QjtPQUNGO01BQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjs7Ozs7O0dBTUYsRUFBRTtJQUNELEdBQUcsRUFBRSxhQUFhO0lBQ2xCLEtBQUssRUFBRSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFO01BQ3ZFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7TUFFbkIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO1FBQzlGLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTs7VUFFbEIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkIsTUFBTTtVQUNMLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDOztVQUVwRCxJQUFJLGNBQWMsSUFBSSxJQUFJLEVBQUU7WUFDMUIsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7V0FDNUI7VUFDRCxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1VBQ3JGLElBQUksY0FBYyxLQUFLLFlBQVksSUFBSSxjQUFjLEtBQUssV0FBVyxFQUFFOztZQUVyRSxjQUFjLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1dBQ3BFO1VBQ0QsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1NBQ3pEO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGlCQUFpQjtJQUN0QixLQUFLLEVBQUUsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUU7TUFDM0YsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOztNQUVuQixJQUFJLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDOztNQUVsQyxVQUFVLENBQUMsTUFBTSxHQUFHLFlBQVk7O1FBRTlCLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQzs7O1FBR2pDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUU7VUFDakMsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3BCLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDN0I7VUFDRCxPQUFPO1NBQ1I7O1FBRUQsT0FBTyxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztPQUNwRyxDQUFDOztNQUVGLE9BQU8sVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2QztHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsd0JBQXdCO0lBQzdCLEtBQUssRUFBRSxTQUFTLHNCQUFzQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtNQUMvRyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7TUFJbkIsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7TUFFeEMsSUFBSSxXQUFXLEVBQUU7UUFDZixHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztPQUMvQjs7TUFFRCxHQUFHLENBQUMsTUFBTSxHQUFHLFlBQVk7UUFDdkIsSUFBSSxRQUFRLEdBQUcsU0FBUyxRQUFRLENBQUMsUUFBUSxFQUFFO1VBQ3pDLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BCLENBQUM7UUFDRixJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLGNBQWMsRUFBRTtVQUNsRSxRQUFRLEdBQUcsU0FBUyxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsWUFBWTtjQUNuQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO2FBQ25ELENBQUMsQ0FBQztXQUNKLENBQUM7U0FDSDs7UUFFRCxPQUFPLFFBQVEsQ0FBQyxVQUFVLFdBQVcsRUFBRTtVQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7VUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDOztVQUV6QixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDOztVQUV6RixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1VBQzlDLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O1VBRWxDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztVQUNuQyxNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7O1VBRXJDLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTtZQUNuQixNQUFNLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDcEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO1dBQ3JDOztVQUVELFFBQVEsV0FBVztZQUNqQixLQUFLLENBQUM7O2NBRUosR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2NBQy9CLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Y0FDakIsTUFBTTtZQUNSLEtBQUssQ0FBQzs7Y0FFSixHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2NBQzNDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2NBQ3BCLE1BQU07WUFDUixLQUFLLENBQUM7O2NBRUosR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2NBQ2hDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FDakIsTUFBTTtZQUNSLEtBQUssQ0FBQzs7Y0FFSixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Y0FDMUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNqQixNQUFNO1lBQ1IsS0FBSyxDQUFDOztjQUVKLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztjQUMxQixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztjQUNoQyxNQUFNO1lBQ1IsS0FBSyxDQUFDOztjQUVKLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztjQUMxQixHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Y0FDNUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztjQUNqQixNQUFNO1lBQ1IsS0FBSyxDQUFDOztjQUVKLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2NBQzNCLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2NBQ2pDLE1BQU07V0FDVDs7O1VBR0QsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztVQUU1UyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztVQUU5QyxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDcEIsT0FBTyxRQUFRLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1dBQ3BDO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQzs7TUFFRixJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7UUFDcEIsR0FBRyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7T0FDeEI7O01BRUQsT0FBTyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDL0I7Ozs7R0FJRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGNBQWM7SUFDbkIsS0FBSyxFQUFFLFNBQVMsWUFBWSxHQUFHO01BQzdCLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDOztNQUVuRCxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE1BQU0sQ0FBQztNQUN2RCxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQzs7O01BR3pCLElBQUksZ0JBQWdCLElBQUksZUFBZSxFQUFFO1FBQ3ZDLE9BQU87T0FDUjs7TUFFRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7O01BRXhDLElBQUksRUFBRSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQzdCLE9BQU87T0FDUjs7TUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFOztRQUUvQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsZUFBZSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQztPQUNwRixNQUFNO1FBQ0wsT0FBTyxDQUFDLEdBQUcsZUFBZSxFQUFFO1VBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ3ZCLE9BQU87V0FDUjtVQUNELElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7VUFDdEMsQ0FBQyxFQUFFLENBQUM7U0FDTDtPQUNGO0tBQ0Y7Ozs7R0FJRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGFBQWE7SUFDbEIsS0FBSyxFQUFFLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtNQUNoQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ2xDOzs7O0dBSUYsRUFBRTtJQUNELEdBQUcsRUFBRSxjQUFjO0lBQ25CLEtBQUssRUFBRSxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUU7TUFDbEMsS0FBSyxJQUFJLFdBQVcsR0FBRyxLQUFLLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtRQUNwSSxJQUFJLE1BQU0sQ0FBQzs7UUFFWCxBQUFnQjtVQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtVQUN0QyxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7U0FDOUIsQUFJQTs7UUFFRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUM7O1FBRWxCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQzs7UUFFakMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDL0I7O01BRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3hDOztNQUVELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQztHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsa0JBQWtCO0lBQ3ZCLEtBQUssRUFBRSxTQUFTLGdCQUFnQixDQUFDLEdBQUcsRUFBRTtNQUNwQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztNQUNuQixPQUFPLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRTtRQUMvQyxPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDO09BQ3pCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDckIsT0FBTyxJQUFJLENBQUM7T0FDYixDQUFDLENBQUM7S0FDSjs7Ozs7OztHQU9GLEVBQUU7SUFDRCxHQUFHLEVBQUUsY0FBYztJQUNuQixLQUFLLEVBQUUsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO01BQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ3RDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkQsS0FBSyxJQUFJLFdBQVcsR0FBRyxZQUFZLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtVQUMzSSxJQUFJLE1BQU0sQ0FBQzs7VUFFWCxBQUFnQjtZQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtZQUN0QyxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7V0FDOUIsQUFJQTs7VUFFRCxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUM7O1VBRXpCLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztTQUN4QztRQUNELElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxLQUFLLFdBQVcsRUFBRTtVQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2xCO1FBQ0QsS0FBSyxJQUFJLFdBQVcsR0FBRyxZQUFZLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtVQUMzSSxJQUFJLE1BQU0sQ0FBQzs7VUFFWCxBQUFnQjtZQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtZQUN0QyxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7V0FDOUIsQUFJQTs7VUFFRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUM7O1VBRTFCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTtVQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzdDO09BQ0YsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDNUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUU7VUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDdkM7T0FDRjs7TUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7UUFDakMsT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7T0FDNUI7S0FDRjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsZUFBZTtJQUNwQixLQUFLLEVBQUUsU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFO01BQ3BDLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO1FBQ2hDLEtBQUssSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7VUFDN0csSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEM7O1FBRUQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNqQztNQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLFlBQVk7SUFDakIsS0FBSyxFQUFFLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtNQUMvQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ2pDO0dBQ0YsRUFBRTtJQUNELEdBQUcsRUFBRSxhQUFhO0lBQ2xCLEtBQUssRUFBRSxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUU7TUFDakMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOztNQUVuQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxVQUFVLGdCQUFnQixFQUFFO1FBQ3RELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Ozs7O1VBSzNCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUNwQixJQUFJLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7VUFHMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOztVQUV4QixJQUFJLGVBQWUsR0FBRyxTQUFTLGVBQWUsR0FBRztZQUMvQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7OztZQUduQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLFNBQVMsRUFBRTtjQUNuRCxVQUFVLEVBQUUsQ0FBQzthQUNkOzs7WUFHRCxJQUFJLFVBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxPQUFPOztZQUl0RCxJQUFJLEtBQUssR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbkQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztZQUVqRSxJQUFJLFNBQVMsR0FBRztjQUNkLElBQUksRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztjQUM5QixJQUFJLEVBQUUsZUFBZSxDQUFDLFdBQVcsR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7Y0FDL0csUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtjQUM5QixVQUFVLEVBQUUsVUFBVTthQUN2QixDQUFDOztZQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHO2NBQy9CLElBQUksRUFBRSxJQUFJO2NBQ1YsS0FBSyxFQUFFLFVBQVU7Y0FDakIsU0FBUyxFQUFFLFNBQVM7Y0FDcEIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxTQUFTO2NBQzFCLFFBQVEsRUFBRSxDQUFDO2NBQ1gsT0FBTyxFQUFFLENBQUM7YUFDWCxDQUFDOztZQUVGLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztXQUN6QyxDQUFDOztVQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxLQUFLLEVBQUU7WUFDakQsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQzs7O1lBR2hDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOztZQUV2QixLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQzs7WUFFakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO2NBQ3BELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUN2QyxPQUFPLGVBQWUsRUFBRSxDQUFDO2VBQzFCO2NBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDckQsV0FBVyxHQUFHLEtBQUssQ0FBQztlQUNyQjthQUNGOztZQUVELElBQUksV0FBVyxFQUFFO2NBQ2YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFlBQVk7Z0JBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztlQUNwQyxDQUFDLENBQUM7YUFDSjtXQUNGLENBQUM7O1VBRUYsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFO1lBQ3hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRTtjQUNwRCxlQUFlLEVBQUUsQ0FBQzthQUNuQjtXQUNGLE1BQU07WUFDTCxlQUFlLEVBQUUsQ0FBQztXQUNuQjtTQUNGLE1BQU07VUFDTCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7VUFDcEIsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDOUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHO2NBQ2pCLElBQUksRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztjQUNqQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO2NBQzVCLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVE7YUFDdEMsQ0FBQztXQUNIO1VBQ0QsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDeEM7T0FDRixDQUFDLENBQUM7S0FDSjs7OztHQUlGLEVBQUU7SUFDRCxHQUFHLEVBQUUsV0FBVztJQUNoQixLQUFLLEVBQUUsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtNQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtVQUM1RSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlCO09BQ0Y7S0FDRjs7Ozs7O0dBTUYsRUFBRTtJQUNELEdBQUcsRUFBRSxhQUFhO0lBQ2xCLEtBQUssRUFBRSxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO01BQzdDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7TUFFbkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQzs7O01BRy9CLEtBQUssSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7UUFDcEksSUFBSSxNQUFNLENBQUM7O1FBRVgsQUFBZ0I7VUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07VUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzlCLEFBSUE7O1FBRUQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDOztRQUVsQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztPQUNoQjtNQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7O1FBRTNCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO09BQzVEOztNQUVELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDNUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztNQUN0RCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7OztNQUc1QixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7OztNQUc5RCxHQUFHLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQzs7TUFFckQsR0FBRyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsRUFBRTtRQUN4QixPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUMzQyxDQUFDOztNQUVGLEdBQUcsQ0FBQyxPQUFPLEdBQUcsWUFBWTtRQUN4QixPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO09BQ3hDLENBQUM7OztNQUdGLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO01BQ3hELFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLEVBQUU7UUFDcEMsT0FBTyxPQUFPLENBQUMsMEJBQTBCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUMxRCxDQUFDOztNQUVGLElBQUksT0FBTyxHQUFHO1FBQ1osUUFBUSxFQUFFLGtCQUFrQjtRQUM1QixlQUFlLEVBQUUsVUFBVTtRQUMzQixrQkFBa0IsRUFBRSxnQkFBZ0I7T0FDckMsQ0FBQzs7TUFFRixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQ3hCLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDaEQ7O01BRUQsS0FBSyxJQUFJLFVBQVUsSUFBSSxPQUFPLEVBQUU7UUFDOUIsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksV0FBVyxFQUFFO1VBQ2YsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUMvQztPQUNGOztNQUVELElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7OztNQUc5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDM0MsSUFBSSxPQUFPLGdCQUFnQixLQUFLLFVBQVUsRUFBRTtVQUMxQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDNUg7O1FBRUQsS0FBSyxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRTtVQUNoQyxJQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUNsQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3QjtPQUNGOzs7TUFHRCxLQUFLLElBQUksV0FBVyxHQUFHLEtBQUssRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO1FBQ3BJLElBQUksTUFBTSxDQUFDOztRQUVYLEFBQWdCO1VBQ2QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNO1VBQ3RDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUM5QixBQUlBOztRQUVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQzs7UUFFbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztPQUM1QztNQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUU7UUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQ3BEOztNQUVELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7OztNQUluQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ3JFOztNQUVELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMxQzs7OztHQUlGLEVBQUU7SUFDRCxHQUFHLEVBQUUsaUJBQWlCO0lBQ3RCLEtBQUssRUFBRSxTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO01BQzNDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7TUFFbkIsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7O01BRTFCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQzs7TUFFcEIsSUFBSSxLQUFLLEdBQUcsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQzVCLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsZUFBZSxFQUFFO1VBQy9FLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQztVQUN0QyxJQUFJLEVBQUUsV0FBVyxLQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7V0FDeEI7U0FDRixDQUFDLENBQUM7T0FDSixDQUFDOztNQUVGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNWO0tBQ0Y7Ozs7R0FJRixFQUFFO0lBQ0QsR0FBRyxFQUFFLHFCQUFxQjtJQUMxQixLQUFLLEVBQUUsU0FBUyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUU7O01BRTVDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFFO1FBQ25DLEtBQUssSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7VUFDL0wsSUFBSSxNQUFNLENBQUM7O1VBRVgsQUFBZ0I7WUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07WUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1dBQzlCLEFBSUE7O1VBRUQsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDOztVQUVuQixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1VBQzNDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7VUFDM0MsSUFBSSxTQUFTLEVBQUUsU0FBUyxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7O1VBR25ELElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUUsU0FBUzs7VUFFckUsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFOztZQUVoRSxLQUFLLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtjQUM1SSxJQUFJLE1BQU0sQ0FBQzs7Y0FFWCxBQUFnQjtnQkFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07Z0JBQ3RDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztlQUM5QixBQUlBOztjQUVELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQzs7Y0FFcEIsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUNuQixRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7ZUFDMUM7YUFDRjtXQUNGLE1BQU0sSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLEtBQUssVUFBVSxJQUFJLFNBQVMsS0FBSyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUMzRixRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7V0FDekM7U0FDRjtPQUNGO0tBQ0Y7Ozs7O0dBS0YsRUFBRTtJQUNELEdBQUcsRUFBRSw0QkFBNEI7SUFDakMsS0FBSyxFQUFFLFNBQVMsMEJBQTBCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7TUFDeEQsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7TUFDdEIsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXLEVBQUU7UUFDNUIsUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7O1FBRXBDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7VUFDM0IsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztVQUVwQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztVQUN0QyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztVQUMxQixLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7VUFDdEIsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1VBSTNCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztVQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7VUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1VBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO2NBQ3ZGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztjQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Y0FDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQzFEO1dBQ0Y7VUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztTQUMzRSxNQUFNO1VBQ0wsS0FBSyxJQUFJLFdBQVcsR0FBRyxLQUFLLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtZQUNwSSxJQUFJLE1BQU0sQ0FBQzs7WUFFWCxBQUFnQjtjQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtjQUN0QyxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDOUIsQUFJQTs7WUFFRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7O1lBRXBCLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7V0FDcEM7U0FDRjtRQUNELEtBQUssSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7VUFDcEksSUFBSSxNQUFNLENBQUM7O1VBRVgsQUFBZ0I7WUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07WUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1dBQzlCLEFBSUE7O1VBRUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDOztVQUVwQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RGO09BQ0YsTUFBTTs7O1FBR0wsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7O1FBRTVCLFFBQVEsR0FBRyxHQUFHLENBQUM7O1FBRWYsS0FBSyxJQUFJLFdBQVcsR0FBRyxLQUFLLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtVQUNwSSxJQUFJLE1BQU0sQ0FBQzs7VUFFWCxBQUFnQjtZQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtZQUN0QyxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7V0FDOUIsQUFJQTs7VUFFRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7O1VBRXBCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ3JGLGdCQUFnQixHQUFHLEtBQUssQ0FBQztXQUMxQjtVQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztVQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUMvQzs7O1FBR0QsSUFBSSxnQkFBZ0IsRUFBRTtVQUNwQixPQUFPO1NBQ1I7O1FBRUQsS0FBSyxJQUFJLFdBQVcsR0FBRyxLQUFLLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtVQUNwSSxJQUFJLE1BQU0sQ0FBQzs7VUFFWCxBQUFnQjtZQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtZQUN0QyxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7V0FDOUIsQUFJQTs7VUFFRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7O1VBRXBCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hFO09BQ0Y7S0FDRjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsb0JBQW9CO0lBQ3pCLEtBQUssRUFBRSxTQUFTLGtCQUFrQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO01BQ2hELElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDOztNQUV0QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUN6QyxPQUFPO09BQ1I7O01BRUQsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPO09BQ1I7O01BRUQsSUFBSSxHQUFHLENBQUMsWUFBWSxLQUFLLGFBQWEsSUFBSSxHQUFHLENBQUMsWUFBWSxLQUFLLE1BQU0sRUFBRTtRQUNyRSxRQUFRLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQzs7UUFFNUIsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7VUFDL0csSUFBSTtZQUNGLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1dBQ2pDLENBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ1YsUUFBUSxHQUFHLG9DQUFvQyxDQUFDO1dBQ2pEO1NBQ0Y7T0FDRjs7TUFFRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7O01BRXZDLElBQUksRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1FBQzVDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQy9DLE1BQU07UUFDTCxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO1VBQzNCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNwRSxNQUFNO1VBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO09BQ0Y7S0FDRjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsb0JBQW9CO0lBQ3pCLEtBQUssRUFBRSxTQUFTLGtCQUFrQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFO01BQ3ZELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ3pDLE9BQU87T0FDUjs7TUFFRCxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1FBQ3ZELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7VUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztVQUMzQyxPQUFPO1NBQ1IsTUFBTTtVQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQztTQUMxRDtPQUNGOztNQUVELEtBQUssSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7UUFDcEksSUFBSSxNQUFNLENBQUM7O1FBRVgsQUFBZ0I7VUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07VUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzlCLEFBSUE7O1FBSUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO09BQ3JIO0tBQ0Y7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGVBQWU7SUFDcEIsS0FBSyxFQUFFLFNBQVMsYUFBYSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO01BQ2xELEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7Ozs7O0dBS0YsRUFBRTtJQUNELEdBQUcsRUFBRSxXQUFXO0lBQ2hCLEtBQUssRUFBRSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRTtNQUNoRCxLQUFLLElBQUksV0FBVyxHQUFHLEtBQUssRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO1FBQ3BJLElBQUksTUFBTSxDQUFDOztRQUVYLEFBQWdCO1VBQ2QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNO1VBQ3RDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUM5QixBQUlBOztRQUVELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQzs7UUFFbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDN0I7TUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3RDOztNQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUNqQyxPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztPQUM1QjtLQUNGOzs7OztHQUtGLEVBQUU7SUFDRCxHQUFHLEVBQUUsa0JBQWtCO0lBQ3ZCLEtBQUssRUFBRSxTQUFTLGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFO01BQ3BELEtBQUssSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7UUFDcEksSUFBSSxNQUFNLENBQUM7O1FBRVgsQUFBZ0I7VUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07VUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzlCLEFBSUE7O1FBRUQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDOztRQUVsQixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUM3QjtNQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUU7UUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3RDOztNQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUNqQyxPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztPQUM1QjtLQUNGO0dBQ0YsQ0FBQyxFQUFFLENBQUM7SUFDSCxHQUFHLEVBQUUsUUFBUTtJQUNiLEtBQUssRUFBRSxTQUFTLE1BQU0sR0FBRztNQUN2QixPQUFPLHNDQUFzQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUU7UUFDMUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzFCLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUN0QyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDdkIsQ0FBQyxDQUFDO0tBQ0o7R0FDRixDQUFDLENBQUMsQ0FBQzs7RUFFSixPQUFPLFFBQVEsQ0FBQztDQUNqQixDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVYLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFckIsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQjNCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7QUFHdEIsUUFBUSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsT0FBTyxFQUFFOztFQUU5QyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDOUIsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUMvRCxNQUFNO0lBQ0wsT0FBTyxTQUFTLENBQUM7R0FDbEI7Q0FDRixDQUFDOzs7QUFHRixRQUFRLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3hCLFFBQVEsQ0FBQyxVQUFVLEdBQUcsVUFBVSxPQUFPLEVBQUU7RUFDdkMsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7SUFDL0IsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDM0M7RUFDRCxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxHQUFHLFNBQVMsS0FBSyxJQUFJLEVBQUU7SUFDNUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxnTkFBZ04sQ0FBQyxDQUFDO0dBQ25PO0VBQ0QsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDO0NBQ3pCLENBQUM7OztBQUdGLFFBQVEsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7QUFHN0IsUUFBUSxDQUFDLFFBQVEsR0FBRyxZQUFZO0VBQzlCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDO0VBQ3ZCLElBQUksUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQzdCLFNBQVMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDcEQsTUFBTTtJQUNMLFNBQVMsR0FBRyxFQUFFLENBQUM7O0lBRWYsSUFBSSxhQUFhLEdBQUcsU0FBUyxhQUFhLENBQUMsUUFBUSxFQUFFO01BQ25ELE9BQU8sWUFBWTtRQUNqQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxJQUFJLFdBQVcsR0FBRyxRQUFRLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtVQUN2SSxJQUFJLE1BQU0sQ0FBQzs7VUFFWCxBQUFnQjtZQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtZQUN0QyxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7V0FDOUIsQUFJQTs7VUFFRCxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUM7O1VBRWhCLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztXQUNqQyxNQUFNO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztXQUN4QjtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7T0FDZixFQUFFLENBQUM7S0FDTCxDQUFDO0lBQ0YsYUFBYSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BELGFBQWEsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztHQUN0RDs7RUFFRCxPQUFPLFlBQVk7SUFDakIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssSUFBSSxXQUFXLEdBQUcsU0FBUyxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7TUFDeEksSUFBSSxNQUFNLENBQUM7O01BRVgsQUFBZ0I7UUFDZCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU07UUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO09BQzlCLEFBSUE7O01BRUQsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDOzs7TUFHdEIsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxFQUFFO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztPQUNyQyxNQUFNO1FBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUN4QjtLQUNGO0lBQ0QsT0FBTyxNQUFNLENBQUM7R0FDZixFQUFFLENBQUM7Q0FDTCxDQUFDOzs7Ozs7Ozs7Ozs7O0FBYUYsUUFBUSxDQUFDLG1CQUFtQixHQUFHOztBQUUvQixnREFBZ0QsQ0FBQyxDQUFDOzs7QUFHbEQsUUFBUSxDQUFDLGtCQUFrQixHQUFHLFlBQVk7RUFDeEMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDOztFQUUxQixJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ25ILElBQUksRUFBRSxXQUFXLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO01BQ2pELGNBQWMsR0FBRyxLQUFLLENBQUM7S0FDeEIsTUFBTTs7TUFFTCxLQUFLLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO1FBQzNKLElBQUksTUFBTSxDQUFDOztRQUVYLEFBQWdCO1VBQ2QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNO1VBQ3RDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUM5QixBQUlBOztRQUVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQzs7UUFFbkIsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtVQUNuQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1VBQ3ZCLFNBQVM7U0FDVjtPQUNGO0tBQ0Y7R0FDRixNQUFNO0lBQ0wsY0FBYyxHQUFHLEtBQUssQ0FBQztHQUN4Qjs7RUFFRCxPQUFPLGNBQWMsQ0FBQztDQUN2QixDQUFDOztBQUVGLFFBQVEsQ0FBQyxhQUFhLEdBQUcsVUFBVSxPQUFPLEVBQUU7OztFQUcxQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7RUFHN0MsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7RUFHbkUsSUFBSSxFQUFFLEdBQUcsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzVDLElBQUksRUFBRSxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFO0lBQ25HLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2xDOzs7RUFHRCxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztDQUM3QyxDQUFDOzs7QUFHRixJQUFJLE9BQU8sR0FBRyxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO0VBQ2pELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRTtJQUNqQyxPQUFPLElBQUksS0FBSyxZQUFZLENBQUM7R0FDOUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksRUFBRTtJQUNyQixPQUFPLElBQUksQ0FBQztHQUNiLENBQUMsQ0FBQztDQUNKLENBQUM7OztBQUdGLElBQUksUUFBUSxHQUFHLFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRTtFQUNwQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLFVBQVUsS0FBSyxFQUFFO0lBQ2hELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUN0QyxDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFHRixRQUFRLENBQUMsYUFBYSxHQUFHLFVBQVUsTUFBTSxFQUFFO0VBQ3pDLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDeEMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7RUFDdkIsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzFCLENBQUM7OztBQUdGLFFBQVEsQ0FBQyxhQUFhLEdBQUcsVUFBVSxPQUFPLEVBQUUsU0FBUyxFQUFFO0VBQ3JELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtJQUN6QixPQUFPLElBQUksQ0FBQztHQUNiO0VBQ0QsT0FBTyxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRTtJQUNuQyxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7TUFDekIsT0FBTyxJQUFJLENBQUM7S0FDYjtHQUNGO0VBQ0QsT0FBTyxLQUFLLENBQUM7Q0FDZCxDQUFDOztBQUVGLFFBQVEsQ0FBQyxVQUFVLEdBQUcsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFO0VBQ3hDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDO0VBQ3JCLElBQUksT0FBTyxFQUFFLEtBQUssUUFBUSxFQUFFO0lBQzFCLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ3RDLE1BQU0sSUFBSSxFQUFFLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtJQUM5QixPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ2Q7RUFDRCxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7SUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLDJFQUEyRSxDQUFDLENBQUM7R0FDbkg7RUFDRCxPQUFPLE9BQU8sQ0FBQztDQUNoQixDQUFDOztBQUVGLFFBQVEsQ0FBQyxXQUFXLEdBQUcsVUFBVSxHQUFHLEVBQUUsSUFBSSxFQUFFO0VBQzFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztNQUNYLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztFQUN0QixJQUFJLEdBQUcsWUFBWSxLQUFLLEVBQUU7SUFDeEIsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNkLElBQUk7TUFDRixLQUFLLElBQUksV0FBVyxHQUFHLEdBQUcsRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO1FBQ2xJLEFBQWdCO1VBQ2QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNO1VBQ3RDLEVBQUUsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUMxQixBQUlBOztRQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztPQUMxQztLQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDVixRQUFRLEdBQUcsSUFBSSxDQUFDO0tBQ2pCO0dBQ0YsTUFBTSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtJQUNsQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ2QsS0FBSyxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxVQUFVLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtNQUM3SixBQUFnQjtRQUNkLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTTtRQUN0QyxFQUFFLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7T0FDMUIsQUFJQTs7TUFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ25CO0dBQ0YsTUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO0lBQy9CLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ2xCOztFQUVELElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLDRGQUE0RixDQUFDLENBQUM7R0FDcEk7O0VBRUQsT0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQzs7Ozs7O0FBTUYsUUFBUSxDQUFDLE9BQU8sR0FBRyxVQUFVLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO0VBQ3pELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUM1QixPQUFPLFFBQVEsRUFBRSxDQUFDO0dBQ25CLE1BQU0sSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO0lBQzNCLE9BQU8sUUFBUSxFQUFFLENBQUM7R0FDbkI7Q0FDRixDQUFDOzs7OztBQUtGLFFBQVEsQ0FBQyxXQUFXLEdBQUcsVUFBVSxJQUFJLEVBQUUsYUFBYSxFQUFFO0VBQ3BELElBQUksQ0FBQyxhQUFhLEVBQUU7SUFDbEIsT0FBTyxJQUFJLENBQUM7R0FDYjtFQUNELGFBQWEsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUV6QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQ3pCLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztFQUVqRCxLQUFLLElBQUksV0FBVyxHQUFHLGFBQWEsRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO0lBQzVJLElBQUksTUFBTSxDQUFDOztJQUVYLEFBQWdCO01BQ2QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNO01BQ3RDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUM5QixBQUlBOztJQUVELElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQzs7SUFFdkIsU0FBUyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO01BQy9CLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN4RyxPQUFPLElBQUksQ0FBQztPQUNiO0tBQ0YsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7O01BRWxDLElBQUksWUFBWSxLQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ25ELE9BQU8sSUFBSSxDQUFDO09BQ2I7S0FDRixNQUFNO01BQ0wsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1FBQzFCLE9BQU8sSUFBSSxDQUFDO09BQ2I7S0FDRjtHQUNGOztFQUVELE9BQU8sS0FBSyxDQUFDO0NBQ2QsQ0FBQzs7O0FBR0YsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtFQUNwRCxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxVQUFVLE9BQU8sRUFBRTtJQUN0QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtNQUMzQixPQUFPLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNwQyxDQUFDLENBQUM7R0FDSixDQUFDO0NBQ0g7O0FBRUQsSUFBSSxBQUFpQyxNQUFNLEtBQUssSUFBSSxFQUFFO0VBQ3BELGNBQWMsR0FBRyxRQUFRLENBQUM7Q0FDM0IsTUFBTTtFQUNMLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0NBQzVCOzs7QUFHRCxRQUFRLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQzs7QUFFekIsUUFBUSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7OztBQUczQixRQUFRLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0FBRXBDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDO0FBQ2pDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQzs7QUFFekMsUUFBUSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7QUFDL0IsUUFBUSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDekIsUUFBUSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFhN0IsSUFBSSxvQkFBb0IsR0FBRyxTQUFTLG9CQUFvQixDQUFDLEdBQUcsRUFBRTtFQUM1RCxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0VBQzFCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUM7RUFDM0IsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUM5QyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNqQixNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztFQUNuQixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2xDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7RUFFekIsSUFBSSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztNQUNqRCxJQUFJLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDOzs7OztFQUtsQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDWCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7RUFDWixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7RUFDWixPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDZCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7SUFFbkMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO01BQ2YsRUFBRSxHQUFHLEVBQUUsQ0FBQztLQUNULE1BQU07TUFDTCxFQUFFLEdBQUcsRUFBRSxDQUFDO0tBQ1Q7O0lBRUQsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQ25CO0VBQ0QsSUFBSSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7RUFFcEIsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO0lBQ2YsT0FBTyxDQUFDLENBQUM7R0FDVixNQUFNO0lBQ0wsT0FBTyxLQUFLLENBQUM7R0FDZDtDQUNGLENBQUM7Ozs7QUFJRixJQUFJLGVBQWUsR0FBRyxTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7RUFDdkYsSUFBSSxlQUFlLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDaEQsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDO0NBQzdFLENBQUM7Ozs7OztBQU1GLElBQUksV0FBVyxHQUFHLFlBQVk7RUFDNUIsU0FBUyxXQUFXLEdBQUc7SUFDckIsZUFBZSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztHQUNwQzs7RUFFRCxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQy9CLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLEtBQUssRUFBRSxTQUFTLFNBQVMsR0FBRztNQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLG1FQUFtRSxDQUFDO0tBQ3BGO0dBQ0YsRUFBRTtJQUNELEdBQUcsRUFBRSxVQUFVO0lBQ2YsS0FBSyxFQUFFLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtNQUM5QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7TUFDaEIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO01BQ3JCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztNQUNyQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7TUFDZCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7TUFDckIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO01BQ3JCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztNQUNyQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7TUFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDVixPQUFPLElBQUksRUFBRTtRQUNYLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQixJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2pCLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtVQUNmLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1NBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7VUFDdEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztTQUNYO1FBQ0QsTUFBTSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoSSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtVQUN2QixNQUFNO1NBQ1A7T0FDRjtNQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLFNBQVM7SUFDZCxLQUFLLEVBQUUsU0FBUyxPQUFPLENBQUMsY0FBYyxFQUFFLGlCQUFpQixFQUFFO01BQ3pELElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLEVBQUU7UUFDcEQsT0FBTyxpQkFBaUIsQ0FBQztPQUMxQjtNQUNELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3BGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQy9ELE9BQU8seUJBQXlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN6RDtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsa0JBQWtCO0lBQ3ZCLEtBQUssRUFBRSxTQUFTLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLFFBQVEsRUFBRTtNQUM1RCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQzVDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDbEUsSUFBSSxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7TUFDNUMsT0FBTyxPQUFPLENBQUM7S0FDaEI7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGNBQWM7SUFDbkIsS0FBSyxFQUFFLFNBQVMsWUFBWSxDQUFDLFFBQVEsRUFBRTtNQUNyQyxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUM7TUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ1YsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUMxQixHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1VBQ25DLE9BQU8sR0FBRyxDQUFDO1NBQ1o7UUFDRCxDQUFDLEVBQUUsQ0FBQztPQUNMO01BQ0QsT0FBTyxFQUFFLENBQUM7S0FDWDtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsWUFBWTtJQUNqQixLQUFLLEVBQUUsU0FBUyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxFQUFFO01BQ3ZELElBQUksU0FBUyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUN6RSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ25DLElBQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3hDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO01BQ3RDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7TUFDbkMsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDO01BQ2hCLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ2hDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzFCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGdCQUFnQjtJQUNyQixLQUFLLEVBQUUsU0FBUyxjQUFjLENBQUMsYUFBYSxFQUFFO01BQzVDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztNQUNiLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztNQUNsQixPQUFPLElBQUksRUFBRTtRQUNYLElBQUksTUFBTSxDQUFDO1FBQ1gsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1VBQ2pFLE1BQU07U0FDUDtRQUNELElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxhQUFhLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtVQUNqRSxJQUFJLElBQUksQ0FBQyxDQUFDO1NBQ1gsTUFBTTtVQUNMLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxhQUFhLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1VBQ2pFLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1VBQ2pDLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1VBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7VUFDbkIsSUFBSSxHQUFHLFFBQVEsQ0FBQztTQUNqQjtRQUNELElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUU7VUFDL0IsTUFBTTtTQUNQO09BQ0Y7TUFDRCxPQUFPLFFBQVEsQ0FBQztLQUNqQjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsVUFBVTtJQUNmLEtBQUssRUFBRSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7TUFFOUIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO01BQ3JCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztNQUNyQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7TUFDZCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7TUFDckIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO01BQ3JCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztNQUNyQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7TUFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDVixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7O01BRWIsSUFBSSxVQUFVLEdBQUcscUJBQXFCLENBQUM7TUFDdkMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0pBQXdKLENBQUMsQ0FBQztPQUN4SztNQUNELEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ2pELE9BQU8sSUFBSSxFQUFFO1FBQ1gsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0MsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtVQUNmLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEI7UUFDRCxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7VUFDZixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDL0IsSUFBSSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7VUFDdkIsTUFBTTtTQUNQO09BQ0Y7TUFDRCxPQUFPLEdBQUcsQ0FBQztLQUNaO0dBQ0YsQ0FBQyxDQUFDLENBQUM7O0VBRUosT0FBTyxXQUFXLENBQUM7Q0FDcEIsRUFBRSxDQUFDOztBQUVKLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0J4QixJQUFJLGFBQWEsR0FBRyxTQUFTLGFBQWEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFO0VBQ2xELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztFQUNqQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7RUFDZixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0VBQ3ZCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUM7RUFDL0IsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixHQUFHLGtCQUFrQixHQUFHLGFBQWEsQ0FBQztFQUNwRSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcscUJBQXFCLEdBQUcsYUFBYSxDQUFDO0VBQ3ZFLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0VBQzNDLElBQUksSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtJQUMxQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssa0JBQWtCLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUU7TUFDbEUsT0FBTztLQUNSO0lBQ0QsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtNQUMxQixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDbEM7R0FDRixDQUFDOztFQUVGLElBQUksSUFBSSxHQUFHLFNBQVMsSUFBSSxHQUFHO0lBQ3pCLElBQUk7TUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3ZCLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDVixVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ3JCLE9BQU87S0FDUjtJQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3JCLENBQUM7O0VBRUYsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBRTtJQUNqQyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO01BQzFDLElBQUk7UUFDRixHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO09BQ3pCLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtNQUNsQixJQUFJLEdBQUcsRUFBRTtRQUNQLElBQUksRUFBRSxDQUFDO09BQ1I7S0FDRjtJQUNELEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzVDO0NBQ0YsQ0FBQzs7O0FBR0YsUUFBUSxDQUFDLHFCQUFxQixHQUFHLFlBQVk7RUFDM0MsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3pCLE9BQU8sUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQzVCO0NBQ0YsQ0FBQztBQUNGLGFBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRXRELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7RUFDbkMsT0FBTyxPQUFPLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDO0NBQ3RGO0FBQ0QsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUU7RUFDbkQsSUFBSSxPQUFPLEdBQUcsS0FBSyxXQUFXLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxVQUFVLEVBQUU7SUFDdkYsT0FBTyxTQUFTLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0dBQ25DLE1BQU07SUFDTCxPQUFPLFNBQVMsQ0FBQztHQUNsQjtDQUNGOzs7O0FDejhHRCxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQWtELGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBa0gsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUNBLGNBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFhLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sTUFBTSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFXLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FB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
