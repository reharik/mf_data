

-- DROP SCHEMA public;

GRANT ALL ON SCHEMA public TO methodfitness;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public
  IS 'standard public schema';

-- Table: "lastProcessedPosition"


CREATE TABLE "lastProcessedPosition"
(
  id uuid NOT NULL,
  "commitPosition" bigint,
  "preparePosition" bigint,
  "handlerType" text UNIQUE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "lastProcessedPosition"
  OWNER TO methodfitness;

-- Table: states


CREATE TABLE states
(
  id uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE states
  OWNER TO methodfitness;

-- Table: trainer

CREATE TABLE trainer
(
  id uuid NOT NULL,
  archived boolean DEFAULT false,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE trainer
  OWNER TO methodfitness;

-- Table: client


CREATE TABLE client
(
  id uuid NOT NULL,
  archived boolean DEFAULT false,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE client
  OWNER TO methodfitness;

-- Table: "trainerLoggedIn"


CREATE TABLE "trainerLoggedIn"
(
  id uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "trainerLoggedIn"
  OWNER TO methodfitness;

-- Table: "trainerSummary"


CREATE TABLE "trainerSummary"
(
  id uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "trainerSummary"
  OWNER TO methodfitness;

-- Table: "user"


CREATE TABLE "user"
(
  id uuid NOT NULL,
  archived boolean DEFAULT false,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "user"
  OWNER TO methodfitness;

-- Table: "appointment"


CREATE TABLE "appointment"
(
  id uuid NOT NULL,
  trainer uuid NOT NULL,
  date date NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "appointment"
  OWNER TO methodfitness;
