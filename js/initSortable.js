

var backupElement;
Sortable.create(touching, {
    group: {
        name: 'shared',
        pull: 'clone',
        put: false
    },
    sort: false         //Disabling sorting
});

Sortable.create(features, {
    group: {
        name: 'scenario',
        pull: true
    },
    animation: 200,
});

Sortable.create(trashcan, {
    group: {
        name: 'scenario',
        pull: true
    },
    // Element is dropped into the list from another list
    onAdd: function (/**Event*/evt) {
        var el = evt.item;
        el.parentNode.removeChild(el);
    }
});

Sortable.create(features, {
    animation: 200,
});


function initSortable(scenarioitem) {
    Sortable.create(scenarioitem, {
    group: {
        name: 'shared',
        put: true
    },
    // Element is dropped into the list from another list
    onAdd: function (evt) {
        var el = evt.item; // dragged HTMLElement
        var el_tmp;
        el.setAttribute('class', 'sorttable');
        if(el.innerHTML.indexOf('js-remove') == -1) 
            el_tmp = el.innerHTML + '<button type="button" class="js-remove btn btn-danger btn-xs">Delete</button> <button type="button" class="js-edit btn btn-warning btn-xs">Edit</button>';
        else 
            el_tmp = el.innerHTML;
        var el_bu = el;
        //el.parentNode.removeChild(el);
        el_bu.innerHTML = el_tmp;
        //console.log(el_bu);
        el_bu.parentNode.appendChild(el_bu);
        resetSidebar();
        initFeatureMenuSortable(document.getElementById('touching'));
    },
    // Called by any change to the list (add / update / remove)
    onSort: function (/**Event*/evt) {
        var itemEl = evt.item; // dragged HTMLElement
    },

    filter: '.js-edit, .js-remove',
     // Attempt to drag a filtered element
    onFilter: function (evt) {
        var ctrl = evt.target;
        if (Sortable.utils.is(ctrl, '.js-remove')) {
            evt.from.removeChild(evt.item);
        }
        else {
            var el = evt.item.firstElementChild,
                name = el.innerHTML;
            var editValue = prompt("Edit:", name);
            if(editValue != null)
                el.innerHTML = editValue;
        }
    }
	});
}

function initFeatureMenuSortable(scenarioitem) {
	Sortable.create(scenarioitem, {
		group: {
		    name: 'shared',
		    pull: 'clone',
		    put: false
		},
		onStart: function (/**Event*/evt) {
		    evt.oldIndex;  // element index within parent
		    backupElement = evt.item.innerHTML;
		},
		onEnd: function (/**Event*/evt) {
		    var el = evt.item;
		    
		    
		},
		sort: false         //Disabling sorting
	});
}
