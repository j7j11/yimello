/// <reference path="../../../dependencies.ts" />

class ArrayList<T> extends TSObject implements IList<T> {
	//region Fields

	private _content : Array<T>;

	//endregion Fields

	//region Constructors

	constructor() {
		super();

		this._content = new Array();
	}

	//endregion Constructors

	//region Methods

	//region Private Methods

	//endregion Private Methods

	//region Public Methods

	add(t: T) : void {
		this._content.push(t);
	}

	clone() : IList<T> {
		var l : IList<T> = new ArrayList<T>();

		for (var i = 0; i < this.getLength(); i++) {
			l.add(this.getAt(i));
		}

		return l;
	}

	forEach(f : Action<T>) : void {
		for(var i = 0; i < this.getLength() ; i++) {
			f(this.getAt(i));
		}
	}

	getAt(index: number) : T {
		return this._content[index];
	}

	getLength() : number {
		return this._content.length;
	}

	insertAt(index : number, t : T) : void {

		if (index > this.getLength() || index < 0) {
			throw new Exception('Unbound index');
		}

		if (index === this.getLength() || this.getLength() === 0) {
			this.add(t);
			return;
		}

		this._content.splice(index, 0, t);
	}

	map(f: Action<T>) : void {
		for(var i = 0; i < this._content.length; i++) {
			f(this._content[i]);
		}
	}

	toArray() : Array<T> {
		return this._content;
	}

	//endregion Public Methods

	//endregion Methods
}
