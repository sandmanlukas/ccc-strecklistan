--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Homebrew)
-- Dumped by pg_dump version 16.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AccountRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountRole" AS ENUM (
    'CCC',
    'ADMIN'
);


ALTER TYPE public."AccountRole" OWNER TO postgres;

--
-- Name: ItemType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ItemType" AS ENUM (
    'DRYCK',
    'MAT',
    'ANNAT'
);


ALTER TYPE public."ItemType" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ORDFORANDE',
    'KASSOR',
    'BYGGCHEF',
    'BILCHEF',
    'GARDVAR',
    'KLADCHEF',
    'PROGRAMCHEF',
    'ANNONSCHEF',
    'MUSIKCHEF',
    'OLCHEF',
    'PRCHEF',
    'KADAVER',
    'OTHER'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role public."AccountRole" DEFAULT 'CCC'::public."AccountRole" NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Account_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Account_id_seq" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Account_id_seq" OWNED BY public."Account".id;


--
-- Name: DebtCollect; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DebtCollect" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailSentAt" timestamp(3) without time zone
);


ALTER TABLE public."DebtCollect" OWNER TO postgres;

--
-- Name: DebtCollect_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DebtCollect_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DebtCollect_id_seq" OWNER TO postgres;

--
-- Name: DebtCollect_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DebtCollect_id_seq" OWNED BY public."DebtCollect".id;


--
-- Name: Item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Item" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    barcode text NOT NULL,
    price integer NOT NULL,
    volume integer DEFAULT 0 NOT NULL,
    type public."ItemType" DEFAULT 'DRYCK'::public."ItemType" NOT NULL
);


ALTER TABLE public."Item" OWNER TO postgres;

--
-- Name: Item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Item_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Item_id_seq" OWNER TO postgres;

--
-- Name: Item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Item_id_seq" OWNED BY public."Item".id;


--
-- Name: Swish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Swish" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    number text NOT NULL,
    "imageUrl" text
);


ALTER TABLE public."Swish" OWNER TO postgres;

--
-- Name: Swish_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Swish_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Swish_id_seq" OWNER TO postgres;

--
-- Name: Swish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Swish_id_seq" OWNED BY public."Swish".id;


--
-- Name: Text; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Text" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    title text NOT NULL,
    body text NOT NULL
);


ALTER TABLE public."Text" OWNER TO postgres;

--
-- Name: Text_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Text_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Text_id_seq" OWNER TO postgres;

--
-- Name: Text_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Text_id_seq" OWNED BY public."Text".id;


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL,
    barcode text NOT NULL,
    price integer NOT NULL,
    "beeredUser" text,
    "beeredBy" text,
    "beeredTransaction" integer
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- Name: Transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Transaction_id_seq" OWNER TO postgres;

--
-- Name: Transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Transaction_id_seq" OWNED BY public."Transaction".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    username text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role public."UserRole" DEFAULT 'ORDFORANDE'::public."UserRole" NOT NULL,
    debt integer DEFAULT 0 NOT NULL,
    avatar text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account" ALTER COLUMN id SET DEFAULT nextval('public."Account_id_seq"'::regclass);


--
-- Name: DebtCollect id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DebtCollect" ALTER COLUMN id SET DEFAULT nextval('public."DebtCollect_id_seq"'::regclass);


--
-- Name: Item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Item" ALTER COLUMN id SET DEFAULT nextval('public."Item_id_seq"'::regclass);


--
-- Name: Swish id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Swish" ALTER COLUMN id SET DEFAULT nextval('public."Swish_id_seq"'::regclass);


--
-- Name: Text id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Text" ALTER COLUMN id SET DEFAULT nextval('public."Text_id_seq"'::regclass);


--
-- Name: Transaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction" ALTER COLUMN id SET DEFAULT nextval('public."Transaction_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, username, password, "createdAt", "updatedAt", role) FROM stdin;
1	admin	$2a$10$oRp4IgJfa4xig2INg.Jy7u3862L1tNLljn/hdtKXQvqqCElJdiO22	2024-09-09 19:01:27.95	2024-09-09 19:01:27.95	ADMIN
2	ccc	$2a$10$oRp4IgJfa4xig2INg.Jy7u3862L1tNLljn/hdtKXQvqqCElJdiO22	2024-09-09 19:01:27.953	2024-09-09 19:01:27.953	CCC
\.


--
-- Data for Name: DebtCollect; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DebtCollect" (id, "createdAt", "updatedAt", "emailSentAt") FROM stdin;
2	2024-03-21 21:13:45.813	2024-04-02 17:22:39.777	\N
\.


