FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginFileEncode);

FilePond.setOptions({
	stylePanelAspectRatio: 0.75,
	imageResizeTargetWidth: 200,
	imageResizeTargetHeigth: 400
});
FilePond.parse(document.body);
