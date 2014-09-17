/// <reference path="../../test_dependencies.ts" />

class BookmarkDAOTest extends UnitTestClass {
	private _dao : BookmarkDAO;

	constructor() {
		super();

		DataAccessObject.setDatabaseName('yimello-test');
	}

	setUp() : void {
		this._dao = new BookmarkDAO();
	}

	tearDown() : void {
		this._dao = null;
	}

	BookmarkDAOURLTest() : void {
		// Arrange
		var url : string = 'http://google.fr';

		// Act
		this._dao.setURL(url);

		// Assert
		this.areIdentical(url, this._dao.getURL());
	}

	BookmarkDAOTitleTest() : void {
		// Arrange
		var title : string = 'Google';

		// Act
		this._dao.setTitle(title);

		// Assert
		this.areIdentical(title, this._dao.getTitle());
	}

	BookmarkDAODescriptionTest() : void {
		// Arrange
		var description : StringBuffer;

		description = new StringBuffer('What about a short description?\n');
		description.append('It could be cool to test if everything is saved :)');

		// Act
		this._dao.setDescription(description.toString());

		// Assert
		this.areIdentical(description.toString(), this._dao.getDescription());
	}

	BookmarkDAOViewsTest() : void {
		// Arrange
		var value : number = 54;

		// Act
		this._dao.setViews(value);

		// Assert
		this.areIdentical(value, this._dao.getViews());
	}

	BookmarkDAOToListTest() : void {
		// Arrange
		var id : string = '1';
		var url : string = 'foo';
		var title : string = 'foobar';
		var description : string = 'foobar powaa';
		var views : number = 30;
		var b : BookmarkDAO = new BookmarkDAO();
		var outcome : IList<any>;

		b.setId(id);
		b.setURL(url);
		b.setTitle(title);
		b.setDescription(description);
		b.setViews(views);

		// Act
		outcome = b.toList();

		// Assert
		this.isTrue(TSObject.exists(outcome));
		this.areIdentical(5, outcome.getLength());
		this.areIdentical(id, outcome.getAt(0));
		this.areIdentical(url, outcome.getAt(1));
		this.areIdentical(title, outcome.getAt(2));
		this.areIdentical(description, outcome.getAt(3));
		this.areIdentical(views, outcome.getAt(4));
	}

	BookmarkDAOAddTest() : void {
		UnitTestClass.queue(
			() => {
				// Arrange
				var bookmark : BookmarkDAO;

				bookmark = new BookmarkDAO();
				bookmark.setId('foo');
				bookmark.setURL('An url');
				bookmark.setTitle('A title');
				bookmark.setDescription('A description');
				bookmark.setViews(50);

				// Act
				bookmark.add(
					(outcome) => {
						// Assert
						var result : BookmarkDAO = outcome;

						this.isTrue(TSObject.exists(outcome));

						this.areNotIdentical(bookmark.getId(), outcome.getId());
						this.areIdentical(bookmark.getURL(), outcome.getURL());
						this.areIdentical(bookmark.getTitle(), outcome.getTitle());
						this.areIdentical(bookmark.getDescription(), outcome.getDescription());
						this.areIdentical(bookmark.getViews(), outcome.getViews());

						ActiveRecordObject.get<BookmarkDAO>(
							DAOTables.Bookmarks,
							(outcome) => {
								this.isTrue(TSObject.exists(outcome));
								this.areIdentical(1, outcome.getLength());
								this.areIdentical(result.getId(), outcome.getAt(0).getId());

								DataAccessObject.clean((success) => UnitTestClass.done());
							},
							BookmarkDAO.fromObject
						);
					}
				);
			}
		);
	}

