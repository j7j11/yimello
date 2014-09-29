/// <reference path="../../dependencies.ts" />

class MainPresenter
	extends YimelloPresenter
	implements
		IBookmarkListListener,
		ITagListMenuListener,
	 	ISearchBarListener,
	 	IBookmarkFormMenuListener,
	 	IBookmarkDeletionMenuListener,
	 	ITagFormMenuListener {
	//region Fields

	private _searchBar : SearchBar;
	private _bookmarkList : BookmarkList;
	private _tagListMenu : TagListMenu;
	private _bookmarkFormMenu : BookmarkFormMenu;
	private _bookmarkDeletionMenu : BookmarkDeletionMenu;
	private _tagFormMenu : TagFormMenu;

	private _currentTag : DOMElement;
	
	//endregion Fields
	
	//region Constructors
	
	//endregion Constructors
	
	//region Methods
	
	//region Private Methods

	private _setMenu() : void {
		var menuTrigger : DOMElement, menu : DOMElement, view : DOMElement;
		var hideMenu : Action0, showMenu : Action0, isMenuVisible : Action0;

		view = DOMTree.findSingle('.js-main-view');
		menu = DOMTree.findSingle('.js-menu');
		menuTrigger = DOMTree.findSingle('.js-menu-trigger');

		isMenuVisible = () => {
			return menu.hasClass('visible');
		};

		hideMenu = () => {
			if (isMenuVisible()) {
				menu.removeClass('visible');
				view.removeClass('background');
			}
		};

		showMenu = () => {
			if (!isMenuVisible()) {
				menu.addClass('visible');
				view.addClass('background');
			}
		};

		menuTrigger.on(
			DOMElementEvents.Click,
			(args) => {
				if (isMenuVisible()) {
					hideMenu();
				} else {
					showMenu();
				}
			}
		);

		DOMTree.getDocument().on(
			DOMElementEvents.KeyDown,
			(args) => {
				if (args.getWhich() === 27) {
					hideMenu();
				}
			}
		);

		menu
			.find('li')
			.forEach(
				(e) => {
					e.on(
						DOMElementEvents.Click,
						(args) => {
							hideMenu();
							if (e.hasClass('js-tour-trigger')) {
								NodeWindow.moveTo('tour.html');
							}
						}
					);
				}
			);
	}

	private _setCurrentTag(value : string) : void {
		this._currentTag.setText(value);
	}
	
	//endregion Private Methods
	
	//region Public Methods

	onStart() : void {
		super.onStart();

		this._setMenu();
		this._searchBar = new SearchBar(this);
		this._bookmarkList = new BookmarkList(this);
		this._tagListMenu = new TagListMenu(this);
		this._bookmarkFormMenu = new BookmarkFormMenu(this, super.getNotifier());
		this._bookmarkDeletionMenu = new BookmarkDeletionMenu(this, super.getNotifier());
		this._tagFormMenu = new TagFormMenu(this, super.getNotifier());

		this._currentTag = DOMTree.findSingle('.js-current-tag');

		this.onMostPopularSelection();
	}

	//region IBookmarkListListener

	onBookmarkUpdateRequest(id : string) : void {
		BusinessFactory.buildBookmark(
			(business) => {
				business.find(
					id,
					(outcome) => {
						this._bookmarkFormMenu.prepareUpdate(outcome);
					}
				);
			}
		);
	}

	onBookmarkDeletionRequest(id : string) : void {
		BusinessFactory.buildBookmark(
			(business) => {
				business.find(
					id,
					(outcome) => {
						this._bookmarkDeletionMenu.run(outcome);
					}
				);
			}
		);
	}

	//endregion IBookmarkListListener

	//region ITagListMenuSubscriber

	onMostPopularSelection() : void {
		this._searchBar.reset();
		this._bookmarkList.sortMostPopular();
		this._setCurrentTag('Most popular');
	}

	onTagSelection(t : Tag) : void {
		this._searchBar.reset();
		this._bookmarkList.sortForTag(t);
		this._setCurrentTag(t.getLabel());
	}

	//endregion ITagListMenuSubscriber

	//region ISearchBarListener

	onSearchRequest(input : string) : void {
		this._bookmarkList.search(input);
		this._setCurrentTag('Search Results');
	}

	onSearchCancel() : void {
		this.onMostPopularSelection();
	}

	//endregion ISearchBarListener

	//region IBookmarkFormMenuListener

	onBookmarkAddition() : void {
		super.getNotifier().inform('Yes! A new buddy is joining us :)');
		this._bookmarkList.refresh();
	}

	onBookmarkUpdate() : void {
		super.getNotifier().inform('All your changes have been saved');
		this._bookmarkList.refresh();
	}

	//endregion IBookmarkFormMenuListener

	//region IBookmarkDeletionMenuListener

	onBookmarkDeletion() : void {
		super.getNotifier().inform('Bye bye old chap :(');
	}

	//endregion IBookmarkDeletionMenuListener

	//region ITagFormMenuListener

	onTagAddition() : void {
		super.getNotifier().inform('Welcome on board!');
	}

	onTagUpdate() : void {
		super.getNotifier().inform('Alright, everything was stored');
	}

	//endregion ITagFormMenuListener
	
	//endregion Public Methods
	
	//endregion Methods
}

