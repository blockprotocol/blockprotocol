import {
  VFC,
  useState,
  useEffect,
  Fragment,
  useContext,
  SetStateAction,
  Dispatch,
} from "react";
import {
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import { SiteMapPage, SiteMapPageSection } from "../../lib/sitemap";
import { Link } from "../Link";
import SiteMapContext from "../context/SiteMapContext";
import { itemIsPage, NAVBAR_LINK_ICONS } from "./util";

type MobileNavNestedPageProps<T extends SiteMapPage | SiteMapPageSection> = {
  icon?: JSX.Element;
  item: T;
  parentPageHref: T extends SiteMapPageSection ? string : undefined;
  depth?: number;
  expandedItems: { href: string; depth: number }[];
  setExpandedItems: Dispatch<SetStateAction<{ href: string; depth: number }[]>>;
  onClose: () => void;
};

const MobileNavNestedPage = <T extends SiteMapPage | SiteMapPageSection>({
  icon,
  depth = 0,
  expandedItems,
  parentPageHref,
  setExpandedItems,
  item,
  onClose,
}: MobileNavNestedPageProps<T>) => {
  const router = useRouter();
  const { asPath } = router;
  const { title } = item;

  const isRoot = depth === 0;

  const href = itemIsPage(item)
    ? item.href
    : `${parentPageHref}#${item.anchor}`;

  const isSelected = asPath === href;

  const hasChildren = itemIsPage(item)
    ? item.subPages.length > 0 || item.sections.length > 0
    : item.subSections.length > 0;

  const isOpen =
    hasChildren &&
    expandedItems.some(
      (expandedItem) =>
        expandedItem.href === href && expandedItem.depth === depth,
    );

  return (
    <>
      <Link href={href}>
        <ListItemButton
          selected={isSelected}
          onClick={() => {
            if (hasChildren && !isOpen) {
              setExpandedItems((prev) => [...prev, { href, depth }]);
            }
            onClose();
          }}
          sx={(theme) => ({
            backgroundColor: isRoot ? undefined : theme.palette.gray[20],
            "&.Mui-selected": {
              backgroundColor: isRoot ? undefined : theme.palette.gray[20],
              "&:hover": {
                backgroundColor: isRoot ? undefined : theme.palette.gray[40],
              },
            },
            "&:hover": {
              backgroundColor: isRoot ? undefined : theme.palette.gray[40],
            },
            pl: (icon ? 2 : 4) + depth * 2,
          })}
        >
          {icon || !itemIsPage(item) ? (
            <ListItemIcon
              sx={(theme) => ({
                minWidth: isRoot ? undefined : theme.spacing(3),
              })}
            >
              {icon ?? (
                <Icon
                  sx={{
                    fontSize: 15,
                  }}
                  color="inherit"
                  className="fas fa-hashtag"
                />
              )}
            </ListItemIcon>
          ) : null}
          <ListItemText
            primary={title}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "> .MuiListItemText-primary": {
                display: "inline",
              },
            }}
          />
          {hasChildren ? (
            <IconButton
              sx={{
                transition: (theme) => theme.transitions.create("transform"),
                transform: `rotate(${isOpen ? "0deg" : "-90deg"})`,
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setExpandedItems((prev) =>
                  isOpen
                    ? prev.filter(
                        (expandedItem) =>
                          !(
                            expandedItem.href === href &&
                            expandedItem.depth === depth
                          ),
                      )
                    : [...prev, { href, depth }],
                );
              }}
            >
              <Icon
                sx={{
                  fontSize: 15,
                }}
                fontSize="inherit"
                className="fas fa-chevron-down"
              />
            </IconButton>
          ) : null}
        </ListItemButton>
      </Link>
      {hasChildren ? (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {itemIsPage(item) ? (
              <>
                {item.subPages.map((subPage) => (
                  <MobileNavNestedPage<SiteMapPage>
                    key={subPage.href}
                    depth={depth + 1}
                    item={subPage}
                    parentPageHref={undefined}
                    expandedItems={expandedItems}
                    setExpandedItems={setExpandedItems}
                    onClose={onClose}
                  />
                ))}
              </>
            ) : null}
            {(itemIsPage(item) ? item.sections : item.subSections).map(
              (subSection) => (
                <MobileNavNestedPage<SiteMapPageSection>
                  key={subSection.anchor}
                  depth={depth + 1}
                  parentPageHref={
                    itemIsPage(item) ? item.href : (parentPageHref as string)
                  }
                  item={subSection}
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                  onClose={onClose}
                />
              ),
            )}
          </List>
          {depth === 0 ? <Divider /> : null}
        </Collapse>
      ) : null}
    </>
  );
};

type MobileNavItemsProps = {
  onClose: () => void;
};

const getInitialExpandedItems = ({
  asPath,
  parentHref,
  item,
  depth = 0,
}: {
  asPath: string;
  parentHref?: string;
  item: SiteMapPage | SiteMapPageSection;
  depth?: number;
}): { href: string; depth: number }[] => {
  const expandedChildren = [
    ...(itemIsPage(item)
      ? item.subPages
          .map((page) =>
            getInitialExpandedItems({ item: page, asPath, depth: depth + 1 }),
          )
          .flat()
      : []),
    ...(itemIsPage(item) ? item.sections : item.subSections)
      .map((section) =>
        getInitialExpandedItems({
          item: section,
          asPath,
          depth: depth + 1,
          parentHref: itemIsPage(item) ? item.href : parentHref,
        }),
      )
      .flat(),
  ];

  const href = itemIsPage(item) ? item.href : `${parentHref}#${item.anchor}`;

  const isExpanded = asPath === href || expandedChildren.length > 0;

  return isExpanded
    ? [
        {
          href,
          depth,
        },
        ...expandedChildren,
      ]
    : [];
};

export const MobileNavItems: VFC<MobileNavItemsProps> = ({ onClose }) => {
  const { asPath } = useRouter();
  const { pages } = useContext(SiteMapContext);

  const [expandedItems, setExpandedItems] = useState<
    { href: string; depth: number }[]
  >(
    pages.map((page) => getInitialExpandedItems({ asPath, item: page })).flat(),
  );

  useEffect(() => {
    setExpandedItems((prev) => [
      ...prev,
      ...pages
        .map((page) => getInitialExpandedItems({ asPath, item: page }))
        .flat()
        .filter(
          (expanded) =>
            prev.find(
              ({ depth, href }) =>
                expanded.depth === depth && expanded.href === href,
            ) === undefined,
        ),
    ]);
  }, [asPath, pages]);

  return (
    <List>
      {pages.map((page) => (
        <Fragment key={page.href}>
          <MobileNavNestedPage<SiteMapPage>
            key={page.href}
            icon={NAVBAR_LINK_ICONS[page.title]}
            item={page}
            parentPageHref={undefined}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            onClose={onClose}
          />
        </Fragment>
      ))}
    </List>
  );
};
