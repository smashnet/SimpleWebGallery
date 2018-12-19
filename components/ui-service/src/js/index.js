import Dropzone from 'dropzone'
import Siema from 'siema'
import { btnSuccessOnSubmit } from "./btn_success_on_submit";
import { deleteData, postFormData } from "./http_request";
import { openFullscreen, closeFullscreen } from "./fullscreen";
import { createActionURL } from "./create_action_url";

window.deleteData = deleteData
window.postFormData = postFormData
window.openFullscreen = openFullscreen
window.closeFullscreen = closeFullscreen
window.createActionURL = createActionURL
window.Siema = Siema
window.Dropzone = Dropzone

document.querySelectorAll(".hasSubmitButton").forEach((form) => {
  form.addEventListener("submit", btnSuccessOnSubmit);
});

Dropzone.options.partyUpload = {
  acceptedFiles: 'image/*',
  maxFilesize: 7
};
