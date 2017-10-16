import * as React from "react";
import Popover from "material-ui/Popover/Popover";
import { FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "../records";
import Icon from "../../../icons";
const styles = require("./feedNavbar.scss");

export interface IFeedNavbarProps {
  currentSortingOption: FEED_SORTING_OPTIONS;
  isCategoryPopOverOpen: boolean;
  categoryPopoverAnchorElement: React.ReactInstance | null;
  currentCategory: FEED_CATEGORIES;
  handleClickSortingOption: (sortingOption: FEED_SORTING_OPTIONS) => void;
  handleOpenCategoryPopover: (element: React.ReactInstance) => void;
  handleCloseCategoryPopover: () => void;
  handleChangeCategory: (category: FEED_CATEGORIES) => void;
}

export interface IFeedNavbarSortItemProps {
  currentSotringOption: FEED_SORTING_OPTIONS;
  type: FEED_SORTING_OPTIONS;
  text: string;
  handleClickSortingOption: (sortingOption: FEED_SORTING_OPTIONS) => void;
}

export interface ICategoryItemProps {
  currentCategory: FEED_CATEGORIES;
  type: FEED_CATEGORIES;
  text: string;
  handleChangeCategory: (category: FEED_CATEGORIES) => void;
}

const FeedNavbarSortItem = ({
  currentSotringOption,
  type,
  text,
  handleClickSortingOption,
}: IFeedNavbarSortItemProps) => {
  let sortClassName: string;
  if (currentSotringOption === type) {
    sortClassName = `${styles.sortItem} ${styles.activeSortItem}`;
  } else {
    sortClassName = styles.sortItem;
  }

  return (
    <span
      onClick={() => {
        handleClickSortingOption(type);
      }}
      className={sortClassName}
    >
      {text}
    </span>
  );
};

const CategoryItem = ({ currentCategory, type, text, handleChangeCategory }: ICategoryItemProps) => {
  let categoryClassName: string;
  if (currentCategory === type) {
    categoryClassName = `${styles.popoverItem} ${styles.activePopoverItem}`;
  } else {
    categoryClassName = styles.popoverItem;
  }
  return (
    <div
      onClick={() => {
        handleChangeCategory(type);
      }}
      className={categoryClassName}
    >
      {text}
    </div>
  );
};

const FeedNavbar = (props: IFeedNavbarProps) => {
  return (
    <div className={styles.feedNavbarWrapper}>
      <div className={styles.navbarWrapper}>
        <div className={styles.leftBox}>
          <FeedNavbarSortItem
            handleClickSortingOption={props.handleClickSortingOption}
            currentSotringOption={props.currentSortingOption}
            type={FEED_SORTING_OPTIONS.SCORE}
            text="Score"
          />
          <FeedNavbarSortItem
            handleClickSortingOption={props.handleClickSortingOption}
            currentSotringOption={props.currentSortingOption}
            type={FEED_SORTING_OPTIONS.LATEST}
            text="Latest"
          />
        </div>
        <div className={styles.rightbox}>
          <span
            onClick={e => {
              props.handleOpenCategoryPopover(e.currentTarget);
            }}
            className={styles.categoryBox}
          >
            <span className={styles.categoryDropdownText}>Select Category</span>
            <Icon className={styles.categoryDropdownIcon} icon="OPEN_ARTICLE_EVALUATION" />
          </span>
        </div>
      </div>
      <Popover
        open={props.isCategoryPopOverOpen && !!props.categoryPopoverAnchorElement}
        anchorEl={props.categoryPopoverAnchorElement}
        anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
        targetOrigin={{ horizontal: "middle", vertical: "top" }}
        onRequestClose={props.handleCloseCategoryPopover}
        style={{
          borderRadius: "10px",
          boxShadow: "none",
          border: "none",
        }}
      >
        <div className={styles.popoverMenuWrapper}>
          <CategoryItem
            currentCategory={props.currentCategory}
            handleChangeCategory={props.handleChangeCategory}
            type={FEED_CATEGORIES.ALL}
            text="All"
          />
          <CategoryItem
            currentCategory={props.currentCategory}
            handleChangeCategory={props.handleChangeCategory}
            type={FEED_CATEGORIES.POST_PAPER}
            text="Post Paper"
          />
          <CategoryItem
            currentCategory={props.currentCategory}
            handleChangeCategory={props.handleChangeCategory}
            type={FEED_CATEGORIES.PRE_PAPER}
            text="Pre Paper"
          />
          <CategoryItem
            currentCategory={props.currentCategory}
            handleChangeCategory={props.handleChangeCategory}
            type={FEED_CATEGORIES.TECH_WHITE_PAPER}
            text="Tech Whitepaper"
          />
          <CategoryItem
            currentCategory={props.currentCategory}
            handleChangeCategory={props.handleChangeCategory}
            type={FEED_CATEGORIES.TECH_BLOG}
            text="Tech Blog"
          />
        </div>
      </Popover>
    </div>
  );
};

export default FeedNavbar;