--
-- Data for Name: Item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Item" (id, name, "createdAt", "updatedAt", barcode, price, volume, type) FROM stdin;
1	Bärsning	2024-09-09 19:01:27.954	2024-09-09 19:01:27.954	0000000000000	0	0	DRYCK
2	Electronic Plastic Cheese	2024-09-09 19:01:27.968	2024-09-09 19:01:27.968	c638e1c8-fc25-4793-8333-5ed28270b64d	714	14	DRYCK
3	Bespoke Metal Computer	2024-09-09 19:01:27.969	2024-09-09 19:01:27.969	9867e73a-0667-44f4-8161-3eb7beeb5db5	217	64	DRYCK
4	Sleek Soft Computer	2024-09-09 19:01:27.969	2024-09-09 19:01:27.969	29d31d0f-d3a6-47a7-bd52-f28e938822c7	845	73	DRYCK
5	Luxurious Cotton Pants	2024-09-09 19:01:27.97	2024-09-09 19:01:27.97	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	629	56	DRYCK
6	Elegant Soft Table	2024-09-09 19:01:27.97	2024-09-09 19:01:27.97	0f215f28-1af6-469e-b002-5f1e7fdc29f2	435	72	DRYCK
7	Licensed Concrete Bacon	2024-09-09 19:01:27.97	2024-09-09 19:01:27.97	74d51113-4a0e-4e3a-812d-005371d14aa4	964	40	DRYCK
8	Elegant Fresh Bacon	2024-09-09 19:01:27.971	2024-09-09 19:01:27.971	b85616d5-c7c6-4664-a5bd-47eac49187ac	631	98	DRYCK
9	Small Concrete Cheese	2024-09-09 19:01:27.971	2024-09-09 19:01:27.971	7d34113a-d9db-40db-a2ca-53c92332a437	279	32	DRYCK
10	Tasty Plastic Bacon	2024-09-09 19:01:27.972	2024-09-09 19:01:27.972	c11ac4e7-04d8-4ea0-b730-7d039f455024	475	86	DRYCK
11	Unbranded Granite Bacon	2024-09-09 19:01:27.972	2024-09-09 19:01:27.972	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	28	21	DRYCK
12	Raspbery	2025-01-17 19:58:25.007	2025-01-17 19:58:25.007	7330053036200	10	33	DRYCK
\.


--
-- Data for Name: Swish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Swish" (id, "createdAt", "updatedAt", name, number, "imageUrl") FROM stdin;
1	2024-09-09 19:01:27.956	2024-09-09 19:01:27.956	Test Testsson	1234567890	\N
4	2024-04-02 17:37:33.234	2024-04-02 17:37:33.234	Gunnar Löfquist	0725001648	https://m1jd2y7yyifuzhde.public.blob.vercel-storage.com/swish_code-rU1169LN1NU07U9pJbuCAezHN7A1Uz
\.