// class MainPresenter
// 	extends YimelloPresenter
// 	implements
// 		IBookmarkFormSubscriber,
// 		ITagListSubscriber,
// 		IBookmarkListSubscriber,
// 		IMenuControlSubscriber {
// 	//region Fields
	
// 	/**
// 	 * Main view wrapper
// 	 */
// 	private _mainViewWrapper : DOMElement;

// 	/**
// 	 * Wrapper of bookmark form
// 	 */
// 	private _bookmarkFormWrapper : DOMElement;

// 	/**
// 	 * Triggers outbreak of bookmark form
// 	 */
// 	private _bookmarkAddTrigger : DOMElement;

// 	private _searchField : DOMElement;

// 	private _bookmarkForm : BookmarkForm;
// 	private _tagList : TagList;
// 	private _bookmarkList : BookmarkList;
// 	private _menu : MenuControl;

// 	private _searchTimer : Timer;

// 	//endregion Fields
	
// 	//region Constructors

// 	constructor() {
// 		super();

// 		// this._bookmarkForm = new BookmarkForm(this);
// 		// this._tagList = new TagList(this);
// 		// this._bookmarkList = new BookmarkList(this);
// 		// this._menu = new MenuControl(this);
// 	}

// 	//endregion Constructors
	
// 	//region Methods
	
// 	//region Private Methods
	
// 	private _setTagListHeight() : void {
// 		var e : DOMElement, f : DOMElement;

// 		e = DOMTree.findSingle('.js-icon-wrapper');
// 		f = DOMTree.findSingle('.js-panel-wrapper');

// 		DOMTree
// 			.findSingle('.js-tag-list-wrapper')
// 			.setCss({
// 				top : 30 + e.getHeight(),
// 				height : f.getHeight() - 30 - e.getHeight()
// 			});
// 	}

// 	private _switchToBookmarkForm() : void {
// 		this._mainViewWrapper.animate(
// 			{
// 				left: '-100%'
// 			},
// 			500
// 		);

// 		this._bookmarkFormWrapper.animate(
// 			{
// 				left: 0
// 			},
// 			500
// 		);
// 	}

// 	private _switchFromBookmarkForm() : void {
// 		this._bookmarkFormWrapper.animate(
// 			{
// 				left: '100%'
// 			},
// 			500
// 		);

// 		this._mainViewWrapper.animate(
// 			{
// 				left: 0
// 			},
// 			500
// 		);
// 	}

// 	private _afterBookmarkEdition() : void {
// 		this._tagList.resetList(
// 			() => {
// 				if (this._tagList.isMostPopularSelected()) {
// 					this._bookmarkList.displayMostPopular();
// 				} else if (this._tagList.isSearchTabSelected()) {
// 					this._bookmarkList.displayForSeachInput(this._searchField.getValue());
// 				} else {
// 					this.onTagSelection(this._tagList.getCurrentTagId());
// 				}
// 			}
// 		);
		

// 		this._switchFromBookmarkForm();
// 		this._searchField.setValue('');
// 	}

// 	private _afterTagEdition() : void {
// 		this._tagList.resetList();
// 	}

// 	//endregion Private Methods
	
// 	//region Public Methods
	
// 	onStart() : void {
// 		super.onStart();

// 		this._mainViewWrapper = DOMTree.findSingle('.js-main-view-wrapper');
// 		this._bookmarkAddTrigger = DOMTree.findSingle('.js-bookmark-add-trigger');
// 		this._bookmarkFormWrapper = DOMTree.findSingle('.js-bookmark-form-wrapper');
// 		this._searchField = DOMTree.findSingle('.js-search-engine form input[name="searchField"]');

