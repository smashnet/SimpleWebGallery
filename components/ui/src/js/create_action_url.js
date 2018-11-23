export function createActionURL() {
  var accessCodeInput = document.getElementById("accessCodeInput");
  var form = document.getElementById("enterAlbumForm");
  form.action = "/album/" + accessCodeInput.value;
};