--
-- Data for Name: Text; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Text" (id, name, "createdAt", "updatedAt", title, body) FROM stdin;
1	mail	2024-03-17 18:22:07.358	2024-03-17 18:22:07.358	CCC - Strecklisteskuld	Habba habba! Nu är det dags igen, dags att betala av era skulder. Nedanför ser du din skuld samt till vem du ska swisha. Du ser även dina senaste transaktioner.
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaction" (id, "createdAt", "updatedAt", "userId", barcode, price, "beeredUser", "beeredBy", "beeredTransaction") FROM stdin;
1	2024-08-30 09:58:42.047	2024-09-09 19:01:27.973	10	0f215f28-1af6-469e-b002-5f1e7fdc29f2	55	\N	\N	\N
2	2024-08-14 14:15:50.628	2024-09-09 19:01:27.975	6	b85616d5-c7c6-4664-a5bd-47eac49187ac	72	\N	\N	\N
3	2024-09-01 19:47:09.534	2024-09-09 19:01:27.976	6	29d31d0f-d3a6-47a7-bd52-f28e938822c7	45	\N	\N	\N
4	2024-08-18 19:58:31.729	2024-09-09 19:01:27.977	9	c638e1c8-fc25-4793-8333-5ed28270b64d	99	\N	\N	\N
5	2024-09-07 21:50:32.066	2024-09-09 19:01:27.977	5	9867e73a-0667-44f4-8161-3eb7beeb5db5	90	\N	\N	\N
6	2024-08-23 21:22:53.637	2024-09-09 19:01:27.978	5	0f215f28-1af6-469e-b002-5f1e7fdc29f2	96	\N	\N	\N
7	2024-08-16 22:17:04.522	2024-09-09 19:01:27.978	1	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	43	\N	\N	\N
8	2024-09-08 19:16:56.632	2024-09-09 19:01:27.979	10	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	78	\N	\N	\N
9	2024-08-14 06:17:09.041	2024-09-09 19:01:27.98	3	29d31d0f-d3a6-47a7-bd52-f28e938822c7	58	\N	\N	\N
10	2024-08-17 17:59:37.532	2024-09-09 19:01:27.98	10	74d51113-4a0e-4e3a-812d-005371d14aa4	75	\N	\N	\N
11	2024-09-04 04:55:24.358	2024-09-09 19:01:27.981	3	7d34113a-d9db-40db-a2ca-53c92332a437	74	\N	\N	\N
12	2024-08-16 05:35:02.316	2024-09-09 19:01:27.981	4	c11ac4e7-04d8-4ea0-b730-7d039f455024	60	\N	\N	\N
13	2024-09-09 01:25:44.907	2024-09-09 19:01:27.982	2	9867e73a-0667-44f4-8161-3eb7beeb5db5	66	\N	\N	\N
14	2024-08-15 15:21:17.909	2024-09-09 19:01:27.982	4	74d51113-4a0e-4e3a-812d-005371d14aa4	88	\N	\N	\N
15	2024-08-16 05:40:30.193	2024-09-09 19:01:27.982	9	c11ac4e7-04d8-4ea0-b730-7d039f455024	85	\N	\N	\N
16	2024-08-19 05:59:22.273	2024-09-09 19:01:27.983	4	b85616d5-c7c6-4664-a5bd-47eac49187ac	40	\N	\N	\N
17	2024-09-07 15:50:26.557	2024-09-09 19:01:27.983	3	c11ac4e7-04d8-4ea0-b730-7d039f455024	84	\N	\N	\N
18	2024-09-05 00:13:39.668	2024-09-09 19:01:27.984	2	7d34113a-d9db-40db-a2ca-53c92332a437	35	\N	\N	\N
19	2024-08-13 01:10:02.171	2024-09-09 19:01:27.984	10	74d51113-4a0e-4e3a-812d-005371d14aa4	90	\N	\N	\N
20	2024-08-30 11:10:26.005	2024-09-09 19:01:27.985	8	c638e1c8-fc25-4793-8333-5ed28270b64d	43	\N	\N	\N
21	2024-08-18 12:10:34.147	2024-09-09 19:01:27.985	4	c638e1c8-fc25-4793-8333-5ed28270b64d	30	\N	\N	\N
22	2024-09-06 05:54:23.935	2024-09-09 19:01:27.985	6	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	87	\N	\N	\N
23	2024-08-24 05:35:49.045	2024-09-09 19:01:27.986	7	c638e1c8-fc25-4793-8333-5ed28270b64d	42	\N	\N	\N
24	2024-09-01 11:17:45.574	2024-09-09 19:01:27.986	8	0f215f28-1af6-469e-b002-5f1e7fdc29f2	40	\N	\N	\N
25	2024-08-25 08:13:50.923	2024-09-09 19:01:27.987	7	9867e73a-0667-44f4-8161-3eb7beeb5db5	100	\N	\N	\N
26	2024-09-02 22:31:00.637	2024-09-09 19:01:27.987	4	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	73	\N	\N	\N
27	2024-08-27 11:38:20.899	2024-09-09 19:01:27.988	2	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	91	\N	\N	\N
28	2024-08-20 06:13:09.111	2024-09-09 19:01:27.988	4	c11ac4e7-04d8-4ea0-b730-7d039f455024	69	\N	\N	\N
29	2024-09-04 09:49:33.334	2024-09-09 19:01:27.988	2	0f215f28-1af6-469e-b002-5f1e7fdc29f2	85	\N	\N	\N
30	2024-08-27 02:39:13.745	2024-09-09 19:01:27.989	8	9867e73a-0667-44f4-8161-3eb7beeb5db5	50	\N	\N	\N
31	2024-09-02 03:49:22.408	2024-09-09 19:01:27.989	7	c11ac4e7-04d8-4ea0-b730-7d039f455024	84	\N	\N	\N
32	2024-08-31 04:07:33.765	2024-09-09 19:01:27.99	8	9867e73a-0667-44f4-8161-3eb7beeb5db5	20	\N	\N	\N
33	2024-08-30 15:33:42.191	2024-09-09 19:01:27.99	10	9867e73a-0667-44f4-8161-3eb7beeb5db5	26	\N	\N	\N
34	2024-08-20 03:52:17.734	2024-09-09 19:01:27.991	10	9867e73a-0667-44f4-8161-3eb7beeb5db5	22	\N	\N	\N
35	2024-09-04 08:21:59.364	2024-09-09 19:01:27.991	10	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	84	\N	\N	\N
36	2024-09-01 01:22:40.906	2024-09-09 19:01:27.992	3	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	48	\N	\N	\N
37	2024-08-31 10:31:02.007	2024-09-09 19:01:27.992	7	29d31d0f-d3a6-47a7-bd52-f28e938822c7	31	\N	\N	\N
38	2024-08-14 10:03:21.102	2024-09-09 19:01:27.992	2	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	45	\N	\N	\N
39	2024-09-02 18:17:44.173	2024-09-09 19:01:27.993	3	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	49	\N	\N	\N
40	2024-09-04 03:12:59.38	2024-09-09 19:01:27.993	2	b85616d5-c7c6-4664-a5bd-47eac49187ac	74	\N	\N	\N
41	2024-08-29 10:50:39.086	2024-09-09 19:01:27.994	9	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	23	\N	\N	\N
42	2024-08-21 12:58:15.94	2024-09-09 19:01:27.994	1	7d34113a-d9db-40db-a2ca-53c92332a437	63	\N	\N	\N
43	2024-08-21 12:01:32.583	2024-09-09 19:01:27.995	5	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	28	\N	\N	\N
44	2024-08-23 06:01:04.52	2024-09-09 19:01:27.995	8	7d34113a-d9db-40db-a2ca-53c92332a437	78	\N	\N	\N
45	2024-09-04 04:55:44.608	2024-09-09 19:01:27.996	8	0f215f28-1af6-469e-b002-5f1e7fdc29f2	92	\N	\N	\N
46	2024-08-31 15:12:31.895	2024-09-09 19:01:27.996	8	b85616d5-c7c6-4664-a5bd-47eac49187ac	86	\N	\N	\N
47	2024-09-04 11:43:15.568	2024-09-09 19:01:27.996	3	c638e1c8-fc25-4793-8333-5ed28270b64d	54	\N	\N	\N
48	2024-09-08 05:15:27.824	2024-09-09 19:01:27.997	6	9867e73a-0667-44f4-8161-3eb7beeb5db5	15	\N	\N	\N
49	2024-08-13 10:05:15.194	2024-09-09 19:01:27.997	9	c11ac4e7-04d8-4ea0-b730-7d039f455024	34	\N	\N	\N
50	2024-08-15 19:25:03.926	2024-09-09 19:01:27.998	1	c638e1c8-fc25-4793-8333-5ed28270b64d	32	\N	\N	\N
51	2024-08-31 06:04:11.315	2024-09-09 19:01:27.998	9	7d34113a-d9db-40db-a2ca-53c92332a437	15	\N	\N	\N
52	2024-08-27 21:02:17.987	2024-09-09 19:01:27.998	7	9867e73a-0667-44f4-8161-3eb7beeb5db5	52	\N	\N	\N
53	2024-09-03 19:28:59.259	2024-09-09 19:01:27.999	4	c638e1c8-fc25-4793-8333-5ed28270b64d	36	\N	\N	\N
54	2024-08-22 16:57:29.604	2024-09-09 19:01:28	9	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	22	\N	\N	\N
55	2024-08-31 09:34:23.268	2024-09-09 19:01:28.001	7	9867e73a-0667-44f4-8161-3eb7beeb5db5	56	\N	\N	\N
56	2024-08-27 16:07:14.965	2024-09-09 19:01:28.001	6	9867e73a-0667-44f4-8161-3eb7beeb5db5	71	\N	\N	\N
57	2024-09-03 22:57:06.27	2024-09-09 19:01:28.002	6	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	91	\N	\N	\N
58	2024-08-24 18:19:28.068	2024-09-09 19:01:28.002	1	74d51113-4a0e-4e3a-812d-005371d14aa4	49	\N	\N	\N
59	2024-08-25 16:28:48.587	2024-09-09 19:01:28.002	1	c638e1c8-fc25-4793-8333-5ed28270b64d	32	\N	\N	\N
60	2024-08-31 03:31:56.391	2024-09-09 19:01:28.003	8	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	37	\N	\N	\N
61	2024-08-26 15:01:43.362	2024-09-09 19:01:28.004	3	c11ac4e7-04d8-4ea0-b730-7d039f455024	28	\N	\N	\N
62	2024-08-23 19:19:03.128	2024-09-09 19:01:28.004	1	0f215f28-1af6-469e-b002-5f1e7fdc29f2	27	\N	\N	\N
63	2024-08-27 17:32:27.928	2024-09-09 19:01:28.005	2	74d51113-4a0e-4e3a-812d-005371d14aa4	87	\N	\N	\N
64	2024-09-09 00:55:59.924	2024-09-09 19:01:28.005	1	9867e73a-0667-44f4-8161-3eb7beeb5db5	67	\N	\N	\N
65	2024-09-01 11:09:36.017	2024-09-09 19:01:28.006	9	9867e73a-0667-44f4-8161-3eb7beeb5db5	42	\N	\N	\N
66	2024-09-06 03:33:48.837	2024-09-09 19:01:28.006	1	b85616d5-c7c6-4664-a5bd-47eac49187ac	74	\N	\N	\N
67	2024-08-27 06:38:17.026	2024-09-09 19:01:28.006	6	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	51	\N	\N	\N
68	2024-08-22 08:48:26.954	2024-09-09 19:01:28.007	4	b85616d5-c7c6-4664-a5bd-47eac49187ac	84	\N	\N	\N
69	2024-09-08 07:20:24.116	2024-09-09 19:01:28.007	6	c11ac4e7-04d8-4ea0-b730-7d039f455024	100	\N	\N	\N
70	2024-08-23 12:48:00.746	2024-09-09 19:01:28.008	8	b85616d5-c7c6-4664-a5bd-47eac49187ac	18	\N	\N	\N
71	2024-08-26 01:02:21.841	2024-09-09 19:01:28.008	9	9867e73a-0667-44f4-8161-3eb7beeb5db5	91	\N	\N	\N
72	2024-08-13 03:39:50.306	2024-09-09 19:01:28.008	7	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	21	\N	\N	\N
73	2024-08-18 07:23:55.191	2024-09-09 19:01:28.009	3	c11ac4e7-04d8-4ea0-b730-7d039f455024	16	\N	\N	\N
74	2024-08-19 10:13:24.027	2024-09-09 19:01:28.009	6	9867e73a-0667-44f4-8161-3eb7beeb5db5	15	\N	\N	\N
75	2024-09-04 09:17:13.287	2024-09-09 19:01:28.01	7	b85616d5-c7c6-4664-a5bd-47eac49187ac	25	\N	\N	\N
76	2024-08-16 19:01:50.205	2024-09-09 19:01:28.01	8	c638e1c8-fc25-4793-8333-5ed28270b64d	27	\N	\N	\N
77	2024-09-02 09:28:26.462	2024-09-09 19:01:28.011	2	29d31d0f-d3a6-47a7-bd52-f28e938822c7	43	\N	\N	\N
78	2024-08-27 04:31:06.78	2024-09-09 19:01:28.011	5	0f215f28-1af6-469e-b002-5f1e7fdc29f2	94	\N	\N	\N
79	2024-09-02 02:23:56.647	2024-09-09 19:01:28.012	9	9867e73a-0667-44f4-8161-3eb7beeb5db5	23	\N	\N	\N
80	2024-09-05 10:38:20.934	2024-09-09 19:01:28.012	3	7d34113a-d9db-40db-a2ca-53c92332a437	50	\N	\N	\N
81	2024-08-21 15:40:47.655	2024-09-09 19:01:28.012	5	9867e73a-0667-44f4-8161-3eb7beeb5db5	38	\N	\N	\N
82	2024-08-31 21:43:31.534	2024-09-09 19:01:28.013	10	74d51113-4a0e-4e3a-812d-005371d14aa4	98	\N	\N	\N
83	2024-08-13 04:20:36.356	2024-09-09 19:01:28.013	1	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	55	\N	\N	\N
84	2024-09-01 11:49:17.451	2024-09-09 19:01:28.014	8	b85616d5-c7c6-4664-a5bd-47eac49187ac	75	\N	\N	\N
85	2024-08-19 03:20:15.635	2024-09-09 19:01:28.014	1	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	88	\N	\N	\N
86	2024-09-07 11:33:38.515	2024-09-09 19:01:28.015	6	0f215f28-1af6-469e-b002-5f1e7fdc29f2	96	\N	\N	\N
87	2024-09-02 14:48:13.412	2024-09-09 19:01:28.016	1	0f215f28-1af6-469e-b002-5f1e7fdc29f2	83	\N	\N	\N
88	2024-09-06 15:03:39.713	2024-09-09 19:01:28.016	6	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	22	\N	\N	\N
89	2024-09-05 00:23:22.048	2024-09-09 19:01:28.016	10	c638e1c8-fc25-4793-8333-5ed28270b64d	64	\N	\N	\N
90	2024-08-19 22:14:52.457	2024-09-09 19:01:28.017	8	b85616d5-c7c6-4664-a5bd-47eac49187ac	38	\N	\N	\N
91	2024-09-06 05:28:52.117	2024-09-09 19:01:28.017	8	74d51113-4a0e-4e3a-812d-005371d14aa4	49	\N	\N	\N
92	2024-09-04 15:12:18.495	2024-09-09 19:01:28.017	8	29d31d0f-d3a6-47a7-bd52-f28e938822c7	22	\N	\N	\N
93	2024-08-25 07:34:04.464	2024-09-09 19:01:28.018	1	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	85	\N	\N	\N
94	2024-08-15 18:26:35.007	2024-09-09 19:01:28.018	3	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	50	\N	\N	\N
95	2024-08-14 23:34:06.146	2024-09-09 19:01:28.019	9	c638e1c8-fc25-4793-8333-5ed28270b64d	94	\N	\N	\N
96	2024-08-13 21:47:36.435	2024-09-09 19:01:28.019	7	c638e1c8-fc25-4793-8333-5ed28270b64d	60	\N	\N	\N
97	2024-08-24 04:33:20.629	2024-09-09 19:01:28.02	10	7d34113a-d9db-40db-a2ca-53c92332a437	34	\N	\N	\N
98	2024-09-04 17:12:54.6	2024-09-09 19:01:28.02	4	29d31d0f-d3a6-47a7-bd52-f28e938822c7	98	\N	\N	\N
99	2024-08-14 11:57:22.709	2024-09-09 19:01:28.021	3	c11ac4e7-04d8-4ea0-b730-7d039f455024	74	\N	\N	\N
100	2024-08-14 07:01:21.691	2024-09-09 19:01:28.021	10	0f215f28-1af6-469e-b002-5f1e7fdc29f2	42	\N	\N	\N
101	2024-08-14 07:48:03.24	2024-09-09 19:01:28.022	9	0f215f28-1af6-469e-b002-5f1e7fdc29f2	24	\N	\N	\N
102	2024-08-16 18:53:14.67	2024-09-09 19:01:28.022	5	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	78	\N	\N	\N
103	2024-08-27 11:50:38.135	2024-09-09 19:01:28.022	3	9867e73a-0667-44f4-8161-3eb7beeb5db5	54	\N	\N	\N
104	2024-08-15 00:08:42.734	2024-09-09 19:01:28.023	3	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	80	\N	\N	\N
105	2024-09-05 22:12:37.543	2024-09-09 19:01:28.023	7	29d31d0f-d3a6-47a7-bd52-f28e938822c7	95	\N	\N	\N
106	2024-09-03 05:20:37.141	2024-09-09 19:01:28.024	5	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	26	\N	\N	\N
107	2024-08-30 20:07:40.863	2024-09-09 19:01:28.024	5	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	22	\N	\N	\N
108	2024-08-16 23:41:27.193	2024-09-09 19:01:28.024	3	74d51113-4a0e-4e3a-812d-005371d14aa4	95	\N	\N	\N
109	2024-08-15 21:33:07.234	2024-09-09 19:01:28.025	8	c638e1c8-fc25-4793-8333-5ed28270b64d	93	\N	\N	\N
110	2024-09-03 04:57:07.997	2024-09-09 19:01:28.025	4	c11ac4e7-04d8-4ea0-b730-7d039f455024	79	\N	\N	\N
111	2024-08-30 23:29:19.434	2024-09-09 19:01:28.025	5	9867e73a-0667-44f4-8161-3eb7beeb5db5	45	\N	\N	\N
112	2024-08-14 19:40:13.679	2024-09-09 19:01:28.026	5	7d34113a-d9db-40db-a2ca-53c92332a437	40	\N	\N	\N
113	2024-08-26 23:55:34.018	2024-09-09 19:01:28.026	6	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	31	\N	\N	\N
114	2024-08-29 03:32:34.443	2024-09-09 19:01:28.027	3	9867e73a-0667-44f4-8161-3eb7beeb5db5	65	\N	\N	\N
115	2024-08-27 13:52:47.155	2024-09-09 19:01:28.027	6	0f215f28-1af6-469e-b002-5f1e7fdc29f2	56	\N	\N	\N
116	2024-09-01 15:53:30.213	2024-09-09 19:01:28.028	9	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	88	\N	\N	\N
117	2024-08-29 21:00:49.355	2024-09-09 19:01:28.028	3	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	83	\N	\N	\N
118	2024-08-18 22:22:19.13	2024-09-09 19:01:28.028	4	c638e1c8-fc25-4793-8333-5ed28270b64d	35	\N	\N	\N
119	2024-08-27 05:18:30.023	2024-09-09 19:01:28.029	5	74d51113-4a0e-4e3a-812d-005371d14aa4	20	\N	\N	\N
120	2024-09-05 22:24:42.015	2024-09-09 19:01:28.029	2	29d31d0f-d3a6-47a7-bd52-f28e938822c7	80	\N	\N	\N
121	2024-09-01 21:27:24.972	2024-09-09 19:01:28.029	3	c638e1c8-fc25-4793-8333-5ed28270b64d	35	\N	\N	\N
122	2024-09-01 02:41:46.517	2024-09-09 19:01:28.03	1	c638e1c8-fc25-4793-8333-5ed28270b64d	32	\N	\N	\N
123	2024-08-26 00:15:48.558	2024-09-09 19:01:28.03	2	0f215f28-1af6-469e-b002-5f1e7fdc29f2	50	\N	\N	\N
124	2024-09-05 18:44:00.777	2024-09-09 19:01:28.031	8	29d31d0f-d3a6-47a7-bd52-f28e938822c7	80	\N	\N	\N
125	2024-08-18 10:35:17.762	2024-09-09 19:01:28.031	5	7d34113a-d9db-40db-a2ca-53c92332a437	90	\N	\N	\N
126	2024-08-20 02:41:40.528	2024-09-09 19:01:28.031	3	b85616d5-c7c6-4664-a5bd-47eac49187ac	34	\N	\N	\N
127	2024-08-20 12:48:51.488	2024-09-09 19:01:28.032	7	c638e1c8-fc25-4793-8333-5ed28270b64d	82	\N	\N	\N
128	2024-09-04 06:31:47.028	2024-09-09 19:01:28.032	5	c638e1c8-fc25-4793-8333-5ed28270b64d	48	\N	\N	\N
129	2024-08-16 21:55:32.137	2024-09-09 19:01:28.033	8	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	51	\N	\N	\N
130	2024-08-21 01:43:56.457	2024-09-09 19:01:28.033	7	c638e1c8-fc25-4793-8333-5ed28270b64d	61	\N	\N	\N
131	2024-08-20 11:03:53.458	2024-09-09 19:01:28.033	6	b85616d5-c7c6-4664-a5bd-47eac49187ac	17	\N	\N	\N
132	2024-08-31 14:11:00.02	2024-09-09 19:01:28.034	8	29d31d0f-d3a6-47a7-bd52-f28e938822c7	80	\N	\N	\N
133	2024-08-29 19:32:58.203	2024-09-09 19:01:28.034	5	9867e73a-0667-44f4-8161-3eb7beeb5db5	67	\N	\N	\N
134	2024-09-06 17:11:26.531	2024-09-09 19:01:28.035	5	29d31d0f-d3a6-47a7-bd52-f28e938822c7	100	\N	\N	\N
135	2024-08-30 05:01:29.79	2024-09-09 19:01:28.035	6	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	69	\N	\N	\N
136	2024-08-15 04:34:30.819	2024-09-09 19:01:28.035	7	74d51113-4a0e-4e3a-812d-005371d14aa4	97	\N	\N	\N
137	2024-08-18 17:48:45.78	2024-09-09 19:01:28.036	3	c638e1c8-fc25-4793-8333-5ed28270b64d	71	\N	\N	\N
138	2024-08-13 07:32:43.818	2024-09-09 19:01:28.036	3	c638e1c8-fc25-4793-8333-5ed28270b64d	70	\N	\N	\N
139	2024-08-16 09:52:10.16	2024-09-09 19:01:28.037	8	9867e73a-0667-44f4-8161-3eb7beeb5db5	91	\N	\N	\N
140	2024-08-13 23:25:31.156	2024-09-09 19:01:28.037	1	29d31d0f-d3a6-47a7-bd52-f28e938822c7	17	\N	\N	\N
141	2024-09-08 02:10:54.981	2024-09-09 19:01:28.037	1	74d51113-4a0e-4e3a-812d-005371d14aa4	39	\N	\N	\N
142	2024-09-08 05:23:32.538	2024-09-09 19:01:28.038	8	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	85	\N	\N	\N
143	2024-09-05 20:26:04.085	2024-09-09 19:01:28.038	10	b85616d5-c7c6-4664-a5bd-47eac49187ac	87	\N	\N	\N
144	2024-08-15 10:27:22.04	2024-09-09 19:01:28.039	2	74d51113-4a0e-4e3a-812d-005371d14aa4	28	\N	\N	\N
145	2024-08-30 12:08:05.246	2024-09-09 19:01:28.039	9	c638e1c8-fc25-4793-8333-5ed28270b64d	47	\N	\N	\N
146	2024-08-14 14:01:22.492	2024-09-09 19:01:28.04	1	c638e1c8-fc25-4793-8333-5ed28270b64d	36	\N	\N	\N
147	2024-08-30 04:50:08.658	2024-09-09 19:01:28.04	8	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	45	\N	\N	\N
148	2024-08-13 06:30:24.392	2024-09-09 19:01:28.041	7	c11ac4e7-04d8-4ea0-b730-7d039f455024	45	\N	\N	\N
149	2024-08-13 10:02:59.535	2024-09-09 19:01:28.041	10	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	53	\N	\N	\N
150	2024-08-26 11:54:32.594	2024-09-09 19:01:28.041	1	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	22	\N	\N	\N
151	2024-08-29 19:33:11.958	2024-09-09 19:01:28.042	7	9867e73a-0667-44f4-8161-3eb7beeb5db5	65	\N	\N	\N
152	2024-08-29 23:05:37.843	2024-09-09 19:01:28.042	7	c638e1c8-fc25-4793-8333-5ed28270b64d	50	\N	\N	\N
153	2024-08-24 10:08:36.989	2024-09-09 19:01:28.043	8	0f215f28-1af6-469e-b002-5f1e7fdc29f2	19	\N	\N	\N
154	2024-09-01 01:10:18.442	2024-09-09 19:01:28.043	4	9867e73a-0667-44f4-8161-3eb7beeb5db5	25	\N	\N	\N
155	2024-08-14 05:02:22.988	2024-09-09 19:01:28.044	10	9867e73a-0667-44f4-8161-3eb7beeb5db5	28	\N	\N	\N
156	2024-09-07 23:24:45.891	2024-09-09 19:01:28.044	2	74d51113-4a0e-4e3a-812d-005371d14aa4	46	\N	\N	\N
157	2024-08-15 19:03:52.91	2024-09-09 19:01:28.045	7	9867e73a-0667-44f4-8161-3eb7beeb5db5	58	\N	\N	\N
158	2024-08-27 18:43:33.258	2024-09-09 19:01:28.046	8	9867e73a-0667-44f4-8161-3eb7beeb5db5	35	\N	\N	\N
159	2024-09-01 19:11:52.01	2024-09-09 19:01:28.046	3	0f215f28-1af6-469e-b002-5f1e7fdc29f2	36	\N	\N	\N
160	2024-08-14 06:54:20.944	2024-09-09 19:01:28.046	7	74d51113-4a0e-4e3a-812d-005371d14aa4	90	\N	\N	\N
161	2024-09-03 13:58:32.012	2024-09-09 19:01:28.047	1	c11ac4e7-04d8-4ea0-b730-7d039f455024	38	\N	\N	\N
162	2024-08-18 10:14:59.059	2024-09-09 19:01:28.049	5	c638e1c8-fc25-4793-8333-5ed28270b64d	96	\N	\N	\N
163	2024-08-27 20:37:24.802	2024-09-09 19:01:28.05	1	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	79	\N	\N	\N
164	2024-08-16 20:52:01.626	2024-09-09 19:01:28.05	2	c638e1c8-fc25-4793-8333-5ed28270b64d	75	\N	\N	\N
165	2024-08-22 09:56:37.507	2024-09-09 19:01:28.05	2	0f215f28-1af6-469e-b002-5f1e7fdc29f2	18	\N	\N	\N
166	2024-08-31 22:43:36.695	2024-09-09 19:01:28.051	2	b85616d5-c7c6-4664-a5bd-47eac49187ac	38	\N	\N	\N
167	2024-08-29 23:03:59.266	2024-09-09 19:01:28.051	1	9867e73a-0667-44f4-8161-3eb7beeb5db5	20	\N	\N	\N
168	2024-08-30 22:54:27.617	2024-09-09 19:01:28.052	2	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	21	\N	\N	\N
169	2024-08-24 15:14:22.27	2024-09-09 19:01:28.052	9	c11ac4e7-04d8-4ea0-b730-7d039f455024	22	\N	\N	\N
170	2024-09-02 17:39:31.069	2024-09-09 19:01:28.053	5	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	95	\N	\N	\N
171	2024-09-06 09:53:16.718	2024-09-09 19:01:28.053	2	9867e73a-0667-44f4-8161-3eb7beeb5db5	69	\N	\N	\N
172	2024-09-07 14:55:31.676	2024-09-09 19:01:28.053	1	7d34113a-d9db-40db-a2ca-53c92332a437	60	\N	\N	\N
173	2024-08-24 00:05:03.818	2024-09-09 19:01:28.054	9	c11ac4e7-04d8-4ea0-b730-7d039f455024	55	\N	\N	\N
174	2024-09-03 16:54:29.042	2024-09-09 19:01:28.055	1	74d51113-4a0e-4e3a-812d-005371d14aa4	22	\N	\N	\N
175	2024-08-29 18:26:25.307	2024-09-09 19:01:28.056	8	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	47	\N	\N	\N
176	2024-08-16 19:45:08.011	2024-09-09 19:01:28.056	4	74d51113-4a0e-4e3a-812d-005371d14aa4	27	\N	\N	\N
177	2024-08-13 21:06:11.341	2024-09-09 19:01:28.057	2	74d51113-4a0e-4e3a-812d-005371d14aa4	77	\N	\N	\N
178	2024-08-31 16:44:49.829	2024-09-09 19:01:28.057	10	9867e73a-0667-44f4-8161-3eb7beeb5db5	78	\N	\N	\N
179	2024-09-09 00:56:46.673	2024-09-09 19:01:28.057	7	7d34113a-d9db-40db-a2ca-53c92332a437	76	\N	\N	\N
180	2024-08-14 18:52:39.084	2024-09-09 19:01:28.058	1	7d34113a-d9db-40db-a2ca-53c92332a437	63	\N	\N	\N
181	2024-08-24 20:55:27.457	2024-09-09 19:01:28.058	1	c11ac4e7-04d8-4ea0-b730-7d039f455024	43	\N	\N	\N
182	2024-08-17 17:39:37.836	2024-09-09 19:01:28.058	3	74d51113-4a0e-4e3a-812d-005371d14aa4	26	\N	\N	\N
183	2024-09-01 09:14:47.062	2024-09-09 19:01:28.059	6	0f215f28-1af6-469e-b002-5f1e7fdc29f2	42	\N	\N	\N
184	2024-08-18 02:28:05.023	2024-09-09 19:01:28.059	9	c11ac4e7-04d8-4ea0-b730-7d039f455024	83	\N	\N	\N
185	2024-08-13 16:11:02.98	2024-09-09 19:01:28.06	5	c638e1c8-fc25-4793-8333-5ed28270b64d	34	\N	\N	\N
186	2024-08-17 16:19:38.836	2024-09-09 19:01:28.062	5	b85616d5-c7c6-4664-a5bd-47eac49187ac	52	\N	\N	\N
187	2024-09-08 19:29:26.892	2024-09-09 19:01:28.066	9	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	60	\N	\N	\N
188	2024-08-23 00:39:18.583	2024-09-09 19:01:28.066	2	0f215f28-1af6-469e-b002-5f1e7fdc29f2	88	\N	\N	\N
189	2024-08-17 12:05:50.5	2024-09-09 19:01:28.066	8	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	58	\N	\N	\N
190	2024-08-23 18:40:34.73	2024-09-09 19:01:28.067	10	74d51113-4a0e-4e3a-812d-005371d14aa4	60	\N	\N	\N
191	2024-08-19 02:28:52.592	2024-09-09 19:01:28.068	5	0f215f28-1af6-469e-b002-5f1e7fdc29f2	79	\N	\N	\N
192	2024-09-01 08:36:00.987	2024-09-09 19:01:28.068	5	29d31d0f-d3a6-47a7-bd52-f28e938822c7	74	\N	\N	\N
193	2024-09-01 03:42:48.638	2024-09-09 19:01:28.068	7	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	18	\N	\N	\N
194	2024-08-18 11:54:43.194	2024-09-09 19:01:28.069	2	9867e73a-0667-44f4-8161-3eb7beeb5db5	51	\N	\N	\N
195	2024-08-25 11:35:54.462	2024-09-09 19:01:28.069	10	f9fdd5f4-a012-4ab4-8eb4-a6beaaaad35d	56	\N	\N	\N
196	2024-09-02 02:29:33.627	2024-09-09 19:01:28.069	2	c638e1c8-fc25-4793-8333-5ed28270b64d	83	\N	\N	\N
197	2024-08-22 10:53:58.818	2024-09-09 19:01:28.07	4	74d51113-4a0e-4e3a-812d-005371d14aa4	61	\N	\N	\N
198	2024-08-16 02:21:24.141	2024-09-09 19:01:28.07	8	c11ac4e7-04d8-4ea0-b730-7d039f455024	89	\N	\N	\N
199	2024-08-15 10:04:01.44	2024-09-09 19:01:28.07	6	69df3950-5f5f-4c7a-abc2-87f855e1cf3e	71	\N	\N	\N
200	2024-08-19 13:42:52.931	2024-09-09 19:01:28.071	10	c638e1c8-fc25-4793-8333-5ed28270b64d	88	\N	\N	\N
1253	2025-01-17 20:38:42.287	2025-01-17 20:38:42.287	1	0000000000000	10	\N	Birdie56	1252
1252	2025-01-17 20:38:42.287	2025-01-17 20:38:42.287	5	7330053036200	0	Joan_Murphy4	\N	1253
1255	2025-01-17 20:43:48.887	2025-01-17 20:43:48.887	2	0000000000000	10	\N	Tyrese43	1254
1254	2025-01-17 20:43:48.887	2025-01-17 20:43:48.887	8	7330053036200	0	Lillian.Hammes9	\N	1255
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, "firstName", "lastName", email, "createdAt", "updatedAt", role, debt, avatar) FROM stdin;
3	Clotilde.Ullrich28	Gregg	Quitzon	Nels_Swift31@yahoo.com	2024-09-09 19:01:27.962	2024-09-09 19:01:27.962	PRCHEF	0	/default-avatar.png
4	Carolyne.Moen81	Ransom	Braun	Lois_Mertz@hotmail.com	2024-09-09 19:01:27.963	2024-09-09 19:01:27.963	MUSIKCHEF	0	/default-avatar.png
5	Birdie56	Alena	Roob	Jalon49@yahoo.com	2024-09-09 19:01:27.964	2024-09-09 19:01:27.964	GARDVAR	0	/default-avatar.png
7	Reyes.Weber	Sheldon	Roob	Garnett.Pfeffer89@hotmail.com	2024-09-09 19:01:27.966	2024-09-09 19:01:27.966	ANNONSCHEF	0	/default-avatar.png
8	Tyrese43	Catalina	Bartoletti	George78@hotmail.com	2024-09-09 19:01:27.966	2024-09-09 19:01:27.966	PROGRAMCHEF	0	/default-avatar.png
9	Liza.Mills	Mathias	Langworth	Alia_Cruickshank41@yahoo.com	2024-09-09 19:01:27.967	2024-09-09 19:01:27.967	OLCHEF	0	/default-avatar.png
10	Toney_Lubowitz78	Francisca	Labadie	Art.Schaefer@hotmail.com	2024-09-09 19:01:27.967	2024-09-09 19:01:27.967	PRCHEF	0	/default-avatar.png
6	Ansel48	Lisandro	Runte	Gillian31@gmail.com	2024-09-09 19:01:27.964	2025-01-17 20:26:27.634	BILCHEF	0	/default-avatar.png
1	Joan_Murphy4	Efrain	Spinka	Pink_Huel@gmail.com	2024-09-09 19:01:27.96	2025-01-17 20:38:42.287	ANNONSCHEF	10	/default-avatar.png
2	Lillian.Hammes9	Lacy	Moore	Zack79@gmail.com	2024-09-09 19:01:27.962	2025-01-17 20:55:59.112	ORDFORANDE	10	/default-avatar.png
\.


