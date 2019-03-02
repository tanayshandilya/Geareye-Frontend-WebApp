// ------------------------------------------ Main app definitions ------------------------------------------ //
const app = {
	root: $('app-root'),
	header: $('app-header'),
	footer: $('app-footer'),
	content: $('app-content'),
	serverIp: '192.168.43.251',
	serverPort: '3800',
	serverProtocol: 'http://',
	addIcon: $(`<div class="text-center pt-5">
		<img style="height: 150px" src="assets/images/add-icon.svg"/>
		<h6 class="mt-3 text-muted">Waiting for items to be added</h6>
	</div>`),
	router: new Navigo(null, true, '#')
}
app.loadHeader = () => {
	$.get(`views/partials/header.html?v=${new Date().getTime()}`, (res) => {
		app.header.html($(res));
	});
}
app.loadContent = ( page ) => {
	$.get(`views/${page}.html?v=${new Date().getTime()}`, (res) => {
		app.content.html($(res));
	});	
}
app.notify = {
	success: (message) => {
		$(`<div class="alert alert-success" style="display: none" role="alert">${message}</div>`).appendTo('app-footer').delay(100).fadeIn().delay(1200).fadeOut();
	},
	error: (message) => {
		$(`<div class="alert alert-danger" style="display: none" role="alert">${message}</div>`).appendTo('app-footer').delay(100).fadeIn().delay(1200).fadeOut();
	},
	warn: (message) => {
		$(`<div class="alert alert-warning" style="display: none" role="alert">${message}</div>`).appendTo('app-footer').delay(100).fadeIn().delay(1200).fadeOut();
	}
}

// ------------------------------------------ Main app api functions ------------------------------------------ //

app.api = {
	path: app.serverProtocol+app.serverIp+':'+app.serverPort,
	data: []
};

app.truncateDB = () => {
	$.post(`${app.api.path}/app/api/truncate`, {} , (resp) => {
		if (resp.status === 'success') {
			app.notify.success('List cleared successfully');
			setTimeout(()=>{
				window.location.hash = '#/home';
			}, 1000);
		} else {
			app.notify.error('Could not clear the list please check the Settings');
		}
	});
}