// 		this._setTagListHeight();

// 		DOMTree
// 			.find('form')
// 			.forEach(
// 				(e) => {
// 					e.on(
// 						DOMElementEvents.Submit,
// 						(arg) => {
// 							arg.preventDefault();
// 						}
// 					);
// 				}
// 			);

// 		this._bookmarkAddTrigger.on(DOMElementEvents.Click, (arg) => {
// 			this._bookmarkForm.resetToAdd();
// 			this._switchToBookmarkForm();
// 		});

// 		this._searchField.on(
// 			DOMElementEvents.KeyUp,
// 			(arg) => {
// 				var value : string = this._searchField.getValue();

// 				if (TSObject.exists(this._searchTimer)) {
// 					this._searchTimer.stop();
// 				}

// 				if (value.length >= 3) {
// 					this._searchTimer = new Timer(
// 						(o) => {
// 							this._tagList.enableSearchTab();
// 							this._bookmarkList.displayForSeachInput(value);
// 						},
// 						500
// 					);
// 				} else if (value === '') {
// 					this._tagList.disableSearchTab();
// 					if (this._tagList.isMostPopularSelected() || this._tagList.isSearchTabSelected()) {
// 						this._bookmarkList.displayMostPopular();
// 						this._tagList.selectMostPopular();
// 					} else {
// 						this.onTagSelection(this._tagList.getCurrentTagId());
// 					}
// 					this._tagList.resetList();
// 				}
// 			}
// 		);

// 		this._tagList.resetList(() => this._tagList.selectMostPopular());
// 		this._bookmarkList.displayMostPopular();
// 	}

// 	onPause() : void {
// 		super.onPause();
		
// 		this._bookmarkList.unfocus();
// 	}
	
// 	//region IBookmarkFormSubscriber

// 	onBookmarkCancellation() : void {
// 		this._switchFromBookmarkForm();
// 	}

// 	onBookmarkAddition() : void {
// 		this.showNotification('Yes! A new buddy is joining us :)');
// 		this._afterBookmarkEdition();
// 	}

// 	onBookmarkUpdate() : void {
// 		this.showNotification('All your changes have been saved');
// 		this._afterBookmarkEdition();
// 	}

// 	onBookmarkDeletion() : void {
// 		this.showNotification('Bye bye old chap :(');
// 		this._afterBookmarkEdition();
// 	}

// 	//endregion IBookmarkFormSubscriber

// 	//region ITagListSubscriber

// 	onMostPopularSelection() : void {
// 		this._bookmarkList.displayMostPopular();
// 	}

// 	onTagSelection(tagId : string) : void {
// 		// TagDAO.find(
// 		// 	tagId,
// 		// 	(outcome) => {
// 		// 		this._bookmarkList.displayForTag(outcome);
// 		// 	}
// 		// );
// 	}

// 	onSearchTabSelection() : void {
// 		this._bookmarkList.displayForSeachInput(this._searchField.getValue());
// 	}

// 	onTagDeletion() : void {
// 		this._bookmarkList.displayMostPopular();
// 		this._tagList.resetList(() => this._tagList.selectMostPopular());
// 		this._searchField.setValue('');
// 		this.showNotification('See you mate :(');
// 	}

// 	askingForTagUpdate(tagId : string) : void {
// 		// TagDAO.find(
// 		// 	tagId,
// 		// 	(outcome) => {
// 		// 		this._menu.prepareForTagUpdate(outcome);
// 		// 	}
// 		// );
// 	}

// 	//endregion ITagListSubscriber

// 	//region IBookmarkListSubscriber

// 	onBookmarkSelection(bookmarkId : string) : void {
// 		// BookmarkDAO.find(
// 		// 	bookmarkId,
// 		// 	(outcome) => {
// 		// 		this._bookmarkForm.resetToUpdate(outcome);
// 		// 		this._switchToBookmarkForm();
// 		// 	}
// 		// );
// 	}

// 	//endregion IBookmarkListSubscriber

// 	//region IMenuControlSubscriber

// 	onTagAddition() : void {
// 		this._afterTagEdition();
// 		this.showNotification('Hello my friend!');
// 	}

// 	onTagUpdate() : void {
// 		this._afterTagEdition();
// 		this.showNotification('Alright, everything was stored');
// 	}

// 	onTagCancellation() : void {
// 		// Nothing to do
// 	}

// 	//endregion IMenuControlSubscriber

// 	//endregion Public Methods
	
// 	//endregion Methods
// }