--
-- Name: Account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Account_id_seq"', 2, true);


--
-- Name: DebtCollect_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DebtCollect_id_seq"', 2, true);


--
-- Name: Item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Item_id_seq"', 38, true);


--
-- Name: Swish_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Swish_id_seq"', 4, true);


--
-- Name: Text_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Text_id_seq"', 1, true);


--
-- Name: Transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Transaction_id_seq"', 1255, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 23, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: DebtCollect DebtCollect_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DebtCollect"
    ADD CONSTRAINT "DebtCollect_pkey" PRIMARY KEY (id);


--
-- Name: Item Item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY (id);


--
-- Name: Swish Swish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Swish"
    ADD CONSTRAINT "Swish_pkey" PRIMARY KEY (id);


--
-- Name: Text Text_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Text"
    ADD CONSTRAINT "Text_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Account_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_username_key" ON public."Account" USING btree (username);


--
-- Name: Item_barcode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Item_barcode_key" ON public."Item" USING btree (barcode);


--
-- Name: Swish_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Swish_name_key" ON public."Swish" USING btree (name);


--
-- Name: Text_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Text_name_key" ON public."Text" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Transaction Transaction_barcode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_barcode_fkey" FOREIGN KEY (barcode) REFERENCES public."Item"(barcode) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_beeredTransaction_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_beeredTransaction_fkey" FOREIGN KEY ("beeredTransaction") REFERENCES public."Transaction"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO postgres;


--
-- PostgreSQL database dump complete
--