app.api.syncItems = () => {
	let _app_list = $('app-items');
	$.post(`${app.api.path}/app/api/sync`, (res) => {
		if (res.status === 'success') {
			if (app.api.data.length === 0) {
				app.api.data = res.data;
				_app_list.html('');
				for (var i = 0; i < res.data.length; i++) {
					let name = res.data[i].item_name;
					if (name === 'no-name') {
						name = `<form id="${res.data[i].item_rfid}">
							<div class="input-group">
							  <input type="text" class="form-control form-control-sm fel-${res.data[i].item_rfid}" placeholder="Item Name" name="item_name_${res.data[i].item_rfid}">
							  <div class="input-group-append">
							    <button type="submit" class="btn btn-sm btn-outline-info fel-${res.data[i].item_rfid}">Save</button>
							  </div>
							</div>
						</form>
						<script>
						$('#${res.data[i].item_rfid}').on('submit', (e) => {
							e.preventDefault(); e.stopPropagation();
							$('.fel-${res.data[i].item_rfid}').attr('disabled','');
							$('#loader-${res.data[i].item_rfid}').fadeIn();
							$.post('${app.api.path}/app/api/update/${res.data[i].item_rfid}',
							{property: 'item_name', value: $('input[name="item_name_${res.data[i].item_rfid}"]').val()},
							(resp) => {
								if(resp.status === 'success'){
									$('#loader-${res.data[i].item_rfid}').fadeOut();
									$('#${res.data[i].item_rfid}').html('<h4 class="mb-1">'+$('input[name="item_name_${res.data[i].item_rfid}"]').val()+'</h4>');
									app.notify.success('Name changed successfully');
								}
							});
						});
						</script>`
					};
					$(`<div class="card bg-white shadow-md mb-3">
							<div class="loader-container">
								<div class="loader" id="loader-${res.data[i].item_rfid}" style="display: none;"></div>
							</div>
					        <div class="card-body">
					            <div class="row">
					            	<div class="col-2">
					            		<img style="height: 45px;filter: opacity(16%);" src="assets/images/item-icon.svg"/>
					            	</div>
					            	<div class="col-10">
						            	<h4 class="mb-1">${name}</h4>
						            	<h6 class="text-sub mb-0">${res.data[i].item_rfid}</h6>
					            	</div>
					            </div>
					        </div>
					    </div>`).appendTo('app-items');
				}
			} else {
				if (_app_list.html() === '') {
					for (var i = 0; i < res.data.length; i++) {
					let name = res.data[i].item_name;
					if (name === 'no-name') {
						name = `<form id="${res.data[i].item_rfid}">
							<div class="input-group">
							  <input type="text" class="form-control form-control-sm fel-${res.data[i].item_rfid}" placeholder="Item Name" name="item_name_${res.data[i].item_rfid}">
							  <div class="input-group-append">
							    <button type="submit" class="btn btn-sm btn-outline-info fel-${res.data[i].item_rfid}">Save</button>
							  </div>
							</div>
						</form>
						<script>
						$('#${res.data[i].item_rfid}').on('submit', (e) => {
							e.preventDefault(); e.stopPropagation();
							$('.fel-${res.data[i].item_rfid}').attr('disabled','');
							$('#loader-${res.data[i].item_rfid}').fadeIn();
							$.post('${app.api.path}/app/api/update/${res.data[i].item_rfid}',
							{property: 'item_name', value: $('input[name="item_name_${res.data[i].item_rfid}"]').val()},
							(resp) => {
								if(resp.status === 'success'){
									$('#loader-${res.data[i].item_rfid}').fadeOut();
									$('#${res.data[i].item_rfid}').html('<h4 class="mb-1">'+$('input[name="item_name_${res.data[i].item_rfid}"]').val()+'</h4>');
									app.notify.success('Name changed successfully');
								}
							});
						});
						</script>`
					};
					$(`<div class="card bg-white shadow-md mb-3">
							<div class="loader-container">
								<div class="loader" id="loader-${res.data[i].item_rfid}" style="display: none;"></div>
							</div>
					        <div class="card-body">
					            <div class="row">
					            	<div class="col-2">
					            		<img style="height: 45px;filter: opacity(16%);" src="assets/images/item-icon.svg"/>
					            	</div>
					            	<div class="col-10">
						            	<h4 class="mb-1">${name}</h4>
						            	<h6 class="text-sub mb-0">${res.data[i].item_rfid}</h6>
					            	</div>
					            </div>
					        </div>
					    </div>`).appendTo('app-items');
				}
				}
				for (var i = app.api.data.length; i < res.data.length; i++) {
					// if (app.api.data[i] !== res.data[i]) {
						let name = res.data[i].item_name;
						if (name === 'no-name') {
							name = `<form id="${res.data[i].item_rfid}">
								<div class="input-group">
								  <input type="text" class="form-control form-control-sm fel-${res.data[i].item_rfid}" placeholder="Item Name" name="item_name_${res.data[i].item_rfid}">
								  <div class="input-group-append">
								    <button type="submit" class="btn btn-sm btn-outline-info fel-${res.data[i].item_rfid}">Save</button>
								  </div>
								</div>
							</form>
							<script>
							$('#${res.data[i].item_rfid}').on('submit', (e) => {
								e.preventDefault(); e.stopPropagation();
								$('.fel-${res.data[i].item_rfid}').attr('disabled','');
								$('#loader-${res.data[i].item_rfid}').fadeIn();
								$.post('${app.api.path}/app/api/update/${res.data[i].item_rfid}',
								{property: 'item_name', value: $('input[name="item_name_${res.data[i].item_rfid}"]').val()},
								(resp) => {
									if(resp.status === 'success'){
										$('#loader-${res.data[i].item_rfid}').fadeOut();
										$('#${res.data[i].item_rfid}').html('<h4 class="mb-1">'+$('input[name="item_name_${res.data[i].item_rfid}"]').val()+'</h4>');
										app.notify.success('Name changed successfully');
									}
								});
							});
							</script>`
						};
						$(`<div class="card bg-white shadow-md mb-3">
								<div class="loader-container">
									<div class="loader" id="loader-${res.data[i].item_rfid}" style="display: none;"></div>
								</div>
						        <div class="card-body">
						            <div class="row">
						            	<div class="col-2">
						            		<img style="height: 45px;filter: opacity(16%);" src="assets/images/item-icon.svg"/>
						            	</div>
						            	<div class="col-10">
							            	<h4 class="mb-1">${name}</h4>
							            	<h6 class="text-sub mb-0">${res.data[i].item_rfid}</h6>
						            	</div>
						            </div>
						        </div>
						    </div>`).appendTo('app-items');
					// }
				}
			}
		} else if(res.status === 'no-data') {
			_app_list.html(app.addIcon);
		} else if (res.status === 'error') {
			app.notify.warn(res.message);
		}
	});
}

app.api.syncCheckList = () => {
	let _checklist = $('app-checklist');
	$.post(`${app.api.path}/app/api/sync`, (resp) => {
		if (resp.status === 'success') {
			_checklist.html('');
			for (var i = 0; i < resp.data.length; i++) {
				let bg = 'bg-success';
				if (resp.data[i].item_state === 'added') {
					bg = 'bg-danger';
				}
				_checklist.append(
					`<div class="card ${bg} shadow-md mb-3">
				        <div class="card-body">
				            <div class="row">
				            	<div class="col-2">
				            		<img style="height: 45px;filter: opacity(16%);" src="assets/images/item-icon.svg"/>
				            	</div>
				            	<div class="col-10">
					            	<h4 class="mb-1 text-white">${resp.data[i].item_name}</h4>
					            	<h6 class="mb-0">${resp.data[i].item_rfid}</h6>
				            	</div>
				            </div>
				        </div>
				    </div>`
				);
			}	
		}
	});
}

// ------------------------------------------ Main app initaion ------------------------------------------ //

let checklistSyncCycle, syncCycle;

app.router.on('/home', () => {
	const syncData = () => {
		app.api.syncItems()
	}
	syncCycle = setInterval(syncData, 1000);
	clearTimeout(checklistSyncCycle);
	app.loadContent('home');
}).resolve();

app.router.on('/settings', () => {
	clearTimeout(syncCycle);
	clearTimeout(checklistSyncCycle);
	app.loadContent('settings');
}).resolve();

app.router.on('/checklist', () => {
	const syncCheckList = () => {
		app.api.syncCheckList()
	}
	checklistSyncCycle = setInterval(syncCheckList, 1000);
	clearTimeout(syncCycle);
	app.loadContent('checklist');
}).resolve();

app.loadHeader();
window.location.hash = '#/home';

