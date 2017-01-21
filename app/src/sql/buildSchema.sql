

-- DROP SCHEMA public;

GRANT ALL ON SCHEMA public TO methodfitness;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public
  IS 'standard public schema';

-- Table: "lastProcessedPosition"

DROP TABLE IF EXISTS "lastProcessedPosition";

CREATE TABLE "lastProcessedPosition"
(
  id uuid NOT NULL,
  "commitPosition" bigint,
  "preparePosition" bigint,
  "handlerType" text
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "lastProcessedPosition"
  OWNER TO methodfitness;

-- Table: states

DROP TABLE IF EXISTS states;

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

DROP TABLE IF EXISTS trainer;

CREATE TABLE trainer
(
  id uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE trainer
  OWNER TO methodfitness;

-- Table: client

DROP TABLE IF EXISTS client;

CREATE TABLE client
(
  id uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE client
  OWNER TO methodfitness;

-- Table: "trainerLoggedIn"

DROP TABLE IF EXISTS "trainerLoggedIn";

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

DROP TABLE IF EXISTS "trainerSummary";

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

DROP TABLE IF EXISTS "user";

CREATE TABLE "user"
(
  id uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "user"
  OWNER TO methodfitness;

<<<<<<< HEAD
-- Table: trainer

DROP TABLE IF EXISTS appointment;

CREATE TABLE appointment
(
  id uuid NOT NULL,
  date timestamp NOT NULL,
  trainer uuid NOT NULL,
=======
-- Table: "appointment"

DROP TABLE IF EXISTS "appointment";

CREATE TABLE "appointment"
(
  id uuid NOT NULL,
  trainer uuid NOT NULL,
  date date NOT NULL,
>>>>>>> 6eccd8197eeafe30966e573745c156fd5df56b12
  document jsonb
)
WITH (
  OIDS=FALSE
);
<<<<<<< HEAD
ALTER TABLE trainer
  OWNER TO methodfitness;

=======
ALTER TABLE "appointment"
  OWNER TO methodfitness;
>>>>>>> 6eccd8197eeafe30966e573745c156fd5df56b12
