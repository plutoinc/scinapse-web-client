declare namespace Scinapse {
  namespace ArticleSearch {
    type SEARCH_SORT_OPTIONS = 'RELEVANCE' | 'MOST_CITATIONS' | 'OLDEST_FIRST' | 'NEWEST_FIRST';

    interface RawQueryParams {
      query: string;
      filter: string;
      page: string;
      sort: SEARCH_SORT_OPTIONS;
    }
  }

  namespace Alert {
    type NotieAlertTypes = 'success' | 'warning' | 'error' | 'info' | 'neutral';

    interface NotieAlertOptions {
      text: string;
      stay: boolean; // default = false
      time: number; // default = 3, minimum = 1,
      position: 'top' | 'bottom'; // default = 'top', enum: ['top', 'bottom']
    }

    interface NotificationActionPayload {
      type: NotieAlertTypes;
      message: string;
      title?: string;
      options?: NotieAlertOptions;
    }
  }

  namespace ActionTicket {
    type ActionTagType =
      | 'pageView'
      | 'authorShow'
      | 'paperShow'
      | 'refList'
      | 'citedList'
      | 'journalShow'
      | 'query'
      | 'downloadPdf'
      | 'source'
      | 'viewFullText'
      | 'viewMorePDF'
      | 'viewLessPDF'
      | 'viewPDF'
      | 'addToCollection'
      | 'removeFromCollection'
      | 'citePaper'
      | 'signUpPopup'
      | 'signInPopup'
      | 'signUp'
      | 'signIn'
      | 'fos'
      | 'copyDoi'
      | 'signInViaCollection'
      | 'blogPost'
      | 'journalHomepage'
      | 'authorEntityItem'
      | 'paperSorting'
      | 'collectionSharing'
      | 'extendAbstract'
      | 'collapseAbstract'
      | 'PUBLISHED_YEAR'
      | 'JOURNAL_IF'
      | 'FOS'
      | 'JOURNAL'
      | 'applySavedFilter'
      | 'applyPreviousFilter'
      | 'addFilter'
      | 'sendRequestFullText'
      | 'clickRequestFullTextBtn'
      | 'journalSearch'
      | 'fosSearch'
      | 'collectionShow'
      | 'addNote'
      | 'removeNote'
      | 'viewNote'
      | 'sendRequestPaper'
      | 'searchHistoryQuery'
      | 'searchSuggestionQuery'
      | 'blockUnsignedUser'
      | 'blockUnverifiedUser'
      | 'openSignUp'
      | 'addToBookmark'
      | 'authorFromSearch'
      | 'doiSearch'
      | 'signBannerAtSearch'
      | 'signBannerAtPaperShow'
      | 'relatedPaperAtPaperShow'
      | 'bannerView'
      | 'researchHistory'
      | 'viewRelatedPaper'
      | 'clickPagination'
      | 'clickLogo'
      | 'clickSignUpAtFirstForm'
      | 'clickSignUpAtStep2'
      | 'alertView'
      | 'clickOk'
      | 'childRefList'
      | 'childCitedList'
      | 'submitSurvey'
      | 'skipSurvey'
      | 'viewBasedOnCollectionPaper'
      | 'viewBasedOnActivityPaper'
      | 'clickSeeMore'
      | 'clickSeeLess'
      | 'clickGoToCollectionBtn'
      | 'clickLetMeSeeBtn'
      | 'clickNoThxBtn'
      | 'viewKnowledgeBaseNoti'
      | 'autoYearFilterQuery'
      | 'cancelAutoYearFilter'
      | 'clickPaperFigure'
      | 'viewFigureList'
      | 'clickPrevBtn'
      | 'clickNextBtn'
      | 'viewFigure'
      | 'clickRefreshButton'
      | 'savedCollection'
      | '';

    type ActionArea = string;

    type PageType =
      | 'paperShow'
      | 'authorShow'
      | 'home'
      | 'searchResult'
      | 'authorSearchResult'
      | 'journalShow'
      | 'collectionShow'
      | 'collectionList'
      | 'signIn'
      | 'signUp'
      | 'resetPassword'
      | 'emailVerification'
      | 'terms'
      | 'privacyPolicy'
      | 'unknown';
  }
}
