import type { ISbStoryData } from "storyblok";
export interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: unknown;
  text?: string;
  [k: string]: unknown;
}

export interface AnnotatedImageStoryblok {
  disable_lightbox?: boolean;
  above?: boolean;
  centered?: boolean;
  rounded_corners?: boolean;
  add_shadow?: boolean;
  use_original?: boolean;
  width?: string;
  height?: string;
  browser_bar?: "" | "dark" | "light";
  browser_bar_address?: string;
  alt?: string;
  link?: string;
  caption?: RichtextStoryblok;
  note?: string;
  _uid: string;
  component: "annotated_image";
  [k: string]: unknown;
}

export interface AppsStoryblok {
  banner?: AppStoreBannerStoryblok[];
  _uid: string;
  component: "apps";
  [k: string]: unknown;
}

export interface AssetStoryblok {
  alt?: string;
  copyright?: string;
  id: number;
  filename: string;
  name: string;
  title?: string;
  focus?: string;
  [k: string]: unknown;
}

export interface AppStoreBannerStoryblok {
  headline: string;
  description: RichtextStoryblok;
  image: AssetStoryblok;
  cta: EnterpriseCtaStoryblok[];
  enable_background_color?: boolean;
  headline_size: "" | "default" | "small";
  _uid: string;
  component: "app_store_banner";
  [k: string]: unknown;
}

export interface AuthorStoryblok {
  image?: string;
  given_name?: string;
  family_name?: string;
  about?: string;
  email?: string;
  cta?: TextLogosLinksStoryblok[];
  instagram_account?: string;
  linkedin_account?: string;
  discord_account?: string;
  twitter_account?: string;
  github_account?: string;
  _uid: string;
  component: "author";
  [k: string]: unknown;
}

export interface AvatarsStoryblok {
  images: ImageStoryblok[];
  enable_outline?: boolean;
  _uid: string;
  component: "avatars";
  [k: string]: unknown;
}

export interface BannerStoryblok {
  subheadline?: string;
  headline?: string;
  description?: RichtextStoryblok;
  image?: AssetStoryblok;
  _uid: string;
  component: "banner";
  [k: string]: unknown;
}

export interface BannerSectionStoryblok {
  logo?: AssetStoryblok;
  sub_headline?: string;
  headline?: string;
  image?: AssetStoryblok;
  ctas?: EnterpriseCtaStoryblok[];
  video_url?: string;
  _uid: string;
  component: "banner_section";
  [k: string]: unknown;
}

export interface BeastStoryblok {
  sub_headline: string;
  headline: string;
  text_column_1: RichtextStoryblok;
  text_column_2?: RichtextStoryblok;
  ctas: NestedCtaStoryblok[];
  mobile_image?: AssetStoryblok;
  _uid: string;
  component: "beast";
  [k: string]: unknown;
}

export interface BlocksGroupStoryblok {
  background_color?: "" | " " | "grey";
  content_width?: "" | " " | "large" | "medium-large" | "medium" | "small";
  spacing?: "" | "small" | "large";
  blocks?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  row?: boolean;
  _uid: string;
  component: "blocks_group";
  [k: string]: unknown;
}

export interface BlogCategoryListingStoryblok {
  category?: number | string;
  cta?: TextLogosLinksStoryblok[];
  _uid: string;
  component: "blog_category_listing";
  [k: string]: unknown;
}

