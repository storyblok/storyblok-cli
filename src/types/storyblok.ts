export type StoryblokPropertyType = 'asset' | 'multiasset' | 'multilink' | 'table' | 'richtext';

export type ComponentPropertySchemaType =
  | StoryblokPropertyType
  | 'array'
  | 'bloks'
  | 'boolean'
  | 'custom'
  | 'datetime'
  | 'image'
  | 'markdown'
  | 'number'
  | 'option'
  | 'options'
  | 'text'
  | 'textarea';

export interface ComponentPropertySchemaOption {
  _uid: string;
  name: string;
  value: string;
}

export interface ComponentPropertySchema {
  asset_link_type?: boolean;
  component_group_whitelist?: string[];
  component_whitelist?: string[];
  email_link_type?: boolean;
  exclude_empty_option?: boolean;
  filter_content_type?: string | string[];
  key: string;
  options?: ComponentPropertySchemaOption[];
  pos: number;
  restrict_components?: boolean;
  restrict_type?: 'groups' | '';
  source?: 'internal' | 'external' | 'internal_stories' | 'internal_languages';
  type: ComponentPropertySchemaType;
  use_uuid?: boolean;
};

export interface StoryblokAsset {
  alt: string | null;
  copyright: string | null;
  fieldtype: 'asset';
  id: number;
  filename: string | null;
  name: string;
  title: string | null;
  focus: string | null;
  meta_data: Record<string, any>;
  source: string | null;
  is_external_url: boolean;
  is_private: boolean;
  src: string;
  updated_at: string;
  // Cloudinary integration keys
  width: number | null;
  height: number | null;
  aspect_ratio: number | null;
  public_id: string | null;
  content_type: string;
}

export interface StoryblokMultiasset extends Array<StoryblokAsset> {}

export interface StoryblokMultilink {
  fieldtype: 'multilink';
  id: string;
  url: string;
  cached_url: string;
  target?: '_blank' | '_self';
  anchor?: string;
  rel?: string;
  title?: string;
  prep?: string;
  linktype: 'story' | 'url' | 'email' | 'asset';
  story?: {
    name: string;
    created_at: string;
    published_at: string;
    id: number;
    uuid: string;
    content: Record<string, any>;
    slug: string;
    full_slug: string;
    sort_by_date?: string;
    position?: number;
    tag_list?: string[];
    is_startpage?: boolean;
    parent_id?: number | null;
    meta_data?: Record<string, any> | null;
    group_id?: string;
    first_published_at?: string;
    release_id?: number | null;
    lang?: string;
    path?: string | null;
    alternates?: any[];
    default_full_slug?: string | null;
    translated_slugs?: any[] | null;
  };
  email?: string;
}

export interface StoryblokTable {
  thead: Array<{
    _uid: string;
    value: string;
    component: number;
  }>;
  tbody: Array<{
    _uid: string;
    component: number;
    body: Array<{
      _uid: string;
      value: string;
      component: number;
    }>;
  }>;
}

export interface StoryblokRichtext {
  type: string;
  content?: StoryblokRichtext[];
  marks?: StoryblokRichtext[];
  attrs?: Record<string, any>;
  text?: string;
}