	BookmarkUpdateTest() : void {
		UnitTestClass.queue(
			() => {
				// Arrange
				var b : BookmarkDAO;
				var id : string = '1';

				b = new BookmarkDAO();
				b.setId(id);
				b.setTitle('foo');
				DataAccessObject.initialize(
					(success) => {
						ActiveRecordObject.insert(
							DAOTables.Bookmarks,
							b.toList(),
							(success) => {
								b.setTitle('foobar');

								// Act
								b.update(
									(outcome) => {
										// Assert
										this.isTrue(TSObject.exists(outcome));
										this.areIdentical(b.getId(), outcome.getId());
										this.areIdentical(b.getTitle(), outcome.getTitle());

										ActiveRecordObject.get<BookmarkDAO>(
											DAOTables.Bookmarks,
											(outcome) => {
												this.areIdentical(1, outcome.getLength());
												this.areIdentical(b.getId(), outcome.getAt(0).getId());
												this.areIdentical(b.getTitle(), outcome.getAt(0).getTitle());

												DataAccessObject.clean((s) => UnitTestClass.done());
											},
											BookmarkDAO.fromObject
										);
									}
								);
							}
						);
					}
				);
			}
		);
	}

	BookmarkDAODeleteTest() : void {
		UnitTestClass.queue(
			() => {
				// Arrange
				var bookmark : BookmarkDAO;

				bookmark = new BookmarkDAO();
				bookmark.setId('1');

				DataAccessObject.initialize(
					(success) => {
						ActiveRecordObject.insert(
							DAOTables.Bookmarks,
							bookmark.toList(),
							(b) => {
								// Act
								bookmark.delete(
									(outcome) => {
										// Assert
										this.isTrue(outcome);

										ActiveRecordObject.get<BookmarkDAO>(
											DAOTables.Bookmarks,
											(outcome) => {
												this.isTrue(TSObject.exists(outcome));
												this.areIdentical(0, outcome.getLength());

												DataAccessObject.clean((success) => UnitTestClass.done());
											},
											BookmarkDAO.fromObject
										);
									}
								);
							}
						);
					}
				);
			}
		);
	}

	BookmarkDaoGetTest() : void {
		UnitTestClass.queue(
			() => {
				// Arrange
				var b1 : BookmarkDAO, b2 : BookmarkDAO;

				b1 = new BookmarkDAO();
				b1.setId('1');
				b1.setTitle('foo');
				b2 = new BookmarkDAO();
				b2.setId('2');
				b2.setTitle('foobar');

				DataAccessObject.initialize(
					(success) => {
						ActiveRecordObject.insert(
							DAOTables.Bookmarks,
							b1.toList(),
							(success) => {
								ActiveRecordObject.insert(
									DAOTables.Bookmarks,
									b2.toList(),
									(success) => {
										// Act
										BookmarkDAO.get(
											(outcome) => {
												// Assert
												this.isTrue(TSObject.exists(outcome));

												this.areIdentical(2, outcome.getLength());
												this.areIdentical(b1.getId(), outcome.getAt(0).getId());
												this.areIdentical(b1.getTitle(), outcome.getAt(0).getTitle());
												this.areIdentical(b2.getId(), outcome.getAt(1).getId());
												this.areIdentical(b2.getTitle(), outcome.getAt(1).getTitle());

												DataAccessObject.clean((success) => UnitTestClass.done());
											}
										);
									}
								);
							}
						);
					}
				);
			}
		);
	}

	BookmarkDaoFindTest() : void {
		UnitTestClass.queue(
			() => {
				// Arrange
				var b1 : BookmarkDAO, b2 : BookmarkDAO;

				b1 = new BookmarkDAO();
				b1.setId('1');
				b1.setTitle('foo');
				b2 = new BookmarkDAO();
				b2.setId('2');
				b2.setTitle('foobar');

				DataAccessObject.initialize(
					(success) => {
						ActiveRecordObject.insert(
							DAOTables.Bookmarks,
							b1.toList(),
							(success) => {
								ActiveRecordObject.insert(
									DAOTables.Bookmarks,
									b2.toList(),
									(success) => {
										// Act
										BookmarkDAO.find(
											'1',
											(outcome) => {
												// Assert
												this.isTrue(TSObject.exists(outcome));
												this.areIdentical(b1.getId(), outcome.getId());
												this.areIdentical(b1.getTitle(), outcome.getTitle());

												DataAccessObject.clean((success) => UnitTestClass.done());
											}
										);
									}
								);
							}
						);
					}
				);
			}
		);
	}

