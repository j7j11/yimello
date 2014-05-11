/// <reference path="../../dependencies.ts" />

class BookmarkDAO extends DataAccessObject {
	//region Fields
	
	private _url : string;
	private _title : string;
	private _description : string;

	//endregion Fields
	
	//region Constructors
	
	//endregion Constructors
	
	//region Methods
	
	//region Private Methods
	
	//endregion Private Methods
	
	//region Public Methods
	
	getURL() : string {
		return this._url;
	}

	setURL(u : string) : BookmarkDAO {
		this._url = u;
		return this;
	}

	getTitle() : string {
		return this._title;
	}

	setTitle(t : string) : BookmarkDAO {
		this._title = t;
		return this;
	}

	getDescription() : string {
		return this._description;
	}

	setDescription(d : string) : BookmarkDAO {
		this._description = d;
		return this;
	}

	add(callback : Action<boolean> = null) : void {
		var l : IList<any> = new ArrayList<any>();

		l.add(this.getId());
		l.add(this.getURL());
		l.add(this.getTitle());
		l.add(this.getDescription());

		ActiveRecordObject.insert(DAOTables.Bookmarks, l, callback);
	}

	bindToTags(tags : IList<TagDAO>) : void {
		var l : IList<Pair<string, string>> = new ArrayList<Pair<string, string>>();

		tags.forEach((t) => {
			var p : Pair<string, string>;
			p = new Pair<string, string>(this.getId(), t.getId());
			l.add(p);
		});

		ActiveRecordObject.couple(DAOTables.Bookmarks, l);
	}

	//endregion Public Methods
	
	//endregion Methods
}
