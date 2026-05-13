import type { EdaTheorySection } from "../types";

/** Narrazione teorica per pathKey (allineato a `pages.ts`). */
export const EDA_THEORY: Record<string, EdaTheorySection[]> = {
  "": [
    {
      id: "eda-cosa",
      title: "Cos’è un’architettura event-driven",
      paragraphs: [
        "Un’architettura event-driven (EDA) organizza il sistema attorno al fatto che qualcosa è successo: un ordine è stato piazzato, un pagamento è fallito, un profilo è cambiato. Questi fatti viaggiano come messaggi (eventi) tra processi, spesso attraverso un broker o un bus, invece di incatenare chiamate sincrone ovunque.",
        "Il publisher emette un evento senza sapere chi reagirà; i consumer si iscrivono e applicano la propria logica. Il vantaggio principale è il disaccoppiamento: team diversi possono evolvere servizi in parallelo se il contratto dell’evento resta comprensibile e stabile.",
        "L’EDA non è “solo Kafka”: è prima di tutto un modo di modellare i confini e i flussi. Puoi partire da un bus in-process, da code gestite, da notifiche HTTP, e crescere verso infrastrutture distribuite quando il dominio lo richiede.",
      ],
    },
    {
      id: "eda-quando",
      title: "Quando ha senso (e quando no)",
      paragraphs: [
        "Ha senso quando hai integrazioni multiple sullo stesso fatto di business, team che scalano su servizi diversi, o bisogni di audit e replay. Ha meno senso per un CRUD isolato senza integrazioni: lì l’overhead di code, schema e osservabilità spesso non ripaga.",
        "Ogni scelta di asincronia introduce consistenza eventuale: il dato letto può essere leggermente indietro rispetto all’ultima scrittura. Se il prodotto promette “immediato ovunque”, devi progettare UX e SLO di freschezza con attenzione.",
      ],
    },
    {
      id: "cloudevents-glossario",
      title: "CloudEvents e glossario minimo",
      paragraphs: [
        "In questo modulo usiamo CloudEvents 1.0 come contenitore standard: campi come `specversion`, `type`, `source`, `id`, `time` e `data` rendono gli esempi confrontabili tra pagine e con strumenti reali (Knative, SDK ufficiali, gateway HTTP).",
        "Termini ricorrenti: broker (smista messaggi), topic/coda (canali logici), consumer group (Kafka: stesso gruppo condivide il lavoro per partizione), publisher/subscriber (chi emette / chi riceve), dead letter queue (coda di messaggi falliti), outbox (pattern per pubblicare in modo affidabile insieme alla transazione DB).",
        "Correlation ID e Trace ID servono a ricostruire una storia distribuita nei log: senza di essi, il debugging tra cinque microservizi diventa indovinare.",
      ],
    },
  ],
  "core-concepts": [
    {
      id: "pubsub",
      title: "Publish–Subscribe e fan-out",
      paragraphs: [
        "Nel modello pub/sub il publisher non indirizza i destinatari per nome: pubblica su un canale (topic, routing key, exchange) e il broker consegna a tutti gli subscriber interessati. È fan-out naturale: un solo evento può alimentare fatturazione, analytics, notifiche e cache invalidation.",
        "Nel browser, l’analogo più vicino è spesso SSE o WebSocket verso un gateway che fa da subscriber verso il mondo backend. L’Observer pattern in memoria è pub/sub intra-processo; l’EDA estende lo stesso principio oltre il confine del singolo deploy.",
      ],
    },
    {
      id: "broker",
      title: "Broker, code e disaccoppiamento temporale",
      paragraphs: [
        "Il broker è un componente infrastrutturale che riceve, persiste (a seconda del prodotto) e riconsegna messaggi. Introduce latenza e un nuovo punto di osservabilità, ma rimuove l’accoppiamento temporale: il consumer può essere momentaneamente offline e recuperare messaggi, se il modello di consegna lo consente.",
        "Accoppiamento spaziale: il publisher non conosce l’URL del consumer. Accoppiamento temporale: il publisher non deve attendere che il consumer finisca. Queste libertà si pagano con complessità operativa e con la necessità di contratti chiari sugli eventi.",
      ],
    },
    {
      id: "qos",
      title: "Semantiche di consegna (lettura obbligatoria)",
      paragraphs: [
        "At-most-once: un messaggio può perdersi, non ci sono duplicati. At-least-once: può arrivare più volte; il consumer deve essere idempotente o deduplicare con un ID stabile. Exactly-once end-to-end tra più sistemi è spesso un obiettivo marketing: in pratica si compone exactly-once “per effetto” con transazioni locali, idempotenza e offset commit cauti.",
        "Le garanzie dipendono dal broker, dal protocollo e dal modo in cui fai ack: in RabbitMQ nack/requeue e DLX cambiano il comportamento; in Kafka commit offset e rielaborazione cambiano cosa significa “processato”.",
      ],
    },
  ],
  "design-patterns/event-notification": [
    {
      id: "en-def",
      title: "Event notification: segnale leggero",
      paragraphs: [
        "L’event notification invia un segnale minimale: spesso tipo di cambiamento e identificativi (`orderId`, `customerId`). Il consumer, ricevuto l’evento, decide se e come recuperare lo stato completo tramite API o query dedicata.",
        "Il bus resta snello: meno byte, meno dati sensibili in transito, meno accoppiamento sullo shape del read model. Il prezzo è un round-trip in più verso il servizio di lettura: monitora QPS, cache e rate limit.",
      ],
    },
    {
      id: "en-ux",
      title: "Implicazioni su API e UX",
      paragraphs: [
        "Lato UI, combina prefetch, stale-while-revalidate e stati di caricamento espliciti. Dopo una mutazione, non assumere che la lista sia aggiornata: invalida cache o attendi l’evento di conferma sul canale realtime se ne hai uno.",
        "Mitiga il traffico “chatty”: batch di ID, etag/versioning, GraphQL se centralizzi il fetch. Se ogni notifica genera una tempesta di GET, il collo di bottiglia si sposta sul read path.",
      ],
    },
    {
      id: "en-outbox",
      title: "Affidabilità: transactional outbox",
      paragraphs: [
        "Se scrivi nel database e pubblichi sul broker in due passi separati, puoi avere drift (commit OK, publish fallito). Il pattern transactional outbox scrive l’evento nella stessa transazione del dominio e un relay asincrono lo spinge sul bus: elimina la classe di bug “persi nel mezzo”.",
        "Il relay deve essere idempotente sul verso broker (stesso outbox row non deve duplicare publish): spesso con tracking di `published_at` o offset.",
      ],
    },
  ],
  "design-patterns/event-carried-state-transfer": [
    {
      id: "ecst-def",
      title: "ECST: stato nel messaggio",
      paragraphs: [
        "Event-Carried State Transfer (ECST) significa che il messaggio contiene abbastanza stato (o un delta significativo) perché il consumer aggiorni il proprio modello senza chiamate aggiuntive. È vicino all’idea REST del trasferimento di stato nella risposta, applicata agli eventi.",
        "Utile quando vuoi repliche locali, UI reattive offline-first, o quando il costo del fetch è alto rispetto al costo del payload. Più stato trasporti, più crescono dimensione messaggi, log e superficie di dati sensibili.",
      ],
    },
    {
      id: "ecst-risk",
      title: "PII, conflitti e versionamento",
      paragraphs: [
        "Ogni campo nel bus può finire in log, mirror e backup: classifica PII, maschera, cifra e applica retention. Definisci una strategia per conflitti: se il consumer ha modificato localmente mentre arriva un ECST, serve una regola (last-write-wins, merge, CRDT, o ricarico forzato).",
        "Versiona il tipo CloudEvent o un campo `schemaversion` nel payload quando rompi compatibilità: i consumer devono poter convivere con più versioni durante il rollout.",
      ],
    },
  ],
  "design-patterns/event-sourcing": [
    {
      id: "es-def",
      title: "Stream append-only e proiezione",
      paragraphs: [
        "Event Sourcing memorizza la storia come sequenza immutabile di eventi di dominio. Lo “stato corrente” è una riduzione (fold) degli eventi, eventualmente accelerata da snapshot che catturano un checkpoint.",
        "Ottiene audit naturale, temporal queries e replay per test di regressione sul dominio. Paghi in complessità: migrazioni degli eventi storici, gestione degli schemi, tool di ispezione e training del team.",
      ],
    },
    {
      id: "es-when",
      title: "Quando evitarlo",
      paragraphs: [
        "Se ti basta una tabella con CRUD e un audit log append-only per compliance, spesso spendi meno e vai più veloce. ES ha senso quando il dominio è event-first, servono ricostruzioni storiche affidabili o integrazioni multiple sulla stessa timeline.",
        "Gli snapshot riducono il replay lungo; le funzioni di proiezione vanno versionate con cura quando cambi la semantica di eventi legacy, altrimenti ricostruisci stati sbagliati.",
      ],
    },
    {
      id: "es-concurrency",
      title: "Concurrency control sullo stream",
      paragraphs: [
        "L’append usa spesso `expectedVersion` (o equivalente) per evitare write concorrenti sullo stesso aggregato: se la versione non combacia, rifiuti e chiedi al chiamante di ricaricare e riprovare — è lo stesso spirito dell’optimistic locking sulle righe SQL.",
        "In lettura, separa stream tecnico da eventi di dominio esposti: gli strumenti admin possono mostrare la timeline grezza, mentre i servizi applicano solo ciò che il contratto consente.",
      ],
    },
  ],
  "design-patterns/cqrs": [
    {
      id: "cqrs-def",
      title: "Command Query Responsibility Segregation",
      paragraphs: [
        "CQRS separa il percorso di scrittura (comandi, invarianti forti, transazioni locali sul write model) dal percorso di lettura (query veloci su viste denormalizzate, cache, read model). Gli stessi fatti di dominio possono alimentare il read model in modo asincrono tramite eventi.",
        "Non è obbligatorio avere database diversi: a volte basta uno schema dedicato o viste materializzate. La complessità cresce con il numero di proiezioni, la latenza accettabile e i tool di osservabilità.",
      ],
    },
    {
      id: "cqrs-consistency",
      title: "Consistenza e UX",
      paragraphs: [
        "Dopo un comando, il read model può essere indietro di millisecondi o secondi: documenta SLI/ SLO di freschezza. In UI, mostra pending, conferma ottimistica con rollback guidato dagli eventi, o invalidazioni mirate.",
        "Il write side espone errori di dominio chiari; il read side espone viste pensate per schermate e report, non per esporre direttamente le stesse tabelle transazionali.",
      ],
    },
  ],
  "reliability-tech/messaging-brokers": [
    {
      id: "brokers-intro",
      title: "Perché esistono prodotti diversi",
      paragraphs: [
        "I broker risolvono problemi leggermente diversi. RabbitMQ nasce come broker generalista con routing flessibile (exchange, binding, routing key), code per consumer, TTL, DLX: ottimo per workload operativi e workflow variabili.",
        "Apache Kafka è un log partizionato distribuito: retention lunga, replay, consumer groups, stream processing. Eccelle quando tratti il flusso come sorgente di verità operativa o analytics e quando ordini per chiave dentro la partizione.",
      ],
    },
    {
      id: "brokers-choose",
      title: "Come orientarsi nella scelta",
      paragraphs: [
        "Chiediti: serve ordinamento stretto per chiave? serve replay storico massiccio? quanto è importante il routing complesso verso molte code? quanto è maturo l’operating model (on-call, runbook, monitoring lag)?",
        "Nel browser non esporre mai credenziali del broker: passa da API gateway, SSE o WebSocket autenticati. Il modulo mostra differenze concettuali; in produzione dimensiona partizioni, retention e policy di sicurezza.",
      ],
    },
  ],
  "reliability-tech/reliability": [
    {
      id: "rel-ack",
      title: "Ack, nack, retry e backoff",
      paragraphs: [
        "Un consumer elabora un messaggio e poi conferma (ack) al broker. Se fallisce, può nack con requeue: il messaggio torna in coda. Senza limiti, un messaggio “tossico” blocca il throughput o crea loop infiniti.",
        "Backoff esponenziale con jitter riduce thundering herd. Un massimo di tentativi e una dead letter queue (DLQ) isolano i fallimenti persistenti per analisi umana o reprocessing controllato.",
      ],
    },
    {
      id: "rel-idem",
      title: "Idempotenza e DLQ",
      paragraphs: [
        "Con at-least-once, la stessa logica di business può eseguire due volte: usa idempotency key, vincoli DB unici, o tabella di deduplicazione. In DLQ, annota `failureReason`, contatore retry e correlazione per capire la radice.",
        "Monitora il tasso DLQ come segnale di prodotto: picchi possono indicare deploy rotto, schema incompatibile o dipendenza esterna instabile.",
      ],
    },
  ],
  "reliability-tech/data-storage": [
    {
      id: "storage-es",
      title: "Event store e read model",
      paragraphs: [
        "L’event store tiene la storia immutabile. Il read model (viste, summary, dashboard) è una proiezione derivata, spesso denormalizzata per query veloci. Il worker di proiezione consuma lo stream o una coda di integrazione e aggiorna tabelle o viste materializzate.",
        "Postgres offre viste materializzate e refresh concorrente: utile per reporting se accetti una finestra di freschezza. Valuta indici unici richiesti da `REFRESH MATERIALIZED VIEW CONCURRENTLY` e pianifica finestre di refresh vs carico.",
      ],
    },
    {
      id: "storage-cost",
      title: "Costi e operatività",
      paragraphs: [
        "Eventi + MV duplicano dati: misura crescita, partiziona storico e comprimi archive. Definisci ownership: chi risponde se la MV è stale? come si backfill dopo un bug di proiezione?",
        "Il client tipicamente legge solo il read model già proiettato (`/api/.../summary`), non lo stream grezzo, salvo tool admin o debug controllati.",
      ],
    },
  ],
  "trade-offs": [
    {
      id: "to-dim",
      title: "Dimensioni del trade-off",
      paragraphs: [
        "Decoupling e scalabilità orizzontale sono i benefici più citati. In contropartita paghi complessità di debug, osservabilità, schema governance, costi di storage e consistenza eventuale.",
        "Non esiste risposta universale: valuta maturità del team, numero di integrazioni, requisiti di audit/replay, SLO di freschezza e tolleranza al rischio operativo.",
      ],
    },
    {
      id: "to-practice",
      title: "Pratica consigliata",
      paragraphs: [
        "Allinea product e engineering su cosa significa “quasi real-time” per l’utente. Propaga Correlation ID su ogni hop. Preferisci evoluzioni retrocompatibili degli eventi e piani di deprecazione espliciti.",
        "Usa il palcoscenico e il lab per stimare il tuo contesto: se il punteggio sintetico è basso, inizia semplice (notifiche + outbox) e aggiungi complessità solo quando i sintomi lo richiedono.",
      ],
    },
  ],
  "labs/e-commerce": [
    {
      id: "lab-e-flow",
      title: "Ordine come coreografia",
      paragraphs: [
        "Nel lab semplificato, `order.placed` innesca una catena di eventi senza orchestratore centrale: ogni servizio reagisce e pubblica il passo successivo. È coreografia: meno single point of failure, ma il grafo delle dipendenze va documentato.",
        "Quando servono transazioni distribuite con compensazione esplicita (annulla prelievo se inventario fallisce), valuta saga orchestrata o coreografia con passi di compensazione progettati a tavolino.",
      ],
    },
    {
      id: "lab-e-ui",
      title: "UI e read model",
      paragraphs: [
        "La UI non deve ascoltare ogni micro-evento interno: spesso si sottoscrive a un read model `order_status` denormalizzato che il prodotto espone già pronto per la chip di stato. Riduci rumore e accoppiamento tra schermata e grafo interno.",
      ],
    },
  ],
  "labs/multiplayer": [
    {
      id: "lab-m-net",
      title: "Rete, sequenze e autorità",
      paragraphs: [
        "Nei giochi realtime, gli input sono comandi; il server autoritativo decide lo stato ufficiale. Il client applica predizione locale per la reattività, poi riconcilia quando arriva un frame con `seq` più recente.",
        "EDA su TCP/WebSocket è comune per metagame e lobby; per FPS strettissimi spesso si combinano protocolli dedicati o UDP con perdita. Il principio resta: eventi ordinati, perdita gestita, stato derivabile.",
      ],
    },
    {
      id: "lab-m-debug",
      title: "Debug e replay",
      paragraphs: [
        "Salvare seed, timeline di eventi e snapshot periodici rende riproducibili bug altrimenti elusivi. Il lab mostra una riconciliazione minimale: estendi con buffer di input e smoothing.",
      ],
    },
  ],
};

export function getEdaTheory(pathKey: string): EdaTheorySection[] {
  return EDA_THEORY[pathKey] ?? [];
}
