var scriptWriterApp = angular.module('scriptWriterApp', []);

function createSortableCloneList(elm) {
	Sortable.create(elm, {
				group : {
					name : 'shared',
					pull : 'clone',
					put : false
				},
				onEnd : function(/**Event*/evt) {
					evt.oldIndex// element's old index within parent
					evt.newIndex// element's new index within parent

					//console.log(el.innerText);

					var el = evt.item;
		            console.log(el.parentElement.className);
		            if(el.parentElement.className == 'list-group sidebarsorttable') {
		            	console.log(el.parentElement.id);
		                var menu = document.getElementById(el.parentElement.id);
		                menu.removeChild(menu.lastElementChild);
		                menu.getElementsByTagName("LI")[evt.oldIndex].style.display = '';
		            }
				},
				sort : false //Disabling sorting
			});
}
