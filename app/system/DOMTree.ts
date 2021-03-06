/// <reference path="../dependencies.ts" />

class DOMTreeException extends Exception {

}

class DOMTree extends TSObject {

	private static _document : DOMElement;
	private static _root : DOMElement;

	static append(e : DOMElement) : void {
		DOMTree.findSingle('body').append(e);
	}

	static find(criterion: string) : IList<DOMElement> {
		var results : any = jQuery(document).find(criterion);
		var list : IList<DOMElement> = new ArrayList<DOMElement>();
		
		results.each((i, e) => {
			list.add(DOMElement.fromJS(e));
		});

		return list;
	}

	static findSingle(criterion : string) : DOMElement {
		return new DOMElement(jQuery(document).find(criterion).first());
	}

	static fromString(s : string) : IList<DOMElement> {
		var a : Array<any>;
		var l: IList<DOMElement>;

		a = jQuery.parseHTML(s);

		if (a === null) {
			return null;
		}

		l = new ArrayList<DOMElement>();

		for(var i = 0; i < a.length; i++) {
			var d : DOMElement = DOMElement.fromJS(a[i]);
			l.add(d);
		}

		return l;
	}

	static getDocument() : DOMElement {
		if (!TSObject.exists(DOMTree._document)) {
			DOMTree._document = new DOMElement(jQuery(document));
		}
		return DOMTree._document;
	}

	static getRoot() : DOMElement {
		if (!TSObject.exists(DOMTree._root)) {
			DOMTree._root = new DOMElement(jQuery('body'));
		}
		return DOMTree._root;
	}
}