	BookmarkDAOSortByViewsDescThenByTitleAscTest() : void {
		UnitTestClass.queue(
			() => {
				// Arrange
				var b1 : BookmarkDAO, b2 : BookmarkDAO, b3 : BookmarkDAO;

				b1 = new BookmarkDAO();
				b1
					.setTitle('Joe Pesci')
					.setViews(50)
					.setId('1');
				b2 = new BookmarkDAO();
				b2
					.setTitle('Robert de Niro')
					.setViews(50)
					.setId('2');
				b3 = new BookmarkDAO();
				b3
					.setTitle('Al Pacino')
					.setViews(200)
					.setId('3');

				DataAccessObject.initialize(
					(success) => {
						ActiveRecordObject.insert(
							DAOTables.Bookmarks,
							b1.toList(),
							(success) => {
								ActiveRecordObject.insert(
									DAOTables.Bookmarks,
									b2.toList(),
									(success) => {
										ActiveRecordObject.insert(
											DAOTables.Bookmarks,
											b3.toList(),
											(success) => {
												// Act
												BookmarkDAO.sortByViewsDescThenByTitleAsc(
													(outcome) => {
														// Assert
														this.isTrue(TSObject.exists(outcome));

														this.areIdentical(3, outcome.getLength());
														this.areIdentical(b3.getTitle(), outcome.getAt(0).getTitle());
														this.areIdentical(b3.getViews(), outcome.getAt(0).getViews());
														this.areIdentical(b1.getTitle(), outcome.getAt(1).getTitle());
														this.areIdentical(b1.getViews(), outcome.getAt(1).getViews());
														this.areIdentical(b2.getTitle(), outcome.getAt(2).getTitle());
														this.areIdentical(b2.getViews(), outcome.getAt(2).getViews());

														DataAccessObject.clean((success) => UnitTestClass.done());
													}
												);
											}
										);
									}
								);
							}
						);
					}
				);
			}
		);
	}

	BookmarkDAOSortByTileAscTest() : void {
		UnitTestClass.queue(
			() => {
				// Arrange
				var b1 : BookmarkDAO, b2 : BookmarkDAO, b3 : BookmarkDAO;

				b1 = new BookmarkDAO();
				b1
					.setTitle('Joe Pesci')
					.setId('1');
				b2 = new BookmarkDAO();
				b2
					.setTitle('Robert de Niro')
					.setId('2');
				b3 = new BookmarkDAO();
				b3
					.setTitle('Al Pacino')
					.setId('3');

				DataAccessObject.initialize(
					(success) => {
						ActiveRecordObject.insert(
							DAOTables.Bookmarks,
							b1.toList(),
							(success) => {
								ActiveRecordObject.insert(
									DAOTables.Bookmarks,
									b2.toList(),
									(success) => {
										ActiveRecordObject.insert(
											DAOTables.Bookmarks,
											b3.toList(),
											(success) => {
												// Act
												BookmarkDAO.sortByViewsDescThenByTitleAsc(
													(outcome) => {
														// Assert
														this.isTrue(TSObject.exists(outcome));

														this.areIdentical(3, outcome.getLength());
														this.areIdentical(b3.getTitle(), outcome.getAt(0).getTitle());
														this.areIdentical(b1.getTitle(), outcome.getAt(1).getTitle());
														this.areIdentical(b2.getTitle(), outcome.getAt(2).getTitle());

														DataAccessObject.clean((success) => UnitTestClass.done());
													}
												);
											}
										);
									}
								);
							}
						);
					}
				);
			}
		);
	}
}

UnitTestClass.handle(new BookmarkDAOTest());
