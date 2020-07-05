const btns = document.querySelectorAll('#delete-btn');

btns.forEach((btn) => {
	btn.addEventListener('click', async (e) => {
		let target = e.target;
		let url = `/authors/${target.dataset.id}`;

		const res = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json'
			}
		});
		const deleted = await `deleted...`;
		return deleted;
	});
});
