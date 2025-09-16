-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Comment (
  comment_id character varying NOT NULL,
  content text NOT NULL,
  created_date timestamp without time zone,
  upvote bigint,
  material_id character varying,
  user_id character varying,
  CONSTRAINT Comment_pkey PRIMARY KEY (comment_id),
  CONSTRAINT Comment_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.Material(material_id),
  CONSTRAINT Comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id)
);

CREATE TABLE public.History (
  history_id character varying NOT NULL,
  user_id character varying NOT NULL,
  material_id character varying,
  lesson_id character varying,
  type character varying,
  viewed_date timestamp without time zone,
  CONSTRAINT History_pkey PRIMARY KEY (history_id),
  CONSTRAINT History_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id),
  CONSTRAINT History_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.Material(material_id),
  CONSTRAINT History_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.Lesson(lesson_id)
);

CREATE TABLE public.Lesson (
  lesson_id character varying NOT NULL,
  name character varying,
  description text,
  created_date timestamp without time zone,
  last_update timestamp without time zone,
  material_count integer DEFAULT 0,
  user_id character varying,
  is_public boolean DEFAULT false,
  view_count integer DEFAULT 0,
  CONSTRAINT Lesson_pkey PRIMARY KEY (lesson_id),
  CONSTRAINT Lesson_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id)
);

CREATE TABLE public.Material (
  material_id character varying NOT NULL,
  name character varying,
  description text,
  subject_id character varying,
  file_url text,
  size integer,
  file_type character varying,
  num_page integer,
  upload_date timestamp without time zone,
  download_count integer,
  total_rating integer,
  rating_count integer,
  view_count integer,
  is_paid boolean,
  price numeric,
  user_id character varying,
  lesson_id character varying,
  is_public boolean NOT NULL DEFAULT true,
  CONSTRAINT Material_pkey PRIMARY KEY (material_id),
  CONSTRAINT Material_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.Subject(subject_id),
  CONSTRAINT Material_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id),
  CONSTRAINT Material_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.Lesson(lesson_id)
);

CREATE TABLE public.MaterialPage (
  material_id character varying NOT NULL,
  page smallint NOT NULL,
  url text,
  CONSTRAINT MaterialPage_pkey PRIMARY KEY (page, material_id),
  CONSTRAINT MaterialPage_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.Material(material_id)
);

CREATE TABLE public.MaterialSummary (
  summary_id character varying NOT NULL,
  material_id character varying NOT NULL,
  content text,
  prompt_token_count bigint,
  thoughts_token_count bigint,
  total_token_count bigint,
  CONSTRAINT MaterialSummary_pkey PRIMARY KEY (summary_id),
  CONSTRAINT MaterialSummary_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.Material(material_id)
);

CREATE TABLE public.Payment (
  payment_id character varying NOT NULL,
  material_id character varying NOT NULL,
  seller_id character varying,
  buyer_id character varying,
  amount double precision,
  created_date timestamp without time zone,
  status character varying,
  currency character varying,
  CONSTRAINT Payment_pkey PRIMARY KEY (payment_id),
  CONSTRAINT Payment_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.Material(material_id),
  CONSTRAINT Payment_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.User(user_id),
  CONSTRAINT Payment_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.User(user_id)
);

CREATE TABLE public.Rating (
  material_id character varying NOT NULL,
  star_level smallint NOT NULL,
  count integer,
  CONSTRAINT Rating_pkey PRIMARY KEY (star_level, material_id),
  CONSTRAINT Rating_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.Material(material_id)
);

CREATE TABLE public.RatingLog (
  user_id character varying NOT NULL,
  material_id character varying NOT NULL,
  star_level smallint,
  rated_date timestamp without time zone,
  CONSTRAINT RatingLog_pkey PRIMARY KEY (material_id, user_id),
  CONSTRAINT RatingLog_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id),
  CONSTRAINT RatingLog_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.Material(material_id)
);

CREATE TABLE public.Subject (
  subject_id character varying NOT NULL,
  name character varying NOT NULL,
  description text,
  CONSTRAINT Subject_pkey PRIMARY KEY (subject_id)
);

CREATE TABLE public.Task (
  task_id character varying NOT NULL,
  material_id character varying,
  created_date timestamp without time zone,
  content text,
  status character varying NOT NULL,
  CONSTRAINT Task_pkey PRIMARY KEY (status, task_id)
);

CREATE TABLE public.Upvote (
  comment_id character varying NOT NULL,
  vote_date timestamp without time zone,
  user_id character varying NOT NULL,
  CONSTRAINT Upvote_pkey PRIMARY KEY (comment_id, user_id),
  CONSTRAINT Upvote_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id),
  CONSTRAINT Upvote_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.Comment(comment_id)
);

CREATE TABLE public.User (
  user_id character varying NOT NULL,
  email character varying NOT NULL,
  full_name character varying NOT NULL,
  gender character varying,
  bio text,
  profile_picture_url character varying,
  date_of_birth date,
  address character varying,
  password_hash character varying,
  created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  last_login timestamp without time zone,
  is_admin boolean DEFAULT false,
  background_image_url character varying,
  stripe_account_id character varying,
  auth_provider character varying,
  provider_id character varying,
  is_verified boolean DEFAULT false,
  verification_code character varying,
  CONSTRAINT User_pkey PRIMARY KEY (user_id)
);