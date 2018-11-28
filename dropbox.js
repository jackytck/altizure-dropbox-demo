/* global Dropbox */
function setupDropbox (divId, onSuccess) {
  return function () {
    const options = {
      success: onSuccess,
      linkType: 'direct',
      multiselect: true,
      extensions: ['images'],
      folderselect: false
    }
    const button = Dropbox.createChooseButton(options)
    document.getElementById(divId).appendChild(button)
  }
}

export default setupDropbox
