PGDMP         *                z           postgres    14.3    14.3 !               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    13754    postgres    DATABASE     e   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_Canada.1252';
    DROP DATABASE postgres;
                postgres    false                       0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    3358                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false                        0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    4            �            1259    17340    config    TABLE     6  CREATE TABLE public.config (
    id integer DEFAULT 1 NOT NULL,
    reviewers_channel_id text,
    transcribers_channel_id text,
    email_domain text,
    toggle_discord_notif boolean DEFAULT true NOT NULL,
    toggle_email_notif boolean DEFAULT true NOT NULL,
    CONSTRAINT only_one_row CHECK ((id = 1))
);
    DROP TABLE public.config;
       public         heap    postgres    false    4            �            1259    16692    file    TABLE     �   CREATE TABLE public.file (
    id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'transcribe'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    media bytea NOT NULL
);
    DROP TABLE public.file;
       public         heap    postgres    false    4            �            1259    16699    file_id_seq    SEQUENCE     �   CREATE SEQUENCE public.file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.file_id_seq;
       public          postgres    false    4    211            !           0    0    file_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.file_id_seq OWNED BY public.file.id;
          public          postgres    false    212            �            1259    16700    job    TABLE     �  CREATE TABLE public.job (
    id integer NOT NULL,
    claimed_userid integer,
    transcribe_fileid integer,
    review_fileid integer,
    complete_fileid integer,
    owner_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewer_id integer,
    transcriber_id integer,
    deadline timestamp with time zone,
    status text DEFAULT 'transcribe'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    name text
);
    DROP TABLE public.job;
       public         heap    postgres    false    4            �            1259    16708 
   job_id_seq    SEQUENCE     �   CREATE SEQUENCE public.job_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 !   DROP SEQUENCE public.job_id_seq;
       public          postgres    false    213    4            "           0    0 
   job_id_seq    SEQUENCE OWNED BY     9   ALTER SEQUENCE public.job_id_seq OWNED BY public.job.id;
          public          postgres    false    214            �            1259    16709    user    TABLE     L  CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(20) NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    discordid text,
    role text DEFAULT 'client'::text NOT NULL,
    togglediscordpm boolean DEFAULT false NOT NULL,
    toggleemailnotification boolean DEFAULT true NOT NULL
);
    DROP TABLE public."user";
       public         heap    postgres    false    4            �            1259    16717    user_table_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.user_table_id_seq;
       public          postgres    false    215    4            #           0    0    user_table_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.user_table_id_seq OWNED BY public."user".id;
          public          postgres    false    216            n           2604    16718    file id    DEFAULT     b   ALTER TABLE ONLY public.file ALTER COLUMN id SET DEFAULT nextval('public.file_id_seq'::regclass);
 6   ALTER TABLE public.file ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    211            r           2604    16719    job id    DEFAULT     `   ALTER TABLE ONLY public.job ALTER COLUMN id SET DEFAULT nextval('public.job_id_seq'::regclass);
 5   ALTER TABLE public.job ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    213            v           2604    16720    user id    DEFAULT     j   ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_table_id_seq'::regclass);
 8   ALTER TABLE public."user" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215            �           2606    17350    config config_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.config
    ADD CONSTRAINT config_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.config DROP CONSTRAINT config_pkey;
       public            postgres    false    217            �           2606    16725    user email_unique 
   CONSTRAINT     O   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT email_unique UNIQUE (email);
 =   ALTER TABLE ONLY public."user" DROP CONSTRAINT email_unique;
       public            postgres    false    215            |           2606    16727    file file_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.file DROP CONSTRAINT file_pkey;
       public            postgres    false    211            ~           2606    16729    job job_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.job DROP CONSTRAINT job_pkey;
       public            postgres    false    213            �           2606    16731    user pk_user 
   CONSTRAINT     L   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT pk_user PRIMARY KEY (id);
 8   ALTER TABLE ONLY public."user" DROP CONSTRAINT pk_user;
       public            postgres    false    215            �           2606    16733    user user_username_unique 
   CONSTRAINT     Z   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);
 E   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_username_unique;
       public            postgres    false    215            �           2606    16734    job job_claimed_userid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_claimed_userid_fkey FOREIGN KEY (claimed_userid) REFERENCES public."user"(id);
 E   ALTER TABLE ONLY public.job DROP CONSTRAINT job_claimed_userid_fkey;
       public          postgres    false    215    213    3202            �           2606    16739    job job_complete_fkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_complete_fkey FOREIGN KEY (complete_fileid) REFERENCES public.file(id);
 ?   ALTER TABLE ONLY public.job DROP CONSTRAINT job_complete_fkey;
       public          postgres    false    211    3196    213            �           2606    16744    job job_owner_id_fkey    FK CONSTRAINT     v   ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public."user"(id);
 ?   ALTER TABLE ONLY public.job DROP CONSTRAINT job_owner_id_fkey;
       public          postgres    false    215    3202    213            �           2606    16749    job job_review_fileid_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_review_fileid_fkey FOREIGN KEY (review_fileid) REFERENCES public.file(id);
 D   ALTER TABLE ONLY public.job DROP CONSTRAINT job_review_fileid_fkey;
       public          postgres    false    211    213    3196            �           2606    16754    job job_reviewer_id_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public."user"(id);
 B   ALTER TABLE ONLY public.job DROP CONSTRAINT job_reviewer_id_fkey;
       public          postgres    false    215    3202    213            �           2606    16759    job job_transcribe_fileid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_transcribe_fileid_fkey FOREIGN KEY (transcribe_fileid) REFERENCES public.file(id);
 H   ALTER TABLE ONLY public.job DROP CONSTRAINT job_transcribe_fileid_fkey;
       public          postgres    false    3196    211    213            �           2606    16764    job job_transcriber_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_transcriber_fkey FOREIGN KEY (transcriber_id) REFERENCES public."user"(id);
 B   ALTER TABLE ONLY public.job DROP CONSTRAINT job_transcriber_fkey;
       public          postgres    false    213    3202    215           