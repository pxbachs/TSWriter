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
					var el = evt.item;
					//alert(1);
					console.log(el.innerText);
				},
				sort : false //Disabling sorting
			});
}
