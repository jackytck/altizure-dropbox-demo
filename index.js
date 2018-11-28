import {
  onLogout,
  onSuccess,
  onUpload,
  render
} from './altizure'

import setupDropbox from './dropbox'

global.onUpload = onUpload
global.onLogout = onLogout

render('altizure-container', setupDropbox('dropbox-container', onSuccess))
