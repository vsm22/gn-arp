var p = this.patcher;

function create() {
	p.newdefault("timepoint", 10, 20);
	p.newdefault("timepoint", 10, 20);
	p.newdefault("timepoint", 10, 20);
	p.newdefault("timepoint", 10, 20);
	p.newdefault("timepoint", 10, 20);
}

function clear() {
	var obj = p.firstobject;
	while (obj !== null && obj !== undefined) {
		var nextobject = obj.nextobject;
		if (!obj.js && obj.varname !== "#0clearbtn" && obj.varname !== "#0createbtn") {
			p.remove(obj);
		}
		obj = nextobject;
	}
}