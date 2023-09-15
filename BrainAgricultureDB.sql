--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-09-15 12:41:09

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
-- TOC entry 842 (class 1247 OID 24587)
-- Name: cultura; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.cultura AS ENUM (
    'Soja',
    'Milho',
    'Algodão',
    'Café',
    'Cana de Açúcar'
);


ALTER TYPE public.cultura OWNER TO postgres;

--
-- TOC entry 851 (class 1247 OID 24710)
-- Name: estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado AS ENUM (
    'Acre',
    'Alagoas',
    'Amapá',
    'Amazonas',
    'Bahia',
    'Ceará',
    'Distrito Federal',
    'Espirito Santo',
    'Goiás',
    'Maranhão',
    'Mato Grosso do Sul',
    'Mato Grosso',
    'Minas Gerais',
    'Pará',
    'Paraíba',
    'Paraná',
    'Pernambuco',
    'Piauí',
    'Rio de Janeiro',
    'Rio Grande do Norte',
    'Rio Grande do Sul',
    'Rondônia',
    'Roraima',
    'Santa Catarina',
    'São Paulo',
    'Sergipe',
    'Tocantins'
);


ALTER TYPE public.estado OWNER TO postgres;

--
-- TOC entry 845 (class 1247 OID 24599)
-- Name: localizacao; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.localizacao AS (
	cidade text,
	estado public.estado
);


ALTER TYPE public.localizacao OWNER TO postgres;

--
-- TOC entry 218 (class 1255 OID 24795)
-- Name: cadastrar_produtor(text, text, text, double precision, double precision, double precision, text[], text, public.estado); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cadastrar_produtor(p_id_prod text, p_nome_prod text, p_nome_fazenda text, p_area_total double precision, p_area_agricultavel double precision, p_area_vegetacao double precision, p_culturas text[], p_cidade text, p_estado public.estado) RETURNS void
    LANGUAGE sql
    AS $$insert into produtor_rural (cpf_ou_cnpj, nome_produtor, localizacao)
	values (p_id_prod, p_nome_prod, (p_cidade, p_estado));
		   
insert into fazenda(nome_fazenda, area_total, area_agricultavel,
					area_vegetacao, culturas, id_dono)
	values (p_nome_fazenda, p_area_total, p_area_agricultavel,
	        p_area_vegetacao, p_culturas::cultura[], p_id_prod);$$;


ALTER FUNCTION public.cadastrar_produtor(p_id_prod text, p_nome_prod text, p_nome_fazenda text, p_area_total double precision, p_area_agricultavel double precision, p_area_vegetacao double precision, p_culturas text[], p_cidade text, p_estado public.estado) OWNER TO postgres;

--
-- TOC entry 230 (class 1255 OID 24798)
-- Name: editar_produtor(text, text, text, double precision, double precision, double precision, text[], text, public.estado); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.editar_produtor(p_id_prod text, p_nome_prod text, p_nome_fazenda text, p_area_total double precision, p_area_agricultavel double precision, p_area_vegetacao double precision, p_culturas text[], p_cidade text, p_estado public.estado) RETURNS void
    LANGUAGE sql
    AS $$
update produtor_rural
set cpf_ou_cnpj = p_id_prod, nome_produtor = p_nome_prod,
    localizacao = (p_cidade, p_estado)
where cpf_ou_cnpj = p_id_prod;

update fazenda
set nome_fazenda = p_nome_fazenda, id_dono = p_id_prod,
    area_total = p_area_total, area_agricultavel = p_area_agricultavel,
    area_vegetacao = p_area_vegetacao,
    culturas = p_culturas::cultura[]
where id_dono = p_id_prod;
$$;


ALTER FUNCTION public.editar_produtor(p_id_prod text, p_nome_prod text, p_nome_fazenda text, p_area_total double precision, p_area_agricultavel double precision, p_area_vegetacao double precision, p_culturas text[], p_cidade text, p_estado public.estado) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 24694)
-- Name: fazenda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fazenda (
    id_fazenda integer NOT NULL,
    nome_fazenda text NOT NULL,
    area_total double precision NOT NULL,
    area_agricultavel double precision NOT NULL,
    area_vegetacao double precision NOT NULL,
    culturas public.cultura[] NOT NULL,
    id_dono text NOT NULL,
    CONSTRAINT check_area CHECK ((area_total > (area_agricultavel + area_vegetacao)))
);


ALTER TABLE public.fazenda OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24693)
-- Name: fazenda_id_fazenda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.fazenda ALTER COLUMN id_fazenda ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fazenda_id_fazenda_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 24768)
-- Name: produtor_rural; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtor_rural (
    cpf_ou_cnpj text NOT NULL,
    nome_produtor text NOT NULL,
    localizacao public.localizacao NOT NULL
);


ALTER TABLE public.produtor_rural OWNER TO postgres;

--
-- TOC entry 3340 (class 0 OID 24694)
-- Dependencies: 216
-- Data for Name: fazenda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fazenda (id_fazenda, nome_fazenda, area_total, area_agricultavel, area_vegetacao, culturas, id_dono) FROM stdin;
23	Vale dos Coqueiros	534.1	214.4	141	{Café,"Cana de Açúcar",Milho}	79188253066
9	Jaguarana	326.3	134.2	93.4	{Café,Soja}	05857719364
10	Sítio Esmerita	12.3	9.3	2.4	{Algodão,Café,Milho,Soja}	52080234000190
15	Rancho Itajaína	1424.7	1143.87	102.3	{"Cana de Açúcar",Milho}	69467473054
\.


--
-- TOC entry 3341 (class 0 OID 24768)
-- Dependencies: 217
-- Data for Name: produtor_rural; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtor_rural (cpf_ou_cnpj, nome_produtor, localizacao) FROM stdin;
52080234000190	José Figueredo	("Ouro Preto","Minas Gerais")
05857719364	Ana	(Santos,"São Paulo")
69467473054	Geraldo	(Goiânia,Goiás)
79188253066	Walter B	("São Paulo","São Paulo")
\.


--
-- TOC entry 3347 (class 0 OID 0)
-- Dependencies: 215
-- Name: fazenda_id_fazenda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fazenda_id_fazenda_seq', 30, true);


--
-- TOC entry 3191 (class 2606 OID 24700)
-- Name: fazenda fazenda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fazenda
    ADD CONSTRAINT fazenda_pkey PRIMARY KEY (id_fazenda);


--
-- TOC entry 3193 (class 2606 OID 24777)
-- Name: produtor_rural produtor_rural_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtor_rural
    ADD CONSTRAINT produtor_rural_cpf_key UNIQUE (cpf_ou_cnpj);


--
-- TOC entry 3195 (class 2606 OID 24806)
-- Name: produtor_rural produtor_rural_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtor_rural
    ADD CONSTRAINT produtor_rural_pkey PRIMARY KEY (cpf_ou_cnpj);


--
-- TOC entry 3196 (class 2606 OID 24800)
-- Name: fazenda fazenda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fazenda
    ADD CONSTRAINT fazenda_fkey FOREIGN KEY (id_dono) REFERENCES public.produtor_rural(cpf_ou_cnpj) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


-- Completed on 2023-09-15 12:41:09

--
-- PostgreSQL database dump complete
--