export type MultilinkStoryblok =
  | {
      id?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "story";
      target?: "_self" | "_blank";
      story?: {
        name: string;
        created_at?: string;
        published_at?: string;
        id: number;
        uuid: string;
        content?: {
          [k: string]: unknown;
        };
        slug: string;
        full_slug: string;
        sort_by_date?: null | string;
        position?: number;
        tag_list?: string[];
        is_startpage?: boolean;
        parent_id?: null | number;
        meta_data?: null | {
          [k: string]: unknown;
        };
        group_id?: string;
        first_published_at?: string;
        release_id?: null | number;
        lang?: string;
        path?: null | string;
        alternates?: unknown[];
        default_full_slug?: null | string;
        translated_slugs?: null | unknown[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    }
  | {
      url?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "asset" | "url";
      target?: "_self" | "_blank";
      [k: string]: unknown;
    }
  | {
      email?: string;
      linktype?: "email";
      target?: "_self" | "_blank";
      [k: string]: unknown;
    };

export interface BlogEntryStoryblok {
  preview_image?: AssetStoryblok;
  teaser?: string;
  authors?: unknown[];
  category: (number | string)[];
  case_studies?: (ISbStoryData<EnterpriseCaseStudyStoryblok> | string)[];
  copyright_text?: string;
  copyright_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  title?: string;
  body?: (
    | AnnotatedImageStoryblok
    | CodeblockStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabsStoryblok
    | MarkdownStoryblok
    | SingleQuoteStoryblok
    | TextLogosLinksStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
  )[];
  cta?: TextLogosLinksStoryblok[];
  og_image?: string;
  og_description?: string;
  og_title?: string;
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  _uid: string;
  component: "blog_entry";
  [k: string]: unknown;
}

export interface BlogListingStoryblok {
  featured_entry?: unknown;
  popular_entries?: (ISbStoryData<BlogEntryStoryblok> | string)[];
  ctas?: TextLogosLinksStoryblok[];
  _uid: string;
  component: "blog_listing";
  [k: string]: unknown;
}

export interface BlogSliderStoryblok {
  headline?: string;
  subheadline?: string;
  link?: TextLinkStoryblok[];
  category?: number | string;
  _uid: string;
  component: "blog_slider";
  [k: string]: unknown;
}

export interface BoxesSliderStoryblok {
  headline?: string;
  subheadline?: string;
  text?: RichtextStoryblok;
  link?: TextLinkStoryblok[];
  boxes?: BoxesSliderBoxStoryblok[];
  images_size?: "" | "square" | "round" | "round-small" | "portrait";
  _uid: string;
  component: "boxes_slider";
  [k: string]: unknown;
}

export interface BoxesSliderBoxStoryblok {
  headline?: string;
  alternative_headline?: string;
  subheadline?: string;
  text?: RichtextStoryblok;
  image?: AssetStoryblok;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  background_color?: "" | "none" | "custom";
  _uid: string;
  component: "boxes_slider_box";
  [k: string]: unknown;
}

export interface CareersListingCopyStoryblok {
  _uid: string;
  component: "careers_listing_copy";
  [k: string]: unknown;
}

export interface CaseStudiesListingStoryblok {
  preselected_industries?: (number | string)[];
  preselected_technologies?: (number | string)[];
  preselected_types?: (number | string)[];
  preselected_countries?: string[];
  _uid: string;
  component: "case_studies_listing";
  [k: string]: unknown;
}

export interface CaseStudiesRecapStoryblok {
  headline: string;
  categories: CaseStudiesRecapCategoryStoryblok[];
  _uid: string;
  component: "case_studies_recap";
  [k: string]: unknown;
}

export interface CaseStudiesRecapCategoryStoryblok {
  name: string;
  case_studies: CaseStudyRecapItemStoryblok[];
  _uid: string;
  component: "case_studies_recap_category";
  [k: string]: unknown;
}

export interface CaseStudyRecapItemStoryblok {
  case_study_link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  company_logo: AssetStoryblok;
  cover_image: AssetStoryblok;
  payoff: string;
  perks?: CaseStudyRecapItemPerkStoryblok[];
  _uid: string;
  component: "case_study_recap_item";
  [k: string]: unknown;
}

export interface CaseStudyRecapItemPerkStoryblok {
  headline?: string;
  subheadline?: string;
  _uid: string;
  component: "case_study_recap_item_perk";
  [k: string]: unknown;
}

export interface ChangelogStoryblok {
  effects?: ("" | "app" | "api" | "mapi" | "open-source" | "renderer" | "website" | "gapi")[];
  sprint_name?: string;
  sprint_name_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  image?: AssetStoryblok;
  items?: (ISbStoryData<FeatureItemStoryblok> | string)[];
  improvements_and_fixes?: RichtextStoryblok;
  body?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  og_image?: AssetStoryblok;
  og_description?: string;
  og_title?: string;
  meta_title?: string;
  meta_description?: string;
  _uid: string;
  component: "changelog";
  [k: string]: unknown;
}

export interface ChangelogsStoryblok {
  title?: string;
  subtitle?: string;
  og_image?: AssetStoryblok;
  og_description?: string;
  og_title?: string;
  meta_title?: string;
  meta_description?: string;
  body?: ChangelogStoryblok[];
  items?: (ISbStoryData<ChangelogStoryblok> | string)[];
  _uid: string;
  component: "changelogs";
  [k: string]: unknown;
}

export interface CliButtonStoryblok {
  text: string;
  command_to_copy: string;
  _uid: string;
  component: "cli_button";
  [k: string]: unknown;
}

export interface CodeblockStoryblok {
  code?: string;
  enable_diff?: boolean;
  title?: string;
  caption?: RichtextStoryblok;
  language?:
    | "javascript"
    | "bash"
    | "css"
    | "csharp"
    | "diff"
    | "go"
    | "html"
    | "http"
    | "java"
    | "json"
    | "markdown"
    | "php"
    | "properties"
    | "ruby"
    | "scss"
    | "sql"
    | "swift"
    | "typescript"
    | "yaml"
    | "graphql";
  _uid: string;
  component: "codeblock";
  [k: string]: unknown;
}

export interface ConfigurationStoryblok {
  new_header?: (NavigationMenuStoryblok | NavigationItemStoryblok)[];
  new_footer?: NavigationGroupStoryblok[];
  footer?: NavigationGroupStoryblok[];
  top_cta?: TopCtaStoryblok[];
  default_og_image?: AssetStoryblok;
  changelog_og_image?: AssetStoryblok;
  plugin_docu?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  show_about?: boolean;
  startpage_cta_text?: string;
  startpage_cta_link?: string;
  startpage_image_caption?: string;
  startpage_image?: string;
  feature_settings?: unknown;
  features?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  commerce_docu?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  Documentation?: unknown;
  editor_guides_docu?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  image_service_docu?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  Startpage?: unknown;
  startpage_images?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  documentation_navigation?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  seo?: unknown;
  _uid: string;
  component: "configuration";
  [k: string]: unknown;
}

export interface ContentVariantStoryblok {
  variant_name?: string;
  content?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  _uid: string;
  component: "content_variant";
  [k: string]: unknown;
}

export interface CookieGroupStoryblok {
  name?: string;
  headline: string;
  text: string;
  cookies?: CookieInformationStoryblok[];
  _uid: string;
  component: "cookie_group";
  [k: string]: unknown;
}

export interface CookieInformationStoryblok {
  name: string;
  domain: string;
  type: "" | "First party" | "Third party";
  duration: string;
  storage?: "" | "Cookie" | "Local Storage";
  description?: string;
  _uid: string;
  component: "cookie_information";
  [k: string]: unknown;
}

export interface CookieSettingsStoryblok {
  groups?: CookieGroupStoryblok[];
  _uid: string;
  component: "cookie_settings";
  [k: string]: unknown;
}

export interface CtaImageStoryblok {
  image?: AssetStoryblok;
  headline?: string;
  text?: string;
  button_text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  button_color?: "" | "button--white" | "button--dark-blue";
  text_color?: "" | "dark" | "white";
  link_new_tab?: boolean;
  background_pattern?: boolean;
  _uid: string;
  component: "cta_image";
  [k: string]: unknown;
}

export interface CtaWithExpandableContentStoryblok {
  optional_cta?: EnterpriseCtaStoryblok[];
  plans?: (ISbStoryData<PricingPlanStoryblok> | string)[];
  headline?: string;
  expand_cta_text?: string;
  hide_cta_text?: string;
  content?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  _uid: string;
  component: "cta_with_expandable_content";
  [k: string]: unknown;
}

export interface CtaWithIconsStoryblok {
  headline?: string;
  text?: RichtextStoryblok;
  button_text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  new_tab?: boolean;
  list?: CtaWithIconsListItemStoryblok[];
  button_color?: "" | "button--white" | "button--dark-blue";
  text_color?: "" | "dark" | "white";
  _uid: string;
  component: "cta_with_icons";
  [k: string]: unknown;
}

export interface CtaWithIconsListItemStoryblok {
  icon?: AssetStoryblok;
  text?: RichtextStoryblok;
  _uid: string;
  component: "cta_with_icons_list_item";
  [k: string]: unknown;
}

export interface CustomBoxesGridStoryblok {
  boxes?: (CustomBoxesGridSmallBoxStoryblok | CustomBoxesGridBoxStoryblok)[];
  columns?: "" | "2" | "3" | "4";
  images_position?: "" | " " | "inline";
  spacing?: "" | "default" | "narrow";
  _uid: string;
  component: "custom_boxes_grid";
  [k: string]: unknown;
}

export interface CustomBoxesGridBoxStoryblok {
  image?: AssetStoryblok;
  columns?: "" | "1" | "2" | "3";
  height?: "double" | "";
  headline?: string;
  subheadline?: string;
  text?: string;
  button_text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  background_type?: "" | "color" | "image";
  background_image?: AssetStoryblok;
  _uid: string;
  component: "custom_boxes_grid_box";
  [k: string]: unknown;
}

export interface CustomBoxesGridSmallBoxStoryblok {
  height?: "" | "default" | "compact";
  image?: AssetStoryblok;
  headline?: string;
  subheadline?: string;
  text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  link_new_tab?: boolean;
  alignment?: "" | " " | "center";
  background_image?: AssetStoryblok;
  _uid: string;
  component: "custom_boxes_grid_small_box";
  [k: string]: unknown;
}

export interface CustomerLogoStoryblok {
  name?: string;
  logo?: AssetStoryblok;
  location?: string[];
  industry?: unknown;
  _uid: string;
  component: "customer_logo";
  [k: string]: unknown;
}

export type MultiassetStoryblok = {
  alt?: string;
  copyright?: string;
  id: number;
  filename: string;
  name: string;
  title?: string;
  [k: string]: unknown;
}[];

export interface CustomersLogosStoryblok {
  show_more?: boolean;
  headline?: string;
  logos: MultiassetStoryblok;
  cta?: EnterpriseCtaStoryblok[];
  link_label?: string;
  link_url?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "customers_logos";
  [k: string]: unknown;
}

export interface CustomRichtextStoryblok {
  richtext?: RichtextStoryblok;
  above?: boolean;
  _uid: string;
  component: "custom_richtext";
  [k: string]: unknown;
}

export interface TableStoryblok {
  thead: {
    _uid: string;
    value?: string;
    component: number;
    [k: string]: unknown;
  }[];
  tbody: {
    _uid: string;
    body: {
      _uid?: string;
      value?: string;
      component?: number;
      [k: string]: unknown;
    }[];
    component: number;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface CustomTableStoryblok {
  auto_width?: boolean;
  styles?: ("" | "table--left" | "table--inherit" | "table--small-spacing")[];
  entries?: TableStoryblok;
  caption?: string;
  _uid: string;
  component: "custom_table";
  [k: string]: unknown;
}

export interface DoubleCtaStoryblok {
  headline?: string;
  text?: RichtextStoryblok;
  ctas?: DoubleCtaCtaStoryblok[];
  custom_logo?: AssetStoryblok;
  _uid: string;
  component: "double_cta";
  [k: string]: unknown;
}

export interface DoubleCtaCtaStoryblok {
  button?: EnterpriseCtaStoryblok[];
  caption?: string;
  _uid: string;
  component: "double_cta_cta";
  [k: string]: unknown;
}

export interface DynamicFormStoryblok {
  name: string;
  headline: string;
  description?: string;
  sections?: DynamicFormSectionStoryblok[];
  _uid: string;
  component: "dynamic_form";
  [k: string]: unknown;
}

export interface DynamicFormFieldStoryblok {
  name?: string;
  label?: string;
  type?: "text" | "text_area" | "email";
  required?: boolean;
  _uid: string;
  component: "dynamic_form_field";
  [k: string]: unknown;
}

export interface DynamicFormFieldGroupStoryblok {
  name?: string;
  label?: string;
  type?: "" | "radio" | "checkbox" | "multi_select" | "single_select";
  required?: boolean;
  fields?: (DynamicFormFieldStoryblok | DynamicFormOptionStoryblok)[];
  _uid: string;
  component: "dynamic_form_field_group";
  [k: string]: unknown;
}

export interface DynamicFormOptionStoryblok {
  label?: string;
  _uid: string;
  component: "dynamic_form_option";
  [k: string]: unknown;
}

export interface DynamicFormSectionStoryblok {
  section_name?: string;
  fields?: (DynamicFormFieldStoryblok | DynamicFormFieldGroupStoryblok)[];
  _uid: string;
  component: "dynamic_form_section";
  [k: string]: unknown;
}

export interface EmbedImageBoxStoryblok {
  embed_image?: string;
  _uid: string;
  component: "embed_image_box";
  [k: string]: unknown;
}

export interface EnterpriseBoxStoryblok {
  image?: string;
  image_alt?: string;
  headline?: string;
  text?: string;
  link_text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "enterprise_box";
  [k: string]: unknown;
}

export interface EnterpriseBoxGridStoryblok {
  variant?: "" | "default" | "new-homepage-style";
  body?: EnterpriseBoxStoryblok[];
  content_align?: "" | "center" | "top";
  images_size?: "" | "large";
  _uid: string;
  component: "enterprise_box_grid";
  [k: string]: unknown;
}

export interface EnterpriseCaseStudyStoryblok {
  layout?: "" | "long" | "short";
  name?: string;
  cover?: string;
  industry?: number | string;
  countries?: string[];
  type?: (number | string)[];
  partner?: (ISbStoryData<PartnerStoryblok> | string)[];
  technologies?: (number | string)[];
  featured?: boolean;
  logo?: string;
  partner_logo?: string;
  partner_logo_alt?: string;
  description?: string;
  project_url?: string;
  view_live_override?: string;
  screenshot?: string;
  body_before?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  body?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  og_image?: AssetStoryblok;
  og_description?: string;
  og_title?: string;
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  banner_section?: BannerSectionStoryblok[];
  body_long_layout?: (
    | ImageStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseTableStoryblok
    | VideoStoryblok
    | SingleQuoteStoryblok
    | PaperCtaStoryblok
    | CustomRichtextStoryblok
  )[];
  cta?: EnterpriseCtaSectionStoryblok[];
  gated_content?: ISbStoryData<GatedContentStoryblok> | string;
  gated_content_title?: string;
  gated_content_description?: RichtextStoryblok;
  gated_content_cta?: string;
  tracking_pixels?: (number | string)[];
  _uid: string;
  component: "enterprise_case_study";
  [k: string]: unknown;
}

export interface EnterpriseCaseStudyReferencesStoryblok {
  headline?: string;
  case_studies?: unknown[];
  personalized?: boolean;
  _uid: string;
  component: "enterprise_case_study_references";
  [k: string]: unknown;
}

export interface EnterpriseCtaStoryblok {
  text?: string;
  target?: "" | "_blank";
  link?: Exclude<MultilinkStoryblok, {linktype?: "asset"}>;
  color?:
    | ""
    | "e-button--white"
    | "e-button--dark-blue"
    | "button--link-arrow"
    | "e-button--accent"
    | "button--hp-primary"
    | "button--hp-secondary";
  tracking_category?: string;
  linkedin_conversion_id?: string;
  _uid: string;
  component: "enterprise_cta";
  [k: string]: unknown;
}

export interface EnterpriseCtaGroupStoryblok {
  headline?: string;
  text?: string;
  items?: EnterpriseCtaGroupItemStoryblok[];
  _uid: string;
  component: "enterprise_cta_group";
  [k: string]: unknown;
}

export interface EnterpriseCtaGroupItemStoryblok {
  headline?: string;
  text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  icon?: string;
  icon_alt?: string;
  _uid: string;
  component: "enterprise_cta_group_item";
  [k: string]: unknown;
}

export interface EnterpriseCtaSectionStoryblok {
  style?: "" | "cta-section--light" | "cta-section--custom" | "cta-section--gradient";
  background_image?: AssetStoryblok;
  headline_size?: "" | " " | "large";
  inner_spacing?: "" | " " | "medium";
  anchor?: string;
  headline?: string;
  text?: string;
  ctas?: EnterpriseCtaStoryblok[];
  foot_note?: string;
  _uid: string;
  component: "enterprise_cta_section";
  [k: string]: unknown;
}

export interface EnterpriseFactStoryblok {
  value?: string;
  key?: string;
  _uid: string;
  component: "enterprise_fact";
  [k: string]: unknown;
}

export interface EnterpriseFactsStoryblok {
  headline?: string;
  facts?: EnterpriseFactStoryblok[];
  _uid: string;
  component: "enterprise_facts";
  [k: string]: unknown;
}

export interface EnterpriseFaqsStoryblok {
  headline?: string;
  text?: RichtextStoryblok;
  image?: AssetStoryblok;
  faqs?: FaqItemStoryblok[];
  _uid: string;
  component: "enterprise_faqs";
  [k: string]: unknown;
}

export interface EnterpriseIntroStoryblok {
  top_image?: AssetStoryblok;
  top_image_style?: "" | "stretched" | "auto";
  top_image_alt?: string;
  is_in_medium_container?: boolean;
  is_centered?: boolean;
  has_wider_text?: boolean;
  link_on_rhs?: boolean;
  headline_size?: "" | " " | "large" | "small";
  subheadline?: string;
  formatted_text?: RichtextStoryblok;
  headline?: string;
  text?: string;
  ctas?: EnterpriseCtaStoryblok[];
  _uid: string;
  component: "enterprise_intro";
  [k: string]: unknown;
}

export interface EnterpriseLogosStoryblok {
  headline?: string;
  above?: boolean;
  logos?: MultiassetStoryblok;
  is_centered?: boolean;
  _uid: string;
  component: "enterprise_logos";
  [k: string]: unknown;
}

export interface EnterprisePageStoryblok {
  hide_top_cta?: boolean;
  header_type?: number | string;
  footer_type?: number | string;
  body?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
    | AnnotatedImageStoryblok
    | CodeblockStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabsStoryblok
    | MarkdownStoryblok
    | SingleQuoteStoryblok
    | TextLogosLinksStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
  )[];
  og_image?: AssetStoryblok;
  og_description?: string;
  og_title?: string;
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  tracking_pixels?: (number | string)[];
  _uid: string;
  component: "enterprise_page";
  [k: string]: unknown;
}

export interface EnterprisePricingStoryblok {
  headline?: string;
  subheadline?: string;
  plans?: EnterprisePricingBoxStoryblok[];
  foot_note?: string;
  _uid: string;
  component: "enterprise_pricing";
  [k: string]: unknown;
}

export interface EnterprisePricingBoxStoryblok {
  color?: "" | "primary-ink" | "primary-blue" | "secondary-ink";
  most_popular?: boolean;
  title?: string;
  subtitle?: string;
  price?: string;
  billing_period?: string;
  price_information?: string;
  cta_text?: string;
  features_headline?: string;
  features?: string;
  text_price?: string;
  monthly_price?: string;
  annual_price?: string;
  contact_sales?: boolean;
  _uid: string;
  component: "enterprise_pricing_box";
  [k: string]: unknown;
}

export interface EnterprisePricingSectionStoryblok {
  headline?: string;
  subheadline?: string;
  price?: string;
  feature_headline?: string;
  features?: string;
  cta_text?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "enterprise_pricing_section";
  [k: string]: unknown;
}

export interface EnterpriseQuoteReferencesStoryblok {
  headline?: string;
  _uid: string;
  component: "enterprise_quote_references";
  [k: string]: unknown;
}

export interface EnterpriseQuoteReferenceSliderStoryblok {
  enable_custom_background?: boolean;
  enable_transparent_background?: boolean;
  headline?: string;
  quotes?: (ISbStoryData<QuoteStoryblok> | string)[];
  _uid: string;
  component: "enterprise_quote_reference_slider";
  [k: string]: unknown;
}

export interface EnterpriseSingleBoxStoryblok {
  images?: EnterpriseSingleBoxImageStoryblok[];
  image_alt?: string;
  headline?: string;
  text?: string;
  image?: string;
  image_size?: "" | "default" | "big" | "small";
  content_alignment?: "" | "center";
  _uid: string;
  component: "enterprise_single_box";
  [k: string]: unknown;
}

export interface EnterpriseSingleBoxImageStoryblok {
  image?: AssetStoryblok;
  colored_background?: boolean;
  custom_background?: boolean;
  _uid: string;
  component: "enterprise_single_box_image";
  [k: string]: unknown;
}

export interface EnterpriseSpacerStoryblok {
  spacer_height?: "" | "30" | "70" | "80" | "100" | "160" | "170";
  background_height?: string;
  background_width?: string;
  background_active?: boolean;
  background_color?: string;
  horizontal_line?: boolean;
  _uid: string;
  component: "enterprise_spacer";
  [k: string]: unknown;
}

export interface EnterpriseTableStoryblok {
  entries?: TableStoryblok;
  caption?: string;
  align?: "" | "left" | "right";
  _uid: string;
  component: "enterprise_table";
  [k: string]: unknown;
}

export interface EnterpriseTechsStoryblok {
  headline?: string;
  logos?: MultiassetStoryblok;
  style_size?: "" | "techs--small" | "techs--large" | "techs--custom";
  margin?: "" | "default" | "none";
  custom_image_size?: string;
  _uid: string;
  component: "enterprise_techs";
  [k: string]: unknown;
}

export interface EnterpriseTextStoryblok {
  content?: RichtextStoryblok;
  text?: string;
  text_alignment?: "" | "center";
  content_width?: "" | "large" | " ";
  _uid: string;
  component: "enterprise_text";
  [k: string]: unknown;
}

export interface EnterpriseTextImageStoryblok {
  illustration?: "" | "custom" | "animations/console" | "animations/partners";
  image?: string;
  image_preload?: string;
  image_alt?: string;
  image_position?: "" | "right" | "left";
  above?: boolean;
  headline?: string;
  subheadline?: string;
  text?: string;
  ctas?: EnterpriseCtaStoryblok[];
  variation?: ("" | "long-text")[];
  _uid: string;
  component: "enterprise_text_image";
  [k: string]: unknown;
}

export interface EnterpriseTwoTextStoryblok {
  body?: EnterpriseTwoTextItemStoryblok[];
  background_color?: "" | "grey" | "transparent";
  _uid: string;
  component: "enterprise_two_text";
  [k: string]: unknown;
}

export interface EnterpriseTwoTextItemStoryblok {
  icon?: string;
  icon_alt?: string;
  headline?: string;
  subheadline?: string;
  text?: string;
  ctas?: EnterpriseCtaStoryblok[];
  _uid: string;
  component: "enterprise_two_text_item";
  [k: string]: unknown;
}

export interface EnterpriseVideoStoryblok {
  headline?: string;
  thumbnail?: string;
  thumbnail_alt?: string;
  youtube_url?: string;
  above?: boolean;
  _uid: string;
  component: "enterprise_video";
  [k: string]: unknown;
}

export interface EventStoryblok {
  is_ticket_widget_visible?: boolean;
  title?: string;
  text?: RichtextStoryblok;
  body?: (
    | AnnotatedImageStoryblok
    | CodeblockStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabsStoryblok
    | MarkdownStoryblok
    | SingleQuoteStoryblok
    | TextLogosLinksStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
  )[];
  tito_event_name?: string;
  tito_event_releases?: string;
  preview_image?: AssetStoryblok;
  teaser?: string;
  storyblok_event?: boolean;
  start_date?: string;
  end_date?: string;
  unlisted?: boolean;
  hide_time?: boolean;
  og_image?: AssetStoryblok;
  og_description?: string;
  og_title?: string;
  meta_title?: string;
  meta_description?: string;
  enable_external_link?: boolean;
  external_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  noindex?: boolean;
  event_type?: "" | "storyblok_event" | "webinar";
  width?: "" | "default" | "wide";
  _uid: string;
  component: "event";
  [k: string]: unknown;
}

export interface EventsListingStoryblok {
  category?: "" | "storyblok" | "upcoming" | "past" | "webinar";
  featured_entry?: ISbStoryData<EventStoryblok> | string;
  ctas?: ListingCtaStoryblok[];
  _uid: string;
  component: "events_listing";
  [k: string]: unknown;
}

export interface FactsWithImagesStoryblok {
  facts?: FactWithImageStoryblok[];
  _uid: string;
  component: "facts_with_images";
  [k: string]: unknown;
}

export interface FactWithImageStoryblok {
  image?: AssetStoryblok;
  value?: string;
  key?: string;
  _uid: string;
  component: "fact_with_image";
  [k: string]: unknown;
}

export interface FaqItemStoryblok {
  question?: string;
  answer?: string;
  _uid: string;
  component: "faq_item";
  [k: string]: unknown;
}

export interface FaqOverviewStoryblok {
  type?: "" | "partners";
  _uid: string;
  component: "faq_overview";
  [k: string]: unknown;
}

export interface FeaturedSearchResultStoryblok {
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "featured_search_result";
  [k: string]: unknown;
}

export interface FeatureItemStoryblok {
  title?: string;
  description?: string;
  release_date?:
    | ""
    | "Considering"
    | "Released"
    | "Q2 2023"
    | "Q3 2023"
    | "Q4 2023"
    | "2024"
    | "Q1 2024"
    | "Q2 2024"
    | "Q3 2024"
    | "Q4 2024"
    | "Q1 2023"
    | "Q1 2022"
    | "Q2 2022"
    | "Q3 2022"
    | "Q4 2022"
    | "Q1 2021"
    | "Q2 2021"
    | "Q3 2021"
    | "Q4 2021";
  plan?: "" | "Community Plan" | "Entry Plan" | "Business Plan" | "Enterprise Plan" | "Enterprise Plus Plan";
  task_identifier?: string;
  content_tags?: (number | string)[];
  image?: AssetStoryblok;
  noindex?: boolean;
  _uid: string;
  component: "feature_item";
  [k: string]: unknown;
}

export interface FooterNavigationItemStoryblok {
  display?: string;
  link?: MultilinkStoryblok;
  icon?: number | string;
  anchor?: string;
  badge?: string;
  _uid: string;
  component: "footer_navigation_item";
  [k: string]: unknown;
}

export interface FormSectionEnterpriseStoryblok {
  headline?: string;
  text?: RichtextStoryblok;
  template?:
    | ""
    | "write_for_our_blog"
    | "remove_project"
    | "submit_project"
    | "translation_swag"
    | "unsubscribe_feedback"
    | "enterprise_sales";
  thank_you_page?: unknown;
  _uid: string;
  component: "form_section_enterprise";
  [k: string]: unknown;
}

export interface G2ScoreStoryblok {
  text?: string;
  _uid: string;
  component: "g2_score";
  [k: string]: unknown;
}

export interface GatedContentStoryblok {
  title: string;
  text?: string;
  body_before_form?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  body?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  campaign_id?: string;
  campaign_select_1?: string;
  pardot_form?: number | string;
  product_interest?: number | string;
  team?: number | string;
  form_template?: "" | " " | "v1";
  form_endpoint?: "" | "gated-content" | "contact-form";
  phone_field?: "" | " " | "hidden" | "required";
  headline?: string;
  bulletpoints?: string;
  type?: "" | "download" | "redirect" | "content";
  download?: AssetStoryblok;
  redirect_to?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  tracking_pixel_url?: string;
  event_label?: string;
  use_custom_thank_you_message?: boolean;
  custom_thank_you_message?: RichtextStoryblok;
  og_image?: AssetStoryblok;
  og_description?: string;
  og_title?: string;
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  tracking_pixels?: (number | string)[];
  header_type?: number | string;
  category?: (number | string)[];
  preview_text?: string;
  preview_image?: AssetStoryblok;
  swap_title_and_text?: boolean;
  title_direct?: string;
  text_direct?: string;
  body_direct?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  artwork?: AssetStoryblok;
  teaser_text?: string;
  _uid: string;
  component: "gated_content";
  [k: string]: unknown;
}

export interface HeroStoryblok {
  headline: string;
  rotating_text_options?: string;
  text: RichtextStoryblok;
  ctas?: EnterpriseCtaStoryblok[];
  image: AssetStoryblok;
  video_url?: string;
  vertical_layout?: boolean;
  background_color?: "" | "dark" | "light-circle";
  headline_size?: "" | " " | "large";
  width?: "" | "default" | "wide";
  _uid: string;
  component: "hero";
  [k: string]: unknown;
}

export interface HintStoryblok {
  type: "hint" | "learn" | "required" | "warn" | "quote";
  text?: string;
  label?: string;
  _uid: string;
  component: "hint";
  [k: string]: unknown;
}

export interface ImageStoryblok {
  disable_lightbox?: boolean;
  above?: boolean;
  centered?: boolean;
  rounded_corners?: boolean;
  add_shadow?: boolean;
  use_original?: boolean;
  width?: string;
  height?: string;
  browser_bar?: "" | "dark" | "light";
  browser_bar_address?: string;
  source?: string;
  alt?: string;
  link?: string;
  caption?: RichtextStoryblok;
  note?: string;
  _uid: string;
  component: "image";
  [k: string]: unknown;
}

export interface InContentBoxStoryblok {
  headline?: string;
  text?: RichtextStoryblok;
  ctas?: EnterpriseCtaStoryblok[];
  type?: "" | "centered";
  _uid: string;
  component: "in_content_box";
  [k: string]: unknown;
}

export interface InContentEventRegistrationStoryblok {
  campaign_id?: string;
  body?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  lead_source?: "" | "Event" | "Storyblok Event" | "Webinar" | "Other";
  pardot_form?: number | string;
  form_template?: number | string;
  phone_field?: "" | " " | "hidden" | "required";
  headline?: string;
  bulletpoints?: string;
  tracking_pixel_url?: string;
  event_label?: string;
  success_message?: RichtextStoryblok;
  body_direct?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  _uid: string;
  component: "in_content_event_registration";
  [k: string]: unknown;
}

export interface InContentGatedContentStoryblok {
  campaign_id?: string;
  campaign_select_1?: string;
  pardot_form?: number | string;
  phone_field?: "" | " " | "hidden" | "required";
  form_endpoint?: "" | "gated-content" | "contact-form";
  headline?: string;
  bulletpoints?: string;
  type?: "" | "download" | "redirect" | "content";
  download?: AssetStoryblok;
  redirect_to?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  tracking_pixel_url?: string;
  event_label?: string;
  body?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  artwork?: AssetStoryblok;
  teaser_text?: string;
  body_direct?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  _uid: string;
  component: "in_content_gated_content";
  [k: string]: unknown;
}

export interface InContentLinkBoardStoryblok {
  headline?: string;
  text?: string;
  content?: (
    | CliButtonStoryblok
    | InContentSpacerStoryblok
    | EnterpriseCtaSectionStoryblok
    | CodeblockStoryblok
    | CustomRichtextStoryblok
  )[];
  board?: "" | "visible" | "transparent";
  _uid: string;
  component: "in_content_link_board";
  [k: string]: unknown;
}

export interface InContentLinkBoardLinkStoryblok {
  headline?: string;
  teaser?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  icon?: AssetStoryblok;
  icon_alt?: string;
  _uid: string;
  component: "in_content_link_board_link";
  [k: string]: unknown;
}

export interface InContentLinkBoardsStoryblok {
  subheadline?: string;
  headline?: string;
  text?: string;
  image?: AssetStoryblok;
  links?: InContentLinkBoardLinkStoryblok[];
  boards?: InContentLinkBoardStoryblok[];
  background?: unknown;
  icons_size?: unknown;
  hide_box?: boolean;
  headline_size?: unknown;
  sub_headline_font_size?: unknown[];
  description_size?: "" | "default" | "large";
  reverse_columns_mobile?: boolean;
  _uid: string;
  component: "in_content_link_boards";
  [k: string]: unknown;
}

export interface InContentNestedSharedContentStoryblok {
  content?: ISbStoryData<InContentSharedContentStoryblok> | string;
  _uid: string;
  component: "in_content_nested_shared_content";
  [k: string]: unknown;
}

export interface InContentNewsletterStoryblok {
  headline?: string;
  text?: RichtextStoryblok;
  default_group?: "" | "Developer newsletter" | "Marketing newsletter";
  background_color?: "" | "gradient" | "blue" | "transparent";
  headline_size?: "" | "normal" | "big";
  _uid: string;
  component: "in_content_newsletter";
  [k: string]: unknown;
}

export interface InContentSharedContentStoryblok {
  content?: (
    | AnnotatedImageStoryblok
    | CodeblockStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabsStoryblok
    | MarkdownStoryblok
    | SingleQuoteStoryblok
    | TextLogosLinksStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
  )[];
  _uid: string;
  component: "in_content_shared_content";
  [k: string]: unknown;
}

export interface InContentSliderStoryblok {
  headline?: string;
  subheadline?: string;
  boxes?: BoxesSliderBoxStoryblok[];
  _uid: string;
  component: "in_content_slider";
  [k: string]: unknown;
}

export interface InContentSpacerStoryblok {
  spacer_height?: "" | "20" | "30" | "70" | "80" | "100" | "160" | "170";
  background_height?: string;
  background_width?: string;
  background_active?: boolean;
  background_color?: string;
  horizontal_line?: boolean;
  _uid: string;
  component: "in_content_spacer";
  [k: string]: unknown;
}

export interface InContentTabStoryblok {
  name?: string;
  body?: (InContentLinkBoardsStoryblok | ListWithImageStoryblok | CustomRichtextStoryblok)[];
  icon?: AssetStoryblok;
  _uid: string;
  component: "in_content_tab";
  [k: string]: unknown;
}

export interface InContentTabsStoryblok {
  tabs?: InContentTabStoryblok[];
  variant?: "" | "left" | "centered" | "new-homepage-style";
  _uid: string;
  component: "in_content_tabs";
  [k: string]: unknown;
}

export interface JobStoryblok {
  team?: (number | string)[];
  location?: number | string;
  contract?: ("" | "part-time" | "full-time")[];
  salary_ending_at?: string;
  salary_starting_at?: string;
  show_salary?: boolean;
  techs_skills?: string;
  body?: (MarkdownStoryblok | ImageStoryblok | VideoStoryblok | CustomTableStoryblok)[];
  title?: string;
  intro?: string;
  text?: string;
  outro?: string;
  teaser?: string;
  og_title?: string;
  og_image?: AssetStoryblok;
  og_description?: string;
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  smartrecruiters?: string;
  _uid: string;
  component: "job";
  [k: string]: unknown;
}

export interface LinkBoardStoryblok {
  headline?: string;
  text?: string;
  links?: LinkBoardLinkStoryblok[];
  _uid: string;
  component: "link_board";
  [k: string]: unknown;
}

export interface LinkBoardLinkStoryblok {
  icon?: AssetStoryblok;
  icon_alt?: string;
  headline?: string;
  teaser?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "link_board_link";
  [k: string]: unknown;
}

export interface LinkBoardsStoryblok {
  subheadline?: string;
  headline?: string;
  text?: string;
  image?: AssetStoryblok;
  links?: LinkBoardLinkStoryblok[];
  boards?: LinkBoardStoryblok[];
  background?: "" | "transparent";
  icons_size?: "" | " " | "medium";
  hide_box?: boolean;
  headline_size?: "" | " " | "large";
  sub_headline_font_style?: ("" | "normal" | "italic" | "bold")[];
  _uid: string;
  component: "link_boards";
  [k: string]: unknown;
}

export interface ListingCtaStoryblok {
  headline?: string;
  image?: AssetStoryblok;
  button_new_tab?: boolean;
  button_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  button_text?: string;
  text_align?: "" | "center" | "left";
  _uid: string;
  component: "listing_cta";
  [k: string]: unknown;
}

export interface ListWithImageStoryblok {
  image_position?: "" | "bottom-right";
  enable_background_color?: boolean;
  headline: string;
  subheadline?: string;
  list?: RichtextStoryblok;
  image?: AssetStoryblok;
  enable_image_background_color?: boolean;
  cta?: EnterpriseCtaStoryblok[];
  _uid: string;
  component: "list_with_image";
  [k: string]: unknown;
}

export interface LogogroupStoryblok {
  headline?: string;
  body?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  _uid: string;
  component: "logogroup";
  [k: string]: unknown;
}

export interface MainCardStoryblok {
  sub_headline?: string;
  headline: string;
  text?: RichtextStoryblok;
  cta?: NestedCtaStoryblok[];
  items: MainCardIconItemStoryblok[];
  background?: "" | "blue-logo" | "blue-map" | "transparent" | "grey" | "gradient";
  _uid: string;
  component: "main_card";
  [k: string]: unknown;
}

export interface MainCardIconItemStoryblok {
  icon?: AssetStoryblok;
  headline?: string;
  text?: string;
  _uid: string;
  component: "main_card_icon_item";
  [k: string]: unknown;
}

export interface MainCardStatItemStoryblok {
  cta_text?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  headline?: string;
  text?: string;
  _uid: string;
  component: "main_card_stat_item";
  [k: string]: unknown;
}

export interface MainCardWithStatsStoryblok {
  sub_headline?: string;
  headline: string;
  text?: RichtextStoryblok;
  cta?: NestedCtaStoryblok[];
  items: MainCardStatItemStoryblok[];
  background?: "" | "blue-logo" | "blue-map" | "grey" | "gradient" | "custom";
  sub_headline_font_style?: ("" | "normal" | "italic" | "bold")[];
  _uid: string;
  component: "main_card_with_stats";
  [k: string]: unknown;
}

export interface MarkdownStoryblok {
  richtext?: RichtextStoryblok;
  text?: string;
  title?: string;
  non_facing_name?: string;
  above?: boolean;
  spacings?: ("" | "uk-margin-top" | "uk-margin-large-top" | "uk-margin-bottom" | "uk-margin-large-bottom")[];
  deprecated?: unknown;
  _uid: string;
  component: "markdown";
  [k: string]: unknown;
}

export interface NavigationCategoryStoryblok {
  headline?: string;
  navigation_items?: NavigationItemStoryblok[];
  group_link_text?: string;
  group_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "navigation_category";
  [k: string]: unknown;
}

export interface NavigationGroupStoryblok {
  group_name?: string;
  navitems?: (NavigationCategoryStoryblok | NavigationItemStoryblok | FooterNavigationItemStoryblok)[];
  _uid: string;
  component: "navigation_group";
  [k: string]: unknown;
}

export interface NavigationItemStoryblok {
  display?: string;
  link?: MultilinkStoryblok;
  anchor?: string;
  text?: string;
  icon?: string;
  _uid: string;
  component: "navigation_item";
  [k: string]: unknown;
}

export interface NavigationMenuStoryblok {
  display?: string;
  nav_items?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  nav_sidebar?: (
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarImageLinkStoryblok
  )[];
  _uid: string;
  component: "navigation_menu";
  [k: string]: unknown;
}

export interface NavigationSidebarImageLinkStoryblok {
  image?: AssetStoryblok;
  subheadline?: string;
  headline?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  new_tab?: boolean;
  _uid: string;
  component: "navigation_sidebar_image_link";
  [k: string]: unknown;
}

export interface NavigationSidebarImagesLinksStoryblok {
  headline?: string;
  links?: NavigationSidebarImagesLinksItemStoryblok[];
  _uid: string;
  component: "navigation_sidebar_images_links";
  [k: string]: unknown;
}

export interface NavigationSidebarImagesLinksItemStoryblok {
  image?: AssetStoryblok;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  text: string;
  _uid: string;
  component: "navigation_sidebar_images_links_item";
  [k: string]: unknown;
}

export interface NavigationSidebarLinksStoryblok {
  links?: NavigationSidebarLinksLinkStoryblok[];
  _uid: string;
  component: "navigation_sidebar_links";
  [k: string]: unknown;
}

export interface NavigationSidebarLinksLinkStoryblok {
  label?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  new_tab?: boolean;
  _uid: string;
  component: "navigation_sidebar_links_link";
  [k: string]: unknown;
}

export interface NestedCtaStoryblok {
  text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  target?: "" | "_blank";
  _uid: string;
  component: "nested_cta";
  [k: string]: unknown;
}

export interface NewsletterFormStoryblok {
  body?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  _uid: string;
  component: "newsletter_form";
  [k: string]: unknown;
}

export interface NewsletterSectionStoryblok {
  headline?: string;
  text?: RichtextStoryblok;
  default_group?: "" | "Developer newsletter" | "Marketing newsletter";
  background_color?: "" | "gradient" | "blue" | "transparent";
  headline_size?: "" | "normal" | "big";
  _uid: string;
  component: "newsletter_section";
  [k: string]: unknown;
}

export interface PageStoryblok {
  redirect?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  body?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  meta_description?: string;
  internal_search_keywords?: string;
  _uid: string;
  component: "page";
  [k: string]: unknown;
}

export interface PageIntroStoryblok {
  headline?: string;
  escape_html?: boolean;
  image?: AssetStoryblok;
  text?: RichtextStoryblok;
  ctas?: (EnterpriseCtaStoryblok | CliButtonStoryblok)[];
  blocks?: (
    | FactsWithImagesStoryblok
    | CustomersLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterpriseSpacerStoryblok
    | CustomBoxesGridStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseVideoStoryblok
  )[];
  divider_content?: string;
  background_color?: "" | "light-grey" | "custom" | "gradient";
  headline_size?: "" | "default" | "large";
  description_color?: "" | "grey" | "dark";
  custom_spacing_bottom?: string;
  enable_animation?: boolean;
  video_url?: string;
  _uid: string;
  component: "page_intro";
  [k: string]: unknown;
}

export interface PaperCtaStoryblok {
  image?: AssetStoryblok;
  image_preload?: AssetStoryblok;
  image_alt: string;
  image_position?: "" | "right" | "left";
  above?: boolean;
  headline?: string;
  text?: string;
  ctas?: EnterpriseCtaStoryblok[];
  _uid: string;
  component: "paper_cta";
  [k: string]: unknown;
}

export interface PartnerStoryblok {
  featured?: boolean;
  logo?: AssetStoryblok;
  logo_background_color?: "" | "default" | "custom";
  company_size?: number | string;
  partner_id: string;
  categories?: (number | string)[];
  competencies?: (number | string)[];
  industries?: (number | string)[];
  languages?: (number | string)[];
  countries?: string[];
  headquarters?: string;
  city?: string;
  address_line_1?: string;
  zip?: string;
  website?: string;
  email?: string;
  body?: (
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CustomBoxesGridStoryblok
    | CustomersLogosStoryblok
    | DoubleCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormOptionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseVideoStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FormSectionEnterpriseStoryblok
    | HeroStoryblok
    | LinkBoardsStoryblok
    | ListWithImageStoryblok
    | MainCardStoryblok
    | MainCardWithStatsStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressListingStoryblok
    | RoadmapStoryblok
    | ScrollableTabsStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | StackblitzButtonStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextQuotesIllustrationStoryblok
    | TitleWithCtaStoryblok
    | TutorialsListingStoryblok
    | WhitepapersListingStoryblok
  )[];
  portfolio?: unknown[];
  _uid: string;
  component: "partner";
  [k: string]: unknown;
}

export interface PartnersListingStoryblok {
  headline?: string;
  text?: RichtextStoryblok;
  _uid: string;
  component: "partners_listing";
  [k: string]: unknown;
}

export interface PersonalisedContentStoryblok {
  variants?: ContentVariantStoryblok[];
  _uid: string;
  component: "personalised_content";
  [k: string]: unknown;
}

export interface PressEntryStoryblok {
  source_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  source_name?: string;
  preview_image?: AssetStoryblok;
  _uid: string;
  component: "press_entry";
  [k: string]: unknown;
}

export interface PressListingStoryblok {
  featured_entry?: ISbStoryData<PressEntryStoryblok> | string;
  _uid: string;
  component: "press_listing";
  [k: string]: unknown;
}

export interface PricingPlanStoryblok {
  name?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  cta_text?: string;
  monthly_costs?: string;
  spaces_included?: string;
  seats_included?: string;
  cost_per_additional_seat?: string;
  maximum_seats?: string;
  monthly_traffic?: string;
  uptime_sla?: string;
  requests_per_month?: string;
  components?: string;
  stories?: string;
  preview_environments?: string;
  number_of_datasources?: string;
  number_of_assets?: string;
  max_asset_size?: string;
  content_folders?: string;
  activity_log_and_versioning?: string;
  webhooks?: string;
  custom_roles?: string;
  custom_workflow_stages?: string;
  custom_workflows?: string;
  s3_backup_frequency?: string;
  scheduling_and_releases?: string;
  scheduled_single_stories?: string;
  pipeline_stages?: string;
  custom_metadata_fields?: string;
  sdk_access?: string;
  design_system_access?: string;
  activity_log?: string;
  asset_manager?: string;
  asset_folders?: string;
  automatic_updates?: string;
  autosave?: string;
  clipboard_history?: string;
  clone_projects?: string;
  content_delivery_api?: string;
  custom_field_types?: string;
  datasources?: string;
  graphql?: string;
  image_optimization_service?: string;
  internationalization?: string;
  management_api?: string;
  responsive_preview?: string;
  search_query?: string;
  standard_workflows?: string;
  documentation?: string;
  unlimited_languages?: string;
  visual_editor?: string;
  two_fa?: string;
  approval?: string;
  access_control?: string;
  replace_assets?: string;
  seo_meta_tags?: string;
  task_manager?: string;
  translatable_slugs?: string;
  webhook_secrets?: string;
  access_token_scopes?: string;
  advanced_paths?: string;
  collaboration?: string;
  field_comments?: string;
  dimensions?: string;
  forced_two_fa?: string;
  preview_and_editor?: string;
  content_authoring?: string;
  content_aggregation?: string;
  permissions?: string;
  workflow_stages?: string;
  content_orchestrations?: string;
  experience_delivery?: string;
  global_api_cdn?: string;
  global_asset_cdn?: string;
  content_hub?: string;
  open_source_sdks?: string;
  acitivity_log?: string;
  vercel_integration?: string;
  netlify_integration?: string;
  semrush_integration?: string;
  cloudinary_integration?: string;
  optimizely_integration?: string;
  language_export_and_import?: string;
  pipeline?: string;
  shared_components?: string;
  extended_activity_logs?: string;
  sso?: string;
  shopify_integration?: string;
  saleor_integration?: string;
  centra_integration?: string;
  sylius_integration?: string;
  shopware_integration?: string;
  spryker_integration?: string;
  bigcommerce_integration?: string;
  commercelayer_integration?: string;
  commercetools_integration?: string;
  vendure_integration?: string;
  organization_analytics?: string;
  wire_transfer_payment?: string;
  restricted_ip_address_range?: string;
  user_management?: string;
  customer_success_manager?: string;
  security_audit?: string;
  additional_data_centers?: string;
  extended_support_package?: string;
  bring_your_own_cloud?: string;
  single_story_scheduling?: string;
  conditional_fields?: string;
  nacelle_integration?: string;
  smartling_integration?: string;
  bynder_integration?: string;
  sap_integration?: string;
  _uid: string;
  component: "pricing_plan";
  [k: string]: unknown;
}

export interface QuoteStoryblok {
  name?: string;
  job?: string;
  text?: string;
  image?: string;
  logo?: AssetStoryblok;
  _uid: string;
  component: "quote";
  [k: string]: unknown;
}

export interface RoadmapStoryblok {
  categories?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  _uid: string;
  component: "roadmap";
  [k: string]: unknown;
}

export interface RoadmapCategoryStoryblok {
  name?: string;
  items?: (ISbStoryData<FeatureItemStoryblok> | string)[];
  _uid: string;
  component: "roadmap_category";
  [k: string]: unknown;
}

export interface RoiBenefitsInfoStoryblok {
  image?: AssetStoryblok;
  headline?: string;
  description?: string;
  _uid: string;
  component: "roi_benefits_info";
  [k: string]: unknown;
}

export interface RoiCalculatorStoryblok {
  results_headline?: string;
  results_description?: string;
  benefits_info?: RoiBenefitsInfoStoryblok[];
  _uid: string;
  component: "roi_calculator";
  [k: string]: unknown;
}

export interface RootStoryblok {
  og_image?: AssetStoryblok;
  title?: string;
  body?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  previous?: unknown;
  next?: unknown;
  og_description?: string;
  og_title?: string;
  meta_description?: string;
  noindex?: boolean;
  _uid: string;
  component: "root";
  [k: string]: unknown;
}

export interface ScrollableTabsStoryblok {
  headline?: string;
  active_tab?: unknown;
  tabs?: ScrollableTabsTabStoryblok[];
  _uid: string;
  component: "scrollable_tabs";
  [k: string]: unknown;
}

export interface ScrollableTabsTabStoryblok {
  active?: boolean;
  title?: string;
  body?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  _uid: string;
  component: "scrollable_tabs_tab";
  [k: string]: unknown;
}

export interface SearchStoryblok {
  search_suggestions?: string;
  featured_tutorials?: FeaturedSearchResultStoryblok[];
  featured_blog_entries?: FeaturedSearchResultStoryblok[];
  featured_docs?: FeaturedSearchResultStoryblok[];
  featured_pages?: FeaturedSearchResultStoryblok[];
  _uid: string;
  component: "search";
  [k: string]: unknown;
}

export interface SinglePricingBoxStoryblok {
  title?: string;
  subtitle?: string;
  price?: string;
  price_information?: string;
  price_information_subtitle?: string;
  cta_text?: string;
  text_below_cta?: string;
  features_headline?: string;
  features?: string;
  width?: "" | "default" | "wide";
  _uid: string;
  component: "single_pricing_box";
  [k: string]: unknown;
}

export interface SingleQuoteStoryblok {
  name?: string;
  job?: string;
  text?: string;
  image: string;
  logo?: AssetStoryblok;
  enable_custom_background?: boolean;
  _uid: string;
  component: "single_quote";
  [k: string]: unknown;
}

export interface StackblitzButtonStoryblok {
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  text?: string;
  _uid: string;
  component: "stackblitz_button";
  [k: string]: unknown;
}

export interface TargetedPageStoryblok {
  tech: (
    | ""
    | "nuxt"
    | "next"
    | "js"
    | "ruby"
    | "php"
    | "general"
    | "python"
    | "vue"
    | "react"
    | "angular"
    | "storyblok"
    | "amp"
    | "app"
    | "oauth"
    | "vuedose"
  )[];
  topics?: (number | string)[];
  type?: number | string;
  authors?: unknown[];
  hide_date?: boolean;
  title?: string;
  body?: (
    | AnnotatedImageStoryblok
    | CodeblockStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabsStoryblok
    | MarkdownStoryblok
    | SingleQuoteStoryblok
    | TextLogosLinksStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
  )[];
  og_image?: string;
  og_description?: string;
  og_title?: string;
  meta_title?: string;
  meta_description?: string;
  image_alt?: string;
  image?: string;
  teaser?: string;
  layout?: string;
  popularity?: string;
  deprecated?: unknown;
  noindex?: boolean;
  _uid: string;
  component: "targeted_page";
  [k: string]: unknown;
}

export interface TeaserStoryblok {
  image?: AssetStoryblok;
  headline?: string;
  text?: string;
  ctas?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  _uid: string;
  component: "teaser";
  [k: string]: unknown;
}

export interface TeasersStoryblok {
  headline: string;
  teasers?: TeaserStoryblok[];
  images_size?: "" | "big";
  _uid: string;
  component: "teasers";
  [k: string]: unknown;
}

export interface TechLogosStoryblok {
  technologies?: TechLogosLogoStoryblok[];
  _uid: string;
  component: "tech_logos";
  [k: string]: unknown;
}

export interface TechLogosLogoStoryblok {
  image?: AssetStoryblok;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "tech_logos_logo";
  [k: string]: unknown;
}

export interface TechnologyPartnerStoryblok {
  logo?: AssetStoryblok;
  logo_background_color?: "" | "default" | "custom";
  category?: number | string;
  body?: (EnterpriseTextStoryblok | BlocksGroupStoryblok)[];
  short_description?: string;
  website?: string;
  _uid: string;
  component: "technology_partner";
  [k: string]: unknown;
}

export interface TechnologyPartnersListingStoryblok {
  _uid: string;
  component: "technology_partners_listing";
  [k: string]: unknown;
}

export interface TextFormStoryblok {
  form_template?: number | string;
  phone_field?: "" | " " | "hidden" | "required";
  thank_you_page?: unknown;
  headline?: string;
  intro_text?: string;
  main_text?: RichtextStoryblok;
  footer_text?: RichtextStoryblok;
  quotes?: (ISbStoryData<QuoteStoryblok> | string)[];
  pardot_form?: number | string;
  _uid: string;
  component: "text_form";
  [k: string]: unknown;
}

export interface TextIllustrationGridStoryblok {
  items?: TextIllustrationGridItemStoryblok[];
  _uid: string;
  component: "text_illustration_grid";
  [k: string]: unknown;
}

export interface TextIllustrationGridItemStoryblok {
  custom_illustration?: AssetStoryblok;
  sub_headline?: string;
  headline: string;
  text: RichtextStoryblok;
  size?: "" | "small" | "medium" | "full-width";
  background_color?: "" | " " | "custom";
  accent_color?: "" | " " | "custom";
  link_text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  sub_headline_font_style?: ("" | "normal" | "italic" | "bold")[];
  _uid: string;
  component: "text_illustration_grid_item";
  [k: string]: unknown;
}

export interface TextImagesStoryblok {
  subheadline?: string;
  headline?: string;
  text?: RichtextStoryblok;
  ctas?: EnterpriseCtaStoryblok[];
  body?: (TextImagesFactsStoryblok | TextImagesTextCirclesStoryblok)[];
  images?: MultiassetStoryblok;
  _uid: string;
  component: "text_images";
  [k: string]: unknown;
}

export interface TextImagesFactsStoryblok {
  facts?: EnterpriseFactStoryblok[];
  _uid: string;
  component: "text_images_facts";
  [k: string]: unknown;
}

export interface TextImagesTextCirclesStoryblok {
  text?: RichtextStoryblok;
  images?: MultiassetStoryblok;
  _uid: string;
  component: "text_images_text_circles";
  [k: string]: unknown;
}

export interface TextLinkStoryblok {
  text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  new_tab?: boolean;
  _uid: string;
  component: "text_link";
  [k: string]: unknown;
}

export interface TextLogosLinksStoryblok {
  padding?: "" | "default" | "large";
  headline?: string;
  escape_html?: boolean;
  subheadline?: string;
  text?: RichtextStoryblok;
  right_side_content?: "" | "logos" | "image" | "newsletter" | "none";
  variant?: "" | "newsletter" | "logos" | "centered" | "image" | "full-bleed";
  divider_content?: string;
  image_position?: "" | "default" | "bottom-right";
  headline_size?: "" | " " | "large";
  enable_background_pattern?: boolean;
  background_color?: "" | "custom";
  accent_color?: "" | "custom";
  logos_groups?: TextLogosLinksGroupStoryblok[];
  image?: ImageStoryblok[];
  cta?: EnterpriseCtaStoryblok[];
  image_size?: "" | "default" | "small";
  _uid: string;
  component: "text_logos_links";
  [k: string]: unknown;
}

export interface TextLogosLinksGroupStoryblok {
  headline?: string;
  logos?: (
    | AnnotatedImageStoryblok
    | AppsStoryblok
    | AppStoreBannerStoryblok
    | AuthorStoryblok
    | AvatarsStoryblok
    | BannerStoryblok
    | BannerSectionStoryblok
    | BeastStoryblok
    | BlocksGroupStoryblok
    | BlogCategoryListingStoryblok
    | BlogEntryStoryblok
    | BlogListingStoryblok
    | BlogSliderStoryblok
    | BoxesSliderStoryblok
    | BoxesSliderBoxStoryblok
    | CareersListingCopyStoryblok
    | CaseStudiesListingStoryblok
    | CaseStudiesRecapStoryblok
    | CaseStudiesRecapCategoryStoryblok
    | CaseStudyRecapItemStoryblok
    | CaseStudyRecapItemPerkStoryblok
    | ChangelogStoryblok
    | ChangelogsStoryblok
    | CliButtonStoryblok
    | CodeblockStoryblok
    | ConfigurationStoryblok
    | ContentVariantStoryblok
    | CookieGroupStoryblok
    | CookieInformationStoryblok
    | CookieSettingsStoryblok
    | CtaImageStoryblok
    | CtaWithExpandableContentStoryblok
    | CtaWithIconsStoryblok
    | CtaWithIconsListItemStoryblok
    | CustomBoxesGridStoryblok
    | CustomBoxesGridBoxStoryblok
    | CustomBoxesGridSmallBoxStoryblok
    | CustomerLogoStoryblok
    | CustomersLogosStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | DoubleCtaStoryblok
    | DoubleCtaCtaStoryblok
    | DynamicFormStoryblok
    | DynamicFormFieldStoryblok
    | DynamicFormFieldGroupStoryblok
    | DynamicFormOptionStoryblok
    | DynamicFormSectionStoryblok
    | EmbedImageBoxStoryblok
    | EnterpriseBoxStoryblok
    | EnterpriseBoxGridStoryblok
    | EnterpriseCaseStudyStoryblok
    | EnterpriseCaseStudyReferencesStoryblok
    | EnterpriseCtaStoryblok
    | EnterpriseCtaGroupStoryblok
    | EnterpriseCtaGroupItemStoryblok
    | EnterpriseCtaSectionStoryblok
    | EnterpriseFactStoryblok
    | EnterpriseFactsStoryblok
    | EnterpriseFaqsStoryblok
    | EnterpriseIntroStoryblok
    | EnterpriseLogosStoryblok
    | EnterprisePageStoryblok
    | EnterprisePricingStoryblok
    | EnterprisePricingBoxStoryblok
    | EnterprisePricingSectionStoryblok
    | EnterpriseQuoteReferencesStoryblok
    | EnterpriseQuoteReferenceSliderStoryblok
    | EnterpriseSingleBoxStoryblok
    | EnterpriseSingleBoxImageStoryblok
    | EnterpriseSpacerStoryblok
    | EnterpriseTableStoryblok
    | EnterpriseTechsStoryblok
    | EnterpriseTextStoryblok
    | EnterpriseTextImageStoryblok
    | EnterpriseTwoTextStoryblok
    | EnterpriseTwoTextItemStoryblok
    | EnterpriseVideoStoryblok
    | EventStoryblok
    | EventsListingStoryblok
    | FactsWithImagesStoryblok
    | FactWithImageStoryblok
    | FaqItemStoryblok
    | FaqOverviewStoryblok
    | FeaturedSearchResultStoryblok
    | FeatureItemStoryblok
    | FooterNavigationItemStoryblok
    | FormSectionEnterpriseStoryblok
    | G2ScoreStoryblok
    | GatedContentStoryblok
    | HeroStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSharedContentStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabStoryblok
    | InContentTabsStoryblok
    | JobStoryblok
    | LinkBoardStoryblok
    | LinkBoardLinkStoryblok
    | LinkBoardsStoryblok
    | ListingCtaStoryblok
    | ListWithImageStoryblok
    | LogogroupStoryblok
    | MainCardStoryblok
    | MainCardIconItemStoryblok
    | MainCardStatItemStoryblok
    | MainCardWithStatsStoryblok
    | MarkdownStoryblok
    | NavigationCategoryStoryblok
    | NavigationGroupStoryblok
    | NavigationItemStoryblok
    | NavigationMenuStoryblok
    | NavigationSidebarImageLinkStoryblok
    | NavigationSidebarImagesLinksStoryblok
    | NavigationSidebarImagesLinksItemStoryblok
    | NavigationSidebarLinksStoryblok
    | NavigationSidebarLinksLinkStoryblok
    | NestedCtaStoryblok
    | NewsletterFormStoryblok
    | NewsletterSectionStoryblok
    | PageStoryblok
    | PageIntroStoryblok
    | PaperCtaStoryblok
    | PartnerStoryblok
    | PartnersListingStoryblok
    | PersonalisedContentStoryblok
    | PressEntryStoryblok
    | PressListingStoryblok
    | PricingPlanStoryblok
    | QuoteStoryblok
    | RoadmapStoryblok
    | RoadmapCategoryStoryblok
    | RoiBenefitsInfoStoryblok
    | RoiCalculatorStoryblok
    | RootStoryblok
    | ScrollableTabsStoryblok
    | ScrollableTabsTabStoryblok
    | SearchStoryblok
    | SinglePricingBoxStoryblok
    | SingleQuoteStoryblok
    | StackblitzButtonStoryblok
    | TargetedPageStoryblok
    | TeaserStoryblok
    | TeasersStoryblok
    | TechLogosStoryblok
    | TechLogosLogoStoryblok
    | TechnologyPartnerStoryblok
    | TechnologyPartnersListingStoryblok
    | TextFormStoryblok
    | TextIllustrationGridStoryblok
    | TextIllustrationGridItemStoryblok
    | TextImagesStoryblok
    | TextImagesFactsStoryblok
    | TextImagesTextCirclesStoryblok
    | TextLinkStoryblok
    | TextLogosLinksStoryblok
    | TextLogosLinksGroupStoryblok
    | TextLogosLinksLogoStoryblok
    | TextQuotesIllustrationStoryblok
    | TextQuotesIllustrationLinkStoryblok
    | TitleWithCtaStoryblok
    | TopCtaStoryblok
    | TopCtaItemStoryblok
    | TutorialsListingStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
    | VideoTranscriptChapterStoryblok
    | WhitepapersListingStoryblok
    | TestStoryblok
  )[];
  link_text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "text_logos_links_group";
  [k: string]: unknown;
}

export interface TextLogosLinksLogoStoryblok {
  image?: AssetStoryblok;
  image_alt?: string;
  _uid: string;
  component: "text_logos_links_logo";
  [k: string]: unknown;
}

export interface TextQuotesIllustrationStoryblok {
  background_color?: "" | " " | "custom";
  accent_color?: "" | " " | "custom";
  background_decoration?: "" | " " | "circle" | "circle-vertically-centered";
  spacing_size?: "" | "small" | "medium" | " ";
  compact?: boolean;
  illustration_size?: "" | " " | "large";
  illustration?: "" | "animations/console" | "animations/editor" | "custom";
  illustration_side?: "" | "left" | "right";
  custom_illustration?: AssetStoryblok;
  sub_headline?: string;
  headline: string;
  text: RichtextStoryblok;
  ctas?: TextQuotesIllustrationLinkStoryblok[];
  quotes?: (ISbStoryData<QuoteStoryblok> | string)[];
  video_url?: string;
  _uid: string;
  component: "text_quotes_illustration";
  [k: string]: unknown;
}

export interface TextQuotesIllustrationLinkStoryblok {
  text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  open_in?: "" | "_blank";
  _uid: string;
  component: "text_quotes_illustration_link";
  [k: string]: unknown;
}

export interface TitleWithCtaStoryblok {
  title: string;
  cta: EnterpriseCtaStoryblok[];
  _uid: string;
  component: "title_with_cta";
  [k: string]: unknown;
}

export interface TopCtaStoryblok {
  ctas_stack_name?: string;
  ctas?: TopCtaItemStoryblok[];
  _uid: string;
  component: "top_cta";
  [k: string]: unknown;
}

export interface TopCtaItemStoryblok {
  text?: RichtextStoryblok;
  show_after_pageviews?: string;
  _uid: string;
  component: "top_cta_item";
  [k: string]: unknown;
}

export interface TutorialsListingStoryblok {
  _uid: string;
  component: "tutorials_listing";
  [k: string]: unknown;
}

export interface VideoStoryblok {
  video_url?: string;
  caption?: RichtextStoryblok;
  _uid: string;
  component: "video";
  [k: string]: unknown;
}

export interface VideoTranscriptStoryblok {
  video_id?: string;
  intro?: RichtextStoryblok;
  chapters?: VideoTranscriptChapterStoryblok[];
  ctas?: EnterpriseCtaStoryblok[];
  _uid: string;
  component: "video_transcript";
  [k: string]: unknown;
}

export interface VideoTranscriptChapterStoryblok {
  starting_time?: string;
  name?: string;
  excerpt?: string;
  body?: (
    | AnnotatedImageStoryblok
    | CodeblockStoryblok
    | CustomRichtextStoryblok
    | CustomTableStoryblok
    | HintStoryblok
    | ImageStoryblok
    | InContentBoxStoryblok
    | InContentEventRegistrationStoryblok
    | InContentGatedContentStoryblok
    | InContentLinkBoardStoryblok
    | InContentLinkBoardLinkStoryblok
    | InContentLinkBoardsStoryblok
    | InContentNestedSharedContentStoryblok
    | InContentNewsletterStoryblok
    | InContentSliderStoryblok
    | InContentSpacerStoryblok
    | InContentTabsStoryblok
    | MarkdownStoryblok
    | SingleQuoteStoryblok
    | TextLogosLinksStoryblok
    | VideoStoryblok
    | VideoTranscriptStoryblok
  )[];
  _uid: string;
  component: "video_transcript_chapter";
  [k: string]: unknown;
}

export interface WhitepapersListingStoryblok {
  featured_entry?: ISbStoryData<GatedContentStoryblok> | string;
  category?: number | string;
  whitepapers?: unknown[];
  ctas?: ListingCtaStoryblok[];
  _uid: string;
  component: "whitepapers_listing";
  [k: string]: unknown;
}

export interface TestStoryblok {
  image?: string;
  given_name?: string;
  family_name?: string;
  about?: string;
  email?: string;
  cta?: TextLogosLinksStoryblok[];
  instagram_account?: string;
  linkedin_account?: string;
  discord_account?: string;
  twitter_account?: string;
  github_account?: string;
  _uid: string;
  component: "test";
  [k: string]: unknown;
}
