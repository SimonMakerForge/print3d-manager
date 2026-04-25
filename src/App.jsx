/**
 * Print3D Manager
 * ---------------
 * Copyright (c) 2025-2026 Simone Soldani (SimonMakerForge)
 * https://github.com/SimonMakerForge/print3d-manager
 *
 * Licenza: uso personale libero — redistribuzione e uso commerciale
 * vietati senza autorizzazione scritta. Attribuzione obbligatoria.
 * La rimozione o alterazione della sezione "Chi sono / About" costituisce
 * violazione della licenza. Vedere LICENSE per i dettagli completi.
 *
 * Donazioni (facoltative ma apprezzate):
 *   ☕ https://buymeacoffee.com/simonmakerforge
 *   💙 https://paypal.me/SimoneSoldani
 *
 * Contatto: ss.soldani@gmail.com
 */
import { useState, useEffect, useRef, useCallback, createContext, useContext, Fragment } from "react";
import { LayoutDashboard,Layers,Package,Printer,FileText,Settings,Plus,Edit2,Trash2,X,Search,AlertTriangle,RefreshCw,ChevronRight,ChevronLeft,Download,Upload,Eye,Minus,Users,Copy,Lock,Calculator,Archive } from "lucide-react";

const APP_VERSION='V2.36';
const DATA_VERSION='11';

/* ══ I18N ══ */
const LangCtx=createContext({t:k=>k,lang:'it',setLang:()=>{},valuta:'€',colorLang:'it'});
const useT=()=>useContext(LangCtx);
/* Hook che restituisce fmtV = fmtE con la valuta del contesto */
const useFmt=()=>{const{valuta}=useContext(LangCtx);return n=>fmtE(n,valuta);};
const mkT=lang=>{
  const T=TRANSLATIONS[lang]||TRANSLATIONS.it;
  return k=>T[k]??TRANSLATIONS.it[k]??k;
};
const TRANSLATIONS={
  it:{
    /* nav */
    nav_dash:'Dashboard',nav_mat:'Materiali',nav_inv:'Inventario Materiali',nav_pr:'Stampanti',
    nav_prints:'Stampe 3D',nav_quotes:'Preventivi / Ricevute',nav_contacts:'Rubrica',nav_set:'Impostazioni',
    /* settings subs */
    sub_azienda:'Dati Azienda',sub_regime:'Regime Fiscale',sub_costi:'Parametri Costo',
    sub_def_mat:'Definizione Materiali',
    sub_servizi:'Servizi Extra',sub_corrieri:'Corrieri',
    sub_pagamenti:'Metodi Pagamento',sub_lang:'Lingua',sub_aspetto:'Aspetto',sub_io:'Export / Import',sub_about:'Chi sono',
    /* statuses - display only, data stored in Italian */
    st_attesa:'In attesa',st_corso:'In corso',st_completata:'Completata',st_fallita:'Fallita',
    st_confermato:'Confermato',st_completato:'Completato',st_annullato:'Annullato',st_annullata:'Annullata',
    /* stock */
    stk_ok:'OK',stk_warn:'Basso',stk_err:'Esaurito',
    /* common */
    add:'Aggiungi',save:'Salva',cancel:'Annulla',edit:'Modifica',del:'Elimina',
    back:'Indietro',all:'Tutti',manage:'Gestisci',search:'Cerca',close:'Chiudi',
    confirm_del:'Conferma eliminazione',irreversible:'Questa azione è irreversibile.',
    del_linked:'I preventivi collegati segnaleranno una variazione alla prossima apertura.',
    notes:'Note',name:'Nome',surname:'Cognome',company:'Azienda',
    address:'Indirizzo',city:'Città',province:'Provincia',zip:'CAP',
    price:'Prezzo',stock:'Stock',format:'Formato',color:'Colore',markup:'Markup',
    type:'Tipo',brand:'Produttore',
    /* dashboard */
    mat_fail_pct:'Fallimento %',mat_fail_hint:'Percentuale costo aggiuntiva per possibili fallimenti di stampa',
    /* dashboard analytics */
    dash_analytics:'Analisi preventivi',dash_period:'Periodo',
    dash_period_day:'Giorno',dash_period_month:'Mese',dash_period_year:'Anno',dash_period_custom:'Personalizzato',
    dash_period_from:'Dal',dash_period_to:'Al',
    dash_no_data:'Nessun dato per il periodo selezionato.',
    dash_kg_consumed:'Materiale consumato (kg)',dash_print_hours:'Ore di stampa',
    dash_print_failures:'Fallimenti stampa',dash_energy_total:'Consumo energetico',dash_energy_unit:'kWh totali',dash_mat_distrib:'Distribuzione materiali',
    dash_quotes_count:'Preventivi completati',dash_avg_value:'Valore medio',
    dash_critical:'Scorte critiche',dash_inv_value:'Valore inventario',
    dash_in_progress:'Stampe in corso',dash_recent_q:'Preventivi recenti',
    dash_all_ok:'Tutte le scorte OK ✓',dash_qty_type:'Quantità per tipo',
    dash_val_type:'Valore per tipo',dash_other:'Altro',
    dash_manage:'Gestisci',dash_all_q:'Tutti',
    /* materials */
    mat_search_ph:'Cerca nome, codice, marca...',mat_none:'Nessun materiale trovato.',
    mat_kg:'Prezzo €/kg',mat_markup_pct:'Markup materiale %',mat_stock_g:'Stock (g)',
    mat_min_g:'Soglia min (g)',mat_code:'Codice produttore',mat_note_ph:'Temp, velocità...',
    mat_new:'Nuovo materiale',mat_edit:'Modifica materiale',
    /* inventory */
    inv_typology:'Tipologia',inv_brand:'Produttore',inv_critical:'critici',
    inv_total_val:'Valore totale inventario',inv_upd:'Agg.',
    inv_sort:'Ordina per',inv_sort_colore:'Colore',inv_sort_tipo:'Tipo',inv_sort_marca:'Marca',inv_sort_stock:'Stock',inv_sort_val:'Quantità',inv_sort_price:'Prezzo',
    inv_view_schede:'Schede',inv_view_stock:'Stock',
    inv_all:'Tutti',inv_filters:'Filtri:',inv_remove_filters:'Rimuovi tutti',
    inv_crit_title:'Scorte critiche',inv_print_crit:'Stampa lista',inv_show_all:'Mostra tutti',
    inv_filter_active:'Filtri attivi',
    /* printers */
    pr_consumption:'Consumo medio',pr_amort:'Ammort.',pr_hourly:'Costo orario',
    pr_none:'Nessuna stampante.',pr_new:'Nuova stampante',pr_edit:'Modifica stampante',
    /* prints */
    print_none:'Nessuna stampa.',print_first:'Registra la prima stampa',
    print_total:'Costo totale',print_in_progress:'in corso',print_project:'Nome progetto',
    print_client:'Cliente',print_printer:'Stampante',print_materials:'Materiali',
    print_hours:'Ore',print_min:'Min',print_labor:'Manodopera',print_status:'Stato',
    print_stock_info:'ℹ️ Stock scalato automaticamente solo al primo passaggio a "Completata".',
    print_reg:'Registra',print_save:'Salva modifiche',print_linked_q:'Preventivo',
    print_new:'Nuova stampa',print_edit:'Modifica stampa',
    /* quotes */
    q_none:'Nessun preventivo.',q_first:'Crea il primo preventivo',
    q_total:'Totale preventivi',q_pending:'In attesa / Confermati',q_done:'Completati',
    q_from_rb:'Seleziona dalla rubrica',q_pick_rb:'— scegli dalla rubrica —',
    q_validity:'Validità (gg)',q_models:'Modelli da stampare',q_add_model:'Aggiungi Modello',
    q_model_name:'Nome Modello',q_model_status:'Stato Modello',
    q_global_notes:'Note Globali Preventivo',q_notes_ph:'Note, tempi, finiture...',
    q_shipping:'Corriere',q_no_shipping:'— Nessun corriere —',q_ship_cost:'Costo spediz. €',
    q_markup_base:'Markup base %',q_markup_extra:'Markup extra %',q_iva:'IVA %',
    q_ritenuta:'Ritenuta 20%',q_ritenuta_only:'Solo per prestazione occasionale',
    q_taxable:'Imponibile',q_gross:'Utile lordo',q_sale:'vendita',q_prod:'Produzione:',
    q_auto_prints:'ℹ️ Verranno create automaticamente le stampe collegate in stato "In attesa" (una per modello).',
    q_import:'Importa preventivo',q_import_none:'Nessun nuovo preventivo.',q_export_single:'Esporta Preventivo',
    q_frozen:'Congelato',q_changed:'dati variati',q_changes_title:'⚠ Variazioni rilevate:',
    q_update:'Aggiorna e ricalcola',q_freeze:'Congela valori',q_dup:'Duplica con nuovi prezzi',
    q_pdf:'PDF',q_receipt:'Ricevuta',q_new:'Nuovo preventivo',q_edit:'Modifica preventivo',
    q_num:'N° Preventivo',q_customer:'Cliente *',q_customer_ph:'Nome cliente',
    q_extra_services:'Servizi extra',
    q_del_title:'Elimina preventivo',
    q_del_has_prints:'Questo preventivo ha stampe collegate. Come vuoi procedere?',
    q_del_unlink:'Scollega stampe',q_del_unlink_hint:'Le stampe rimangono ma perdono il collegamento al preventivo.',
    q_del_also:'Elimina anche le stampe',q_del_also_hint:'Tutte le stampe collegate vengono eliminate.',
    q_import_restored:'preventivo ripristinato',q_import_prints_restored:'stampe ripristinate',
    /* cost box */
    cb_mat:'Mat.',cb_energy:'Energia',cb_amort:'Ammort.',cb_labor:'Man.',
    cb_services:'Servizi',cb_shipping:'Corriere',cb_prod:'Produzione:',cb_tot:'Tot:',
    /* contacts */
    rb_search_ph:'Cerca nome, azienda, email...',rb_none:'Nessun contatto.',
    rb_no_results:'Nessun risultato.',rb_add_first:'Aggiungi il primo cliente',
    rb_fiscal:'Dati fiscali',rb_piva:'Partita IVA',rb_cf:'Codice Fiscale',
    rb_new:'Nuovo contatto',rb_edit:'Modifica contatto',rb_note_ph:'Note aggiuntive...',
    /* settings */
    set_rs:'Ragione sociale',set_logo:'Logo aziendale',set_logo_change:'Cambia',
    set_logo_upload:'Carica logo',
    set_regime_ord:'Regime ordinario',set_regime_forf:'Regime forfettario',set_regime_occ:'Prestazione occasionale',
    set_iva:'IVA (%)',set_ritenuta:'Ritenuta d\'acconto',set_ritenuta_apply:'Applica ritenuta 20%',
    set_ritenuta_only:'Solo per prestazione occasionale',
    set_forf_label:'Dicitura in fattura (Forfettario)',set_occ_label:'Dicitura in ricevuta (Occasionale)',
    set_formula:'Formula costo di produzione',
    set_formula_legend:'Legenda formula:',set_formula_pg:'P_g = Prezzo al grammo del materiale',
    set_formula_wg:'W_g = Peso in grammi del modello',set_formula_mk:'mat_mk% = Markup specifico del materiale',
    set_formula_th:'T_h = Tempo di stampa in ore',set_formula_ekw:'E_kw = Consumo energetico stampante (kW)',
    set_formula_ckwh:'C_kwh = Costo energia (€/kWh)',set_formula_ah:'A_h = Costo ammortamento orario',
    set_formula_mop:'M_op = Costo manodopera',
    set_formula_fail:'fail% = % costo aggiuntiva per possibili fallimenti (per materiale)',
    set_energy:'Costo energia €/kWh',set_labor_def:'Manodopera default',set_markup_def:'Markup globale default %',set_currency:'Valuta',
    set_add_service:'Nome servizio',set_add_corriere:'Nome corriere',
    set_new_type:'Nuovo tipo (es. PLA-HF)...',set_types_note:'I tipi eliminati non vengono rimossi dai materiali già salvati.',
    set_pay_name:'Nome metodo',set_pay_name_ph:'es. Carta di credito',
    set_pay_desc:'Istruzioni',set_pay_desc_ph:'Descrizione e istruzioni...',set_pay_add:'Aggiungi metodo',
    set_exp_all:'Esporta tutto',set_exp_all_d:'Tutti i dati + impostazioni',
    set_reset_title:'Reset completo',set_reset_desc:'Cancella tutti i dati (materiali, stampe, preventivi, impostazioni) e crea una nuova sessione vuota.',
    set_reset_btn:'Reset memoria',set_reset_confirm1:'Sei sicuro? Tutti i dati verranno eliminati.',set_reset_confirm2:'Conferma definitiva: questa azione è irreversibile.',set_reset_done:'Reset completato. Crea un nuovo file di sessione.',
    set_grp_backup:'Backup Completo',
    set_imp_all:'Importa tutto',set_imp_all_d:'Ripristina backup (sovrascrive tutto)',
    set_exp_mat:'Esporta materiali',set_exp_mat_d:'Solo database materiali (JSON)',
    set_imp_mat:'Importa materiali',set_imp_mat_d:'Importa/sostituisci database materiali',
    set_lang_label:"Lingua dell'applicazione",set_lang_it:'Italiano',set_lang_en:'English',
    set_lang_current:'Lingua corrente: Italiano',set_footer:'I dati vengono salvati automaticamente nel browser.',
    set_color_lang_en:'Nomi colori sempre in Inglese',set_color_lang_en_hint:'I nomi colori (White, Black, Red…) rimangono in Inglese anche con lingua Italiano. La ricerca dei colori funzionerà con i nomi Inglesi.',
    /* import report */
    imp_ok:'Importazione completata',imp_unknown:'File non riconosciuto',
    imp_invalid:'File non valido.',imp_err:'Errore',imp_mats_done:'materiali importati.',
    /* stock form */
    stk_set:'Imposta valore',stk_add:'Aggiungi/Sottrai',stk_new:'Nuovo stock (g)',stk_qty:'Quantità (+/-)',stk_upd:'Aggiorna',stk_of:'Stock di',stk_cur:'Nuovo stock',
    /* spools */
    spool_manage:'Gestisci bobine',spool_title:'Gestione Bobine',spool_add:'Aggiungi bobina',
    spool_open:'Aperta',spool_closed:'Chiusa',spool_count:'bobine',spool_new:'Nuova bobina',
    spool_label:'Etichetta (opzionale)',spool_nominal:'Capacità nominale (g)',spool_residuo:'Residuo attuale (g)',
    spool_tipo:'Tipo bobina',spool_tipo_full:'Bobina completa',spool_tipo_refill:'Refill',spool_tipo_sample:'Sample',
    spool_mat:'Materiale contenitore',spool_mat_cartone:'Cartone',spool_mat_plastica:'Plastica',spool_mat_nessuno:'Nessuno (refill)',
    spool_riutilizzabile:'Contenitore riutilizzabile',
    spool_prezzo_acq:'Prezzo acquisto',spool_prezzo_acq_hint:'Prezzo pagato per questa bobina (non al kg)',
    spool_prezzo_kg_calc:'Prezzo equivalente €/kg',
    spool_prezzo_medio:'Prezzo medio calcolato',spool_lotto:'Lotto produttore',spool_data:'Data acquisto',
    spool_open_chk:'Aperta',spool_closed_chk:'Chiusa',spool_esaurita_chk:'Esaurita',
    spool_auto_open:'⟵ aperta automaticamente (residuo parziale)',
    spool_full_free:'Bobina completa: puoi scegliere',
    spool_no_spools:'Nessuna bobina registrata.',spool_detail:'Dettaglio bobina',
    spool_prezzo_medio_hint:'Media pesata su tutte le bobine (attive+esaurite) con prezzo impostato.',
    spool_storico_label:'Storico acquisti (manual override)',
    spool_storico_prezzo:'Prezzo storico medio (€/kg)',spool_storico_qty:'Quantità storica (g)',
    spool_storico_hint:'Contribuisce al prezzo medio anche dopo la cancellazione delle bobine esaurite. Modificabile.',
    spool_complete:'Completa',spool_esaurita:'Esaurita',
    spool_manual_price:'Prezzo manuale materiale (€/kg)',spool_manual_price_hint:'Usato come fallback se nessuna bobina ha prezzo.',
    spool_nominal_custom:'Personalizzata',
    /* sidebar */
    side_mats:'Mat.',side_in_prog:'In stampa..',side_storage:'Spazio locale',
    /* dashboard - magazzino & profitti */
    dash_magazzino:'Magazzino',dash_profits:'Profitto',dash_profit_completed:'da preventivi completati',
    dash_profit_from_comp:'Da completati',dash_profit_from_pend:'Da attesa/confermati',
    dash_profit_pending:'da preventivi confermati',dash_revenue:'Fatturato totale',
    dash_printers_sub:'stampanti',dash_total_sub:'totali',dash_completed_prints:'stampe completate',
    dash_prints_word:'stampe',dash_of_word:'su',dash_from_prints:'da stampe',dash_from_quotes:'da preventivi',
    dash_mem_used:'mem. usata',
    dash_medio:'Medio',dash_margine:'Margine',dash_attivi:'attivi',
    dash_completati_kpi:'Completati',dash_fatturato:'Fatturato',dash_profitto:'Profitto',
    dash_12months:'12 mesi',
    mat_excl_crit:'Escludi da scorte critiche',
    print_search_ph:'Cerca per nome stampa, cliente, progetto, materiale, n° prev...',
    q_search_ph:'Cerca per n° prev., cliente, azienda, progetto, email...',
    /* inventory csv */
    inv_exp_csv:'Esporta CSV',inv_imp_csv:'Importa CSV',inv_csv_desc:'Gestione rapida via foglio elettronico',
    inv_csv_ok:'CSV importato con successo',inv_csv_err:'Errore nel file CSV',
    inv_csv_cols:'Colonne: nome,materiale,tipo_mat,nome_colore,codice,marca,colore,diam,prezzo,markup,stock,soglia,note',
    /* settings */
    set_exp_csv_mat:'Esporta materiali CSV',set_exp_csv_mat_d:'Foglio elettronico (Excel, LibreOffice)',
    set_imp_csv_mat:'Importa materiali CSV',set_imp_csv_mat_d:'Aggiorna stock e prezzi da CSV',
    /* printers new */
    pr_brand:'Produttore',pr_model:'Modello',pr_note_label:'Note tecniche',
    /* prints status flags */
    print_flag_attesa:'In attesa',print_flag_corso:'In corso',
    print_flag_fallite:'Fallite',print_flag_completate:'Completate',
    print_grouped_none:'Stampe senza preventivo',
    /* quotes status flags */
    q_flag_attesa:'In attesa',q_flag_confermati:'Confermati',q_flag_completati:'Completati',
    q_flag_annullati:'Annullati',q_group_no_client:'Senza cliente',
    /* uso interno */
    q_uso_interno:'Uso interno (lavoro aziendale)',
    q_uso_interno_hint:'Nessun markup, corriere o IVA. Traccia costi materiali, energia e ammortamento.',
    q_int_section:'Lavori interni',q_int_badge:'Interno',
    dash_int_costs:'Costi stampe interne',dash_int_label:'da lavori aziendali completati',dash_int_label_count:'lavori interni',
    dash_int_count:'Lavori interni completati',
    /* inventory filter */
    inv_filter_stock:'Filtra scorte minori di (g):',inv_filter_ph:'es. 500',inv_filter_clear:'Tutti',
    /* session & memory */
    sess_title:'Sessione precedente trovata',sess_load:'Carica sessione',
    sess_new:'Inizia da zero',sess_desc:"Vuoi ripristinare i dati dall'ultimo file di sessione salvato?",
    sess_link:'File di sessione',sess_linked:'Collegato',sess_not_linked:'File non collegato',
    sess_pick:'Sel. o Crea File',sess_saving:'Salvataggio...',sess_saved:'Salvato',
    sess_never:'Mai salvato',sess_save_now:'Salva ora',sess_auto:'Salvataggio automatico ogni 5 min',
    sess_pick_open:'Collega file esistente',sess_pick_new:'Crea nuovo file',
    sess_load_q_title:'Dati trovati nel file',
    sess_close:'Chiudi App',sess_close_saving:'Salvataggio...',
    sess_close_ok:'Dati salvati — puoi chiudere la finestra.',
    sess_wait:'Attendere prego...',close_window_btn:'Chiudi finestra',
    del_confirm_text:'Eliminare',
    csv_import_title:'Report importazione CSV',csv_err_rows:'Righe con errori',
    dash_no_mat:'Nessun materiale',dash_no_val:'Nessun valore',
    inv_val_short:'Val.',
    int_cost_label:'Costo aziendale',
    mem_title:'Spazio locale',mem_used:'Usato',mem_free:'Libero',
    mem_warn:'⚠ Spazio quasi esaurito — esporta un backup!',mem_ok:'Spazio disponibile',
    mem_detail:'Dettaglio utilizzo',
    /* pdf */
    pdf_quote:'Preventivo',pdf_receipt:'Ricevuta',pdf_valid:'Valido',
    pdf_client:'Cliente',pdf_costs:'Dettaglio costi',pdf_summary:'Riepilogo',
    pdf_global:'COSTI GLOBALI',pdf_shipping:'Spedizione',
    pdf_prod_total:'Totale costo produzione',
    pdf_prep:'Preparazione Tecnica',pdf_prep_desc:'Setup file e slicing',
    pdf_additive:'Produzione Additiva',pdf_additive_desc:'Stampa 3D e materiali',
    pdf_post:'Post-Processing',
    pdf_row_mat:'Materiale',pdf_row_energy:'Energia',pdf_row_amort:'Ammortamento',pdf_row_labor:'Manodopera',
    pdf_error:'Si è verificato un errore durante la generazione del PDF.',
    pdf_btn_int:'PDF Int.',pdf_btn_cli:'PDF Cli.',pdf_btn_ric_i:'Ric.I',pdf_btn_ric_c:'Ric.C',
    /* ricevute */
    rcpt_title:'Ricevuta',rcpt_go:'Vai alla Ricevuta →',rcpt_draft_detail:'Ricevuta Dettagliata (Bozza)',
    rcpt_draft_synth:'Ricevuta Sintetica (Bozza)',rcpt_detail:'Ricevuta Dettagliata',rcpt_synth:'Ricevuta Sintetica',
    rcpt_paid:'PAGATO',rcpt_paid_hint:'Spunta quando il cliente ha pagato per abilitare l\'emissione della ricevuta',
    rcpt_emit:'Emetti Ricevuta',rcpt_emit_confirm_title:'Conferma emissione ricevuta',
    rcpt_emit_confirm:'Procedendo verrà emessa la ricevuta definitiva. Numero e data verranno bloccati e non potranno essere modificati.',
    rcpt_emit_ok:'Emetti',rcpt_cancel_receipt:'Annulla ricevuta',
    rcpt_cancel_title:'Annullamento ricevuta',rcpt_cancel_reason:'Motivazione annullamento (obbligatoria)',
    rcpt_cancel_ok:'Conferma annullamento',rcpt_cancelled:'ANNULLATA',rcpt_reissue:'Nuova ricevuta (stesso numero)',
    rcpt_num:'N. Ricevuta',rcpt_date:'Data emissione',rcpt_ref:'Rif. Preventivo',
    rcpt_object:'Oggetto prestazione',rcpt_period:'Periodo',rcpt_period_ph:'es. Marzo 2026 oppure 15-18/07/2026',
    rcpt_client_section:'Committente',rcpt_amounts:'Importi',
    rcpt_gross:'Compenso lordo',rcpt_extra_rows:'Voci aggiuntive',rcpt_add_row:'Aggiungi voce',
    rcpt_row_text:'Descrizione',rcpt_row_cost:'Importo (€)',rcpt_withholding:'Ritenuta d\'acconto 20%',
    rcpt_stamp:'Marca da bollo (€2,00)',rcpt_net:'Netto a pagare',rcpt_sign:'Data e Firma',
    rcpt_stamp_note:'Applicare marca da bollo da €2,00',
    rcpt_no_client:'Preventivo senza cliente — impossibile emettere ricevuta.',
    rcpt_internal:'Preventivo interno — la ricevuta non è disponibile.',
    rcpt_ordinary_warn:'In regime ordinario la ricevuta si trasforma in fattura elettronica. La gestione delle fatture elettroniche sarà implementata in una versione futura.',
    rcpt_tab_receipt:'Ricevuta',rcpt_tab_list:'Lista ricevute',
    rcpt_list_year:'Anno',rcpt_list_empty:'Nessuna ricevuta emessa per questo anno.',
    rcpt_list_print:'Stampa lista',rcpt_draft_label:'BOZZA — non valida ai fini fiscali',
    rcpt_export:'Esporta ricevuta',rcpt_import:'Importa ricevuta',rcpt_import_ok:'Ricevuta importata.',rcpt_import_err:'File ricevuta non valido.',rcpt_import_dup:'Ricevuta già presente (stesso numero).',rcpt_import_no_quote:'Preventivo collegato non trovato. Creare prima il preventivo.',
    rcpt_back:'Torna ai preventivi',rcpt_emitted:'Ricevuta emessa il',rcpt_not_emitted:'Non ancora emessa',
    rcpt_cancel_reason_err:'Inserire una motivazione per l\'annullamento.',
    waste_skip:'Salta',waste_scale:'Scala stock',waste_confirm:'Conferma',waste_failed_label:'Fallita',
    waste_intro:'Indica la quantità di materiale già consumata e da scalare dallo stock.',
    waste_checkbox:'Scala materiale consumato dallo stock',
    waste_unknown_mat:'Materiale sconosciuto',
    waste_expected:'Previsto',waste_new_stock:'→ stock',
    pdf_taxable:'Imponibile',pdf_iva:'IVA',pdf_ritenuta:"Ritenuta d'acconto 20%",
    pdf_total:'TOTALE',pdf_notes:'Note',pdf_payment:'Metodi di Pagamento',
    /* quote project & payment */
    q_nome_progetto:'Nome Progetto',q_nome_progetto_ph:'es. Casa delle Bambole',
    q_payment_methods:'Metodi di pagamento accettati',
    /* prints cost detail */
    print_cost_detail:'Dettaglio costi (dal preventivo)',
    /* corrieri servizio */
    set_cr_service:'Tipo servizio',
    /* dashboard trend */
    dash_trend:'Trend Fatturato',
    dash_top_mats:'Top Materiali Utilizzati',
    /* definizione materiali */
    mat_field_material:'Materiale',mat_field_type:'Tipo Materiale',
    mat_field_color_name:'Nome Colore',mat_field_color_none:'nessun colore',
    mat_field_visual_color:'Colore visivo (hex)',mat_full_name:'Nome Completo (Composto)',mat_field_color_custom_ph:'o digita...',
    def_mat_materials:'Materiali base',def_mat_types:'Tipi Materiale',def_mat_colors:'Nomi Colore',
    def_mat_brands:'Produttori',
    def_mat_add_mat:'Nuovo materiale',def_mat_add_type:'Nuovo tipo',def_mat_add_color:'Nuovo colore',
    def_mat_add_brand:'Nuovo produttore',
    def_mat_note:'Le modifiche qui non aggiornano i materiali già esistenti.',
    def_mat_quick:'Filtri Rapidi (Quick Types)',def_mat_quick_hint:'Tipi mostrati come pulsanti rapidi nell\'inventario.',def_mat_quick_add:'Aggiungi tipo...',
    crit_html_material:'Materiale',crit_html_stock:'Stock',crit_html_min:'Minimo',crit_html_status:'Stato',crit_html_value:'Valore',
    crit_html_items:'materiale/i',crit_reordered:'Riordinato',
    crit_st_esaurito:'Esaurito',crit_st_basso:'Scorta bassa',
    no_results:'Nessun risultato.',no_results_for:'Nessun risultato per',
    filter_placeholder:'Filtra...',search_color_ph:'Cerca colore (IT o EN)...',
    inv_csv_hint:'Colonne CSV supportate',
    /* memoria locale */
    mem_used_label:'Usata',mem_free_label:'Libera',mem_limit_label:'Limite stimato',
    mem_used_note:'usati',
    /* sessione */
    sess_link_hint:'Collega un file JSON in una cartella cloud (Google Drive, Dropbox, iCloud) per il salvataggio automatico silenzioso ogni 5 minuti.',
    sess_file_linked:'File Collegato',
    /* corrieri */
    set_cr_carrier_name:'Nome corriere',set_cr_service_ph:'Servizio (es. EXPRESS)',
    /* pagamenti */
    set_pay_instructions:'Istruzioni per il pagamento',set_pay_add_method:'Aggiungi metodo',
    /* modifica generica */
    edit_print_title:'Modifica stampa',edit_quote_title:'Modifica preventivo',
    /* PrintForm */
    print_form_linked_q:'Preventivo',
    print_form_wait_lock:'ℹ️ Stampa in attesa: Dati anagrafici bloccati. (Materiali, tempi e manodopera modificabili)',
    print_rcpt_locked:'🔒 Ricevuta definitiva emessa — la stampa e il preventivo collegati non sono modificabili.',
    print_form_materials:'Materiali',print_form_add_mat:'Materiale',print_form_total_prod:'Totale Produzione',
    /* QuoteForm modello */
    q_model_wait_lock:'ℹ️ Modello In attesa: Il Nome è bloccato. (Materiali, tempi e manodopera sono modificabili)',
    q_model_materials:'Materiali',q_model_extra:'Servizi Extra',
    /* Contacts */
    rb_title:'Rubrica Clienti',
    rb_field_name:'Nome',rb_field_surname:'Cognome',rb_field_company:'Azienda',rb_field_phone:'Telefono',
    /* Company data */
    set_address:'Indirizzo',set_city:'Città',set_province:'Provincia',
    /* Printer form */
    pr_consumption_label:'Consumo (kW)',pr_amort_label:'Ammortamento (€/h)',
    /* Print form extra */
    print_tech_locked:'dettagli tecnici bloccati',
    print_ref_label:'Riferimento Preventivo/Modello',
    print_note_ph:'Impostazioni, problemi...',
    date_label:'Data',
    /* Quick calc */
    quick_calc_title:'Calcolatore Rapido Costi',
    quick_calc_sale:'Prezzo di vendita suggerito',
    waste_consumed_label:'Consumato (g)',
    print_select_hint:'Seleziona una stampa o creane una nuova',
    quote_select_hint:'Seleziona un preventivo per vedere i dettagli',
    /* spool CSV export/import */
    set_exp_csv_dual:'Esporta CSV Materiali + Bobine',set_exp_csv_dual_d:'Genera due file CSV collegati (materiali e bobine)',
    set_imp_csv_dual:'Importa CSV Materiali + Bobine',set_imp_csv_dual_d:'Seleziona entrambi i file CSV insieme (Ctrl/Cmd+click)',
    csv_dual_ok:'Importazione CSV completata',csv_dual_warn_missing:'File bobine non trovato — importati solo i materiali.',
    csv_dual_err_nomat:'File materiali non riconosciuto.',csv_dual_spools_imported:'bobine importate',
    csv_dual_hint:'Tieni premuto Ctrl (o Cmd su Mac) per selezionare entrambi i file contemporaneamente.',
    csv_dual_missing_mat:'⚠ Materiale ID non trovato nel CSV materiali — bobina saltata:',
    /* tema */
    tema_title:'Tema e colori',tema_dark:'Scuri',tema_light:'Chiari',
    tema_custom:'Personalizzato',tema_reset:'Ripristina preset',tema_apply:'Applica',
    tema_bg:'Sfondo',tema_panels:'Pannelli',tema_cards:'Schede',tema_inputs:'Input',
    tema_borders:'Bordi',tema_text1:'Testo',tema_text2:'Testo secondario',tema_text3:'Testo hint',
    tema_accent:'Accento',tema_ok:'Successo',tema_warn:'Avviso',tema_err:'Errore',
    tema_custom_hint:'Clicca su un quadratino per cambiare quel colore.',
    dash_spools_title:'Bobine',dash_spools_active:'Aperte',dash_spools_stock:'In Stock',dash_spools_low:'Quasi esaurite',
    dash_spools_empty:'Esaurite',dash_spools_value:'Valore Stock',dash_spools_value_open:'di cui aperte',dash_spools_value_closed:'di cui chiuse',
    dash_spools_none:'Nessuna bobina registrata.',dash_spools_low_list:'Bobine quasi esaurite',
    dash_spools_reusable:'Contenitori riutilizzabili',dash_spools_go:'Gestisci inventario',
    /* rubrica sort */
    rb_sort:'Ordina per',rb_sort_nome:'Nome',rb_sort_azienda:'Azienda',rb_sort_email:'Email',rb_sort_citta:'Città',
    /* inventory spool filters */
    inv_ft_open:'Bobine aperte',inv_ft_refill:'Refill',inv_ft_spools:'Bobine',inv_ft_no_spools:'Senza Bobine',inv_ft_riord:'Riordinati',
    inv_ft_excl_crit:'Esclusi critici',
    /* settings stock completo */
    set_exp_stock:'Esporta Stock Completo',set_exp_stock_d:'Materiali + bobine in un unico file JSON',
    set_imp_stock:'Importa Stock Completo',set_imp_stock_d:'Ripristina materiali e bobine da file JSON',
    set_grp_json:'Backup Materiali',set_grp_json_d:'Salvataggio completo dati in formato JSON',
    set_grp_csv:'CSV Materiali + Bobine',
    /* inventario stock view */
    inv_stk_agg:'Agg.Tot.Stock',inv_stk_open_card:'Apri scheda',inv_print_list:'Stampa lista',
    /* critici colori bobine */
    crit_html_spools:'Bobine',
    /* auto-generate spools */
    spool_autogen_title:'Genera bobine automaticamente',
    spool_autogen_hint:'Stai assegnando le prime bobine a questo materiale. Vuoi che il programma generi automaticamente le bobine rimanenti per coprire lo stock esistente?',
    spool_autogen_remaining:'Stock non ancora assegnato a bobine',
    spool_autogen_nominal:'Capacità nominale per bobina generata',
    spool_autogen_tipo:'Tipo contenitore',
    spool_autogen_preview:'Bobine che verranno create',
    spool_autogen_full:'complete da',spool_autogen_partial:'parziale da',
    spool_autogen_skip:'No, inserisco manualmente',spool_autogen_go:'Genera bobine',
    spool_stock_gap:'Stock non ancora assegnato',spool_stock_gap_hint:'Grammi di stock del materiale non ancora coperti dalle bobine registrate.',
  },
  en:{
    nav_dash:'Dashboard',nav_mat:'Materials',nav_inv:'Material Inventory',nav_pr:'Printers',
    nav_prints:'3D Prints',nav_quotes:'Quotes / Receipts',nav_contacts:'Contacts',nav_set:'Settings',
    sub_azienda:'Company Data',sub_regime:'Tax Regime',sub_costi:'Cost Parameters',
    sub_def_mat:'Material Definitions',
    sub_servizi:'Extra Services',sub_corrieri:'Shipping',
    sub_pagamenti:'Payment Methods',sub_lang:'Language',sub_aspetto:'Appearance',sub_io:'Export / Import',sub_about:'About',
    st_attesa:'Pending',st_corso:'In Progress',st_completata:'Completed',st_fallita:'Failed',
    st_confermato:'Confirmed',st_completato:'Completed',st_annullato:'Cancelled',st_annullata:'Cancelled',
    stk_ok:'OK',stk_warn:'Low',stk_err:'Out of stock',
    add:'Add',save:'Save',cancel:'Cancel',edit:'Edit',del:'Delete',
    back:'Back',all:'All',manage:'Manage',search:'Search',close:'Close',
    confirm_del:'Confirm deletion',irreversible:'This action cannot be undone.',
    del_linked:'Linked quotes will flag a change warning on next open.',
    notes:'Notes',name:'First name',surname:'Last name',company:'Company',
    address:'Address',city:'City',province:'Province',zip:'ZIP',
    price:'Price',stock:'Stock',format:'Format',color:'Color',markup:'Markup',
    type:'Type',brand:'Brand',
    mat_fail_pct:'Failure %',mat_fail_hint:'Additional cost percentage for possible print failures',
    dash_analytics:'Quote analytics',dash_period:'Period',
    dash_period_day:'Day',dash_period_month:'Month',dash_period_year:'Year',dash_period_custom:'Custom',
    dash_period_from:'From',dash_period_to:'To',
    dash_no_data:'No data for the selected period.',
    dash_kg_consumed:'Material consumed (kg)',dash_print_hours:'Print hours',
    dash_print_failures:'Print failures',dash_energy_total:'Energy consumption',dash_energy_unit:'total kWh',dash_mat_distrib:'Material distribution',
    dash_quotes_count:'Completed quotes',dash_avg_value:'Average value',
    sess_title:'Previous session found',sess_load:'Load session',
    sess_new:'Start fresh',sess_desc:'Do you want to restore data from the last saved session file?',
    sess_link:'Session file',sess_linked:'Linked',sess_not_linked:'No file linked',
    sess_pick:'Select or create file...',sess_saving:'Saving...',sess_saved:'Saved',
    sess_never:'Never saved',sess_save_now:'Save now',sess_auto:'Auto-save every 5 min',
    sess_pick_open:'Link existing file',sess_pick_new:'Create new file',
    sess_load_q_title:'Data found in file',
    sess_close:'Close application',sess_close_saving:'Saving...',
    sess_close_ok:'Data saved — you can close the window.',
    sess_wait:'Please wait...',close_window_btn:'Close window',
    del_confirm_text:'Delete',
    csv_import_title:'CSV Import Report',csv_err_rows:'Rows with errors',
    dash_no_mat:'No materials',dash_no_val:'No value',
    inv_val_short:'Val.',
    int_cost_label:'Internal cost',
    mem_title:'Local storage',mem_used:'Used',mem_free:'Free',
    mem_warn:'⚠ Storage almost full — export a backup!',mem_ok:'Storage available',
    mem_detail:'Usage detail',
    dash_critical:'Critical stocks',dash_inv_value:'Inventory value',
    dash_in_progress:'Prints in progress',dash_recent_q:'Recent quotes',
    dash_all_ok:'All stocks OK ✓',dash_qty_type:'Quantity by type',
    dash_val_type:'Value by type',dash_other:'Other',
    dash_manage:'Manage',dash_all_q:'All',
    mat_search_ph:'Search name, code, brand...',mat_none:'No materials found.',
    mat_kg:'Price €/kg',mat_markup_pct:'Material markup %',mat_stock_g:'Stock (g)',
    mat_min_g:'Min threshold (g)',mat_code:'Manufacturer code',mat_note_ph:'Temp, speed...',
    mat_new:'New material',mat_edit:'Edit material',
    inv_typology:'Type',inv_brand:'Brand',inv_critical:'critical',
    inv_total_val:'Total inventory value',inv_upd:'Upd.',
    inv_sort:'Sort by',inv_sort_colore:'Color',inv_sort_tipo:'Type',inv_sort_marca:'Brand',inv_sort_stock:'Stock',inv_sort_val:'Quantity',inv_sort_price:'Price',
    pr_consumption:'Avg. consumption',pr_amort:'Deprec.',pr_hourly:'Hourly cost',
    pr_none:'No printers.',pr_new:'New printer',pr_edit:'Edit printer',
    print_none:'No prints yet.',print_first:'Register first print',
    print_total:'Total cost',print_in_progress:'in progress',print_project:'Project name',
    print_client:'Customer',print_printer:'Printer',print_materials:'Materials',
    print_hours:'Hours',print_min:'Min',print_labor:'Labor',print_status:'Status',
    print_stock_info:'ℹ️ Stock is deducted only on first transition to "Completed".',
    print_reg:'Register',print_save:'Save changes',print_linked_q:'Quote',
    print_new:'New print',print_edit:'Edit print',
    q_none:'No quotes yet.',q_first:'Create first quote',
    q_total:'Total quotes',q_pending:'Pending / Confirmed',q_done:'Completed',
    q_from_rb:'Select from contacts',q_pick_rb:'— choose from contacts —',
    q_validity:'Validity (days)',q_models:'Models to print',q_add_model:'Add Model',
    q_model_name:'Model Name',q_model_status:'Model Status',
    q_global_notes:'Global Quote Notes',q_notes_ph:'Notes, timing, finishing...',
    q_shipping:'Shipping',q_no_shipping:'— No shipping —',q_ship_cost:'Shipping cost €',
    q_markup_base:'Base markup %',q_markup_extra:'Extra markup %',q_iva:'VAT %',
    q_ritenuta:'Withholding 20%',q_ritenuta_only:'Only for occasional work',
    q_taxable:'Taxable',q_gross:'Gross profit',q_sale:'sale',q_prod:'Production:',
    q_auto_prints:'ℹ️ A print will be created for each model (status: Pending).',
    q_import:'Import quote',q_import_none:'No new quotes.',q_export_single:'Export Quote',
    q_frozen:'Frozen',q_changed:'data changed',q_changes_title:'⚠ Changes detected:',
    q_update:'Update & recalculate',q_freeze:'Freeze values',q_dup:'Duplicate with new prices',
    q_pdf:'PDF',q_receipt:'Receipt',q_new:'New quote',q_edit:'Edit quote',
    q_num:'Quote No.',q_customer:'Customer *',q_customer_ph:'Customer name',
    q_extra_services:'Extra services',
    q_del_title:'Delete quote',
    q_del_has_prints:'This quote has linked prints. How do you want to proceed?',
    q_del_unlink:'Unlink prints',q_del_unlink_hint:'Prints are kept but lose their link to this quote.',
    q_del_also:'Delete prints too',q_del_also_hint:'All linked prints will be deleted.',
    q_import_restored:'quote restored',q_import_prints_restored:'prints restored',
    cb_mat:'Mat.',cb_energy:'Energy',cb_amort:'Deprec.',cb_labor:'Labor',
    cb_services:'Services',cb_shipping:'Shipping',cb_prod:'Production:',cb_tot:'Total:',
    rb_search_ph:'Search name, company, email...',rb_none:'No contacts yet.',
    rb_no_results:'No results.',rb_add_first:'Add first contact',
    rb_fiscal:'Tax info',rb_piva:'VAT number',rb_cf:'Tax code',
    rb_new:'New contact',rb_edit:'Edit contact',rb_note_ph:'Additional notes...',
    set_rs:'Company name',set_logo:'Company logo',set_logo_change:'Change',
    set_logo_upload:'Upload logo',
    set_regime_ord:'Standard regime',set_regime_forf:'Flat-rate regime',set_regime_occ:'Occasional work',
    set_iva:'VAT (%)',set_ritenuta:'Withholding tax',set_ritenuta_apply:'Apply 20% withholding',
    set_ritenuta_only:'Only for occasional work',
    set_forf_label:'Flat-rate regime declaration',set_occ_label:'Occasional work declaration',
    set_formula:'Production cost formula',
    set_formula_legend:'Formula Legend:',set_formula_pg:'P_g = Material price per gram',
    set_formula_wg:'W_g = Model weight in grams',set_formula_mk:'mat_mk% = Specific material markup',
    set_formula_th:'T_h = Print time in hours',set_formula_ekw:'E_kw = Printer energy consumption (kW)',
    set_formula_ckwh:'C_kwh = Energy cost (€/kWh)',set_formula_ah:'A_h = Hourly depreciation cost',
    set_formula_mop:'M_op = Labor cost',
    set_formula_fail:'fail% = Additional cost % for possible failures (per material)',
    set_energy:'Energy cost €/kWh',set_labor_def:'Default labor',set_markup_def:'Default global markup %',set_currency:'Currency',
    set_add_service:'Service name',set_add_corriere:'Carrier name',
    set_new_type:'New type (e.g. PLA-HF)...',set_types_note:'Deleted types are not removed from saved materials.',
    set_pay_name:'Method name',set_pay_name_ph:'e.g. Credit card',
    set_pay_desc:'Instructions',set_pay_desc_ph:'Description and instructions...',set_pay_add:'Add method',
    set_exp_all:'Full export',set_exp_all_d:'All data + settings',
    set_reset_title:'Full reset',set_reset_desc:'Deletes all data (materials, prints, quotes, settings) and creates a new empty session.',
    set_reset_btn:'Reset memory',set_reset_confirm1:'Are you sure? All data will be deleted.',set_reset_confirm2:'Final confirmation: this action is irreversible.',set_reset_done:'Reset complete. Create a new session file.',
    set_imp_all:'Full import',set_imp_all_d:'Restore backup (overwrites all)',
    set_exp_mat:'Export materials',set_exp_mat_d:'Materials database only (JSON)',
    set_imp_mat:'Import materials',set_imp_mat_d:'Import/replace materials database',
    set_lang_label:'Application language',set_lang_it:'Italiano',set_lang_en:'English',
    set_lang_current:'Current language: English',set_footer:'Data saved automatically in browser.',
    set_color_lang_en:'Always use English color names',set_color_lang_en_hint:'Color names (White, Black, Red…) stay in English regardless of language. Color search will use English names.',
    imp_ok:'Import completed',imp_unknown:'Unrecognised file',
    imp_invalid:'Invalid file.',imp_err:'Error',imp_mats_done:'materials imported.',
    stk_set:'Set value',stk_add:'Add/Subtract',stk_new:'New stock (g)',stk_qty:'Quantity (+/-)',stk_upd:'Update',stk_of:'Stock for',stk_cur:'New stock',
    /* spools */
    spool_manage:'Manage spools',spool_title:'Spool Management',spool_add:'Add spool',
    spool_open:'Open',spool_closed:'Closed',spool_count:'spools',spool_new:'New spool',
    spool_label:'Label (optional)',spool_nominal:'Nominal capacity (g)',spool_residuo:'Current remaining (g)',
    spool_tipo:'Spool type',spool_tipo_full:'Full spool',spool_tipo_refill:'Refill',spool_tipo_sample:'Sample',
    spool_mat:'Container material',spool_mat_cartone:'Cardboard',spool_mat_plastica:'Plastic',spool_mat_nessuno:'None (refill)',
    spool_riutilizzabile:'Reusable container',
    spool_prezzo_acq:'Purchase price',spool_prezzo_acq_hint:'Price paid for this spool (not per kg)',
    spool_prezzo_kg_calc:'Equivalent price €/kg',
    spool_prezzo_medio:'Calculated average price',spool_lotto:'Manufacturer batch',spool_data:'Purchase date',
    spool_open_chk:'Open',spool_closed_chk:'Closed',spool_esaurita_chk:'Depleted',
    spool_auto_open:'⟵ auto-opened (partial residue)',
    spool_full_free:'Full spool: you can choose',
    spool_no_spools:'No spools registered.',spool_detail:'Spool detail',
    spool_prezzo_medio_hint:'Weighted average on all spools (active+depleted) with price set.',
    spool_storico_label:'Purchase history (manual override)',
    spool_storico_prezzo:'Historical average price (€/kg)',spool_storico_qty:'Historical quantity (g)',
    spool_storico_hint:'Contributes to average price even after depleted spools are deleted. Editable.',
    spool_complete:'Complete',spool_esaurita:'Depleted',
    spool_manual_price:'Material manual price (€/kg)',spool_manual_price_hint:'Used as fallback if no spool has price.',
    spool_nominal_custom:'Custom',
    side_mats:'Mat.',side_in_prog:'Printing..',side_storage:'Local storage',
    dash_magazzino:'Warehouse',dash_profits:'Profit',dash_profit_completed:'from completed quotes',
    dash_profit_from_comp:'From completed',dash_profit_from_pend:'From pending/confirmed',
    dash_profit_pending:'from confirmed quotes',dash_revenue:'Total revenue',
    dash_printers_sub:'printers',dash_total_sub:'total',dash_completed_prints:'completed prints',
    dash_prints_word:'prints',dash_of_word:'of',dash_from_prints:'from prints',dash_from_quotes:'from quotes',
    dash_mem_used:'mem. used',
    dash_medio:'Avg',dash_margine:'Margin',dash_attivi:'active',
    dash_completati_kpi:'Completed',dash_fatturato:'Revenue',dash_profitto:'Profit',
    dash_12months:'12 months',
    mat_excl_crit:'Exclude from critical stocks',
    print_search_ph:'Search by print name, client, project, material, quote #...',
    q_search_ph:'Search by quote #, client, company, project, email...',
    inv_exp_csv:'Export CSV',inv_imp_csv:'Import CSV',inv_csv_desc:'Quick management via spreadsheet',
    inv_csv_ok:'CSV imported successfully',inv_csv_err:'Error in CSV file',
    inv_csv_cols:'Columns: nome,codice,tipo,marca,colore,diam,prezzo,markup,stock,soglia,note',
    set_exp_csv_mat:'Export materials CSV',set_exp_csv_mat_d:'Spreadsheet (Excel, LibreOffice)',
    set_imp_csv_mat:'Import materials CSV',set_imp_csv_mat_d:'Update stock and prices from CSV',
    pr_brand:'Brand',pr_model:'Model',pr_note_label:'Technical notes',
    print_flag_attesa:'Pending',print_flag_corso:'In Progress',
    print_flag_fallite:'Failed',print_flag_completate:'Completed',
    print_grouped_none:'Prints without quote',
    q_flag_attesa:'Pending',q_flag_confermati:'Confirmed',q_flag_completati:'Completed',
    q_flag_annullati:'Cancelled',q_group_no_client:'No client',
    q_uso_interno:'Internal use (company job)',
    q_uso_interno_hint:'No markup, shipping or VAT. Tracks material, energy and depreciation costs.',
    q_int_section:'Internal jobs',q_int_badge:'Internal',
    dash_int_costs:'Internal costs',dash_int_label:'from completed internal jobs',dash_int_label_count:'internal jobs',
    dash_int_count:'Completed internal jobs',
    inv_filter_stock:'Filter stock less than (g):',inv_filter_ph:'e.g. 500',inv_filter_clear:'All',
    pdf_quote:'Quote',pdf_receipt:'Receipt',pdf_valid:'Valid',
    pdf_client:'Customer',pdf_costs:'Cost breakdown',pdf_summary:'Summary',
    pdf_global:'GLOBAL COSTS',pdf_shipping:'Shipping',
    pdf_prod_total:'Total production cost',
    pdf_prep:'Technical Setup',pdf_prep_desc:'File setup and slicing',
    pdf_additive:'Additive Production',pdf_additive_desc:'3D Printing and materials',
    pdf_post:'Post-Processing',
    pdf_row_mat:'Material',pdf_row_energy:'Energy',pdf_row_amort:'Depreciation',pdf_row_labor:'Labor',
    pdf_error:'An error occurred while generating the PDF.',
    pdf_btn_int:'PDF Int.',pdf_btn_cli:'PDF Cli.',pdf_btn_ric_i:'Rec.I',pdf_btn_ric_c:'Rec.C',
    /* receipts */
    rcpt_title:'Receipt',rcpt_go:'Go to Receipt →',rcpt_draft_detail:'Detailed Receipt (Draft)',
    rcpt_draft_synth:'Summary Receipt (Draft)',rcpt_detail:'Detailed Receipt',rcpt_synth:'Summary Receipt',
    rcpt_paid:'PAID',rcpt_paid_hint:'Check when the client has paid to enable receipt issuance',
    rcpt_emit:'Issue Receipt',rcpt_emit_confirm_title:'Confirm receipt issuance',
    rcpt_emit_confirm:'Proceeding will issue the final receipt. Number and date will be locked and cannot be changed.',
    rcpt_emit_ok:'Issue',rcpt_cancel_receipt:'Void receipt',
    rcpt_cancel_title:'Void receipt',rcpt_cancel_reason:'Reason for voiding (required)',
    rcpt_cancel_ok:'Confirm voiding',rcpt_cancelled:'VOIDED',rcpt_reissue:'New receipt (same number)',
    rcpt_num:'Receipt No.',rcpt_date:'Issue date',rcpt_ref:'Quote ref.',
    rcpt_object:'Service description',rcpt_period:'Period',rcpt_period_ph:'e.g. March 2026 or 15-18/07/2026',
    rcpt_client_section:'Client',rcpt_amounts:'Amounts',
    rcpt_gross:'Gross amount',rcpt_extra_rows:'Additional items',rcpt_add_row:'Add item',
    rcpt_row_text:'Description',rcpt_row_cost:'Amount (€)',rcpt_withholding:'Withholding tax 20%',
    rcpt_stamp:'Revenue stamp (€2.00)',rcpt_net:'Net payable',rcpt_sign:'Date and Signature',
    rcpt_stamp_note:'Attach €2.00 revenue stamp',
    rcpt_no_client:'Quote has no client — cannot issue receipt.',
    rcpt_internal:'Internal quote — receipt not available.',
    rcpt_ordinary_warn:'In standard tax regime the receipt becomes an e-invoice. Electronic invoice management will be implemented in a future version.',
    rcpt_tab_receipt:'Receipt',rcpt_tab_list:'Receipt list',
    rcpt_list_year:'Year',rcpt_list_empty:'No receipts issued for this year.',
    rcpt_list_print:'Print list',rcpt_draft_label:'DRAFT — not valid for tax purposes',
    rcpt_export:'Export receipt',rcpt_import:'Import receipt',rcpt_import_ok:'Receipt imported.',rcpt_import_err:'Invalid receipt file.',rcpt_import_dup:'Receipt already exists (same number).',rcpt_import_no_quote:'Linked quote not found. Create the quote first.',
    rcpt_back:'Back to quotes',rcpt_emitted:'Receipt issued on',rcpt_not_emitted:'Not yet issued',
    rcpt_cancel_reason_err:'Please enter a reason for voiding.',
    waste_skip:'Skip',waste_scale:'Deduct stock',waste_confirm:'Confirm',waste_failed_label:'Failed',
    waste_intro:'Enter the amount of material already consumed to deduct from stock.',
    waste_checkbox:'Deduct consumed material from stock',
    waste_unknown_mat:'Unknown material',
    waste_expected:'Expected',waste_new_stock:'→ stock',
    pdf_taxable:'Taxable',pdf_iva:'VAT',pdf_ritenuta:'Withholding tax 20%',
    pdf_total:'TOTAL',pdf_notes:'Notes',pdf_payment:'Payment Methods',
    q_nome_progetto:'Project Name',q_nome_progetto_ph:'e.g. Doll House',
    q_payment_methods:'Accepted payment methods',
    print_cost_detail:'Cost breakdown (from quote)',
    set_cr_service:'Service type',
    dash_trend:'Revenue Trend',
    dash_top_mats:'Top Materials Used',
    /* material definition */
    mat_field_material:'Material',mat_field_type:'Material Type',
    mat_field_color_name:'Color Name',mat_field_color_none:'no color',
    mat_field_visual_color:'Visual color (hex)',mat_full_name:'Full Name (Composed)',mat_field_color_custom_ph:'or type...',
    def_mat_materials:'Base materials',def_mat_types:'Material types',def_mat_colors:'Color names',
    def_mat_brands:'Manufacturers',
    def_mat_add_mat:'New material',def_mat_add_type:'New type',def_mat_add_color:'New color',
    def_mat_add_brand:'New manufacturer',
    def_mat_note:'Changes here do not update existing materials.',
    def_mat_quick:'Quick Filters (Quick Types)',def_mat_quick_hint:'Types shown as quick buttons in inventory.',def_mat_quick_add:'Add type...',
    inv_view_schede:'Cards',inv_view_stock:'Stock',
    inv_all:'All',inv_filters:'Filters:',inv_remove_filters:'Remove all',
    inv_crit_title:'Critical stocks',inv_print_crit:'Print list',inv_show_all:'Show all',
    inv_filter_active:'Active filters',
    crit_html_material:'Material',crit_html_stock:'Stock',crit_html_min:'Minimum',crit_html_status:'Status',crit_html_value:'Value',
    crit_html_items:'item(s)',crit_reordered:'Reordered',
    crit_st_esaurito:'Out of stock',crit_st_basso:'Low stock',
    no_results:'No results.',no_results_for:'No results for',
    filter_placeholder:'Filter...',search_color_ph:'Search color (IT or EN)...',
    inv_csv_hint:'Supported CSV columns',
    /* memory */
    mem_used_label:'Used',mem_free_label:'Free',mem_limit_label:'Estimated limit',
    mem_used_note:'used',
    /* session */
    sess_link_hint:'Link a JSON file in a cloud folder (Google Drive, Dropbox, iCloud) for silent auto-save every 5 minutes.',
    sess_file_linked:'File Linked',
    /* carriers */
    set_cr_carrier_name:'Carrier name',set_cr_service_ph:'Service (e.g. EXPRESS)',
    /* payments */
    set_pay_instructions:'Payment instructions',set_pay_add_method:'Add method',
    /* edit */
    edit_print_title:'Edit print',edit_quote_title:'Edit quote',
    /* PrintForm */
    print_form_linked_q:'Quote',
    print_form_wait_lock:'ℹ️ Print pending: Registry data locked. (Materials, time and labor are editable)',
    print_rcpt_locked:'🔒 Definitive receipt issued — the linked print and quote cannot be edited.',
    print_form_materials:'Materials',print_form_add_mat:'Material',print_form_total_prod:'Total Production',
    /* QuoteForm model */
    q_model_wait_lock:'ℹ️ Model pending: Name is locked. (Materials, time and labor are editable)',
    q_model_materials:'Materials',q_model_extra:'Extra Services',
    /* Contacts */
    rb_title:'Contacts',
    rb_field_name:'First name',rb_field_surname:'Last name',rb_field_company:'Company',rb_field_phone:'Phone',
    /* Company data */
    set_address:'Address',set_city:'City',set_province:'Province',
    /* Printer form */
    pr_consumption_label:'Consumption (kW)',pr_amort_label:'Depreciation (€/h)',
    /* Print form extra */
    print_tech_locked:'technical details locked',
    print_ref_label:'Quote / Model Reference',
    print_note_ph:'Settings, issues...',
    date_label:'Date',
    /* Quick calc */
    quick_calc_title:'Quick Cost Calculator',
    quick_calc_sale:'Suggested sale price',
    waste_consumed_label:'Consumed (g)',
    print_select_hint:'Select a print or create a new one',
    quote_select_hint:'Select a quote to view its details',
    /* spool CSV export/import */
    set_exp_csv_dual:'Export CSV Materials + Spools',set_exp_csv_dual_d:'Generate two linked CSV files (materials and spools)',
    set_imp_csv_dual:'Import CSV Materials + Spools',set_imp_csv_dual_d:'Select both CSV files at once (Ctrl/Cmd+click)',
    csv_dual_ok:'CSV import completed',csv_dual_warn_missing:'Spools file not found — materials only imported.',
    csv_dual_err_nomat:'Materials file not recognised.',csv_dual_spools_imported:'spools imported',
    csv_dual_hint:'Hold Ctrl (or Cmd on Mac) to select both files at the same time.',
    csv_dual_missing_mat:'⚠ Material ID not found in materials CSV — spool skipped:',
    /* dashboard spools */
    dash_spools_title:'Spools',dash_spools_active:'Open',dash_spools_stock:'In Stock',dash_spools_low:'Almost empty',
    dash_spools_empty:'Depleted',dash_spools_value:'Stock Value',dash_spools_value_open:'of which open',dash_spools_value_closed:'of which closed',
    dash_spools_none:'No spools registered.',dash_spools_low_list:'Almost empty spools',
    dash_spools_reusable:'Reusable containers',dash_spools_go:'Manage inventory',
    /* contacts sort */
    rb_sort:'Sort by',rb_sort_nome:'Name',rb_sort_azienda:'Company',rb_sort_email:'Email',rb_sort_citta:'City',
    /* inventory spool filters */
    inv_ft_open:'Open spools',inv_ft_refill:'Refill',inv_ft_spools:'Spools',inv_ft_no_spools:'No Spools',inv_ft_riord:'Reordered',
    tema_title:'Theme & colors',tema_dark:'Dark',tema_light:'Light',
    tema_custom:'Custom',tema_reset:'Reset to preset',tema_apply:'Apply',
    tema_bg:'Background',tema_panels:'Panels',tema_cards:'Cards',tema_inputs:'Inputs',
    tema_borders:'Borders',tema_text1:'Text',tema_text2:'Secondary text',tema_text3:'Hint text',
    tema_accent:'Accent',tema_ok:'Success',tema_warn:'Warning',tema_err:'Error',
    tema_custom_hint:'Click a color square to change it.',
    inv_ft_excl_crit:'Excl. critical',
    /* settings stock completo */
    set_exp_stock:'Export Full Stock',set_exp_stock_d:'Materials + spools in a single JSON file',
    set_imp_stock:'Import Full Stock',set_imp_stock_d:'Restore materials and spools from JSON file',
    set_grp_backup:'Full Backup',
    set_grp_json:'Materials Backup',set_grp_json_d:'Full data backup in JSON format',
    set_grp_csv:'CSV Materials + Spools',
    /* inventory stock view */
    inv_stk_agg:'Upd.Tot.Stock',inv_stk_open_card:'Open card',inv_print_list:'Print list',
    /* critical spools */
    crit_html_spools:'Spools',
    /* auto-generate spools */
    spool_autogen_title:'Auto-generate spools',
    spool_autogen_hint:'You are assigning the first spools to this material. Would you like the app to automatically generate the remaining spools to cover the existing stock?',
    spool_autogen_remaining:'Stock not yet assigned to spools',
    spool_autogen_nominal:'Nominal capacity per generated spool',
    spool_autogen_tipo:'Container type',
    spool_autogen_preview:'Spools that will be created',
    spool_autogen_full:'full at',spool_autogen_partial:'partial at',
    spool_autogen_skip:'No, I will add manually',spool_autogen_go:'Generate spools',
    spool_stock_gap:'Unassigned stock',spool_stock_gap_hint:'Grams of material stock not yet covered by registered spools.',
  }
};

/* ══ THEME ══ */
const C={bg:'#0f1117',s1:'#161720',s2:'#1d1e2b',s3:'#242535',b:'#2c2d40',
  a:'#f59e0b',a2:'rgba(245,158,11,0.12)',a3:'rgba(245,158,11,0.25)',
  t:'#e8e9f3',t2:'#9b9eb8',t3:'#55577a',
  ok:'#4ade80',okBg:'rgba(74,222,128,0.08)',okBr:'rgba(74,222,128,0.25)',
  warn:'#f59e0b',warnBg:'rgba(245,158,11,0.08)',warnBr:'rgba(245,158,11,0.25)',
  err:'#f87171',errBg:'rgba(248,113,113,0.08)',errBr:'rgba(248,113,113,0.25)',
  blue:'#60a5fa',blueBg:'rgba(96,165,250,0.1)',blueBr:'rgba(96,165,250,0.25)',
  purple:'#a78bfa',purpleBg:'rgba(167,139,250,0.1)',purpleBr:'rgba(167,139,250,0.25)',
  teal:'#2dd4bf',tealBg:'rgba(45,212,191,0.1)',tealBr:'rgba(45,212,191,0.25)'};

/* ══ THEME SYSTEM ══ */
const hexToRgba=(hex,a)=>{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;};
const computeC=base=>({...base,
  a2:hexToRgba(base.a,0.12),a3:hexToRgba(base.a,0.25),
  okBg:hexToRgba(base.ok,0.08),okBr:hexToRgba(base.ok,0.25),
  warnBg:hexToRgba(base.warn,0.08),warnBr:hexToRgba(base.warn,0.25),
  errBg:hexToRgba(base.err,0.08),errBr:hexToRgba(base.err,0.25),
  blueBg:hexToRgba(base.blue,0.10),blueBr:hexToRgba(base.blue,0.25),
  purpleBg:hexToRgba(base.purple,0.10),purpleBr:hexToRgba(base.purple,0.25),
  tealBg:hexToRgba(base.teal,0.10),tealBr:hexToRgba(base.teal,0.25),
});
const TEMA_PRESETS=[
  {id:'scuro_1',nome:'Notte',dark:true,
    bg:'#0f1117',s1:'#161720',s2:'#1d1e2b',s3:'#242535',b:'#2c2d40',
    t:'#e8e9f3',t2:'#9b9eb8',t3:'#55577a',
    a:'#f59e0b',ok:'#4ade80',warn:'#fb923c',err:'#f87171',
    blue:'#60a5fa',purple:'#a78bfa',teal:'#2dd4bf'},
  {id:'scuro_2',nome:'Oceano',dark:true,
    bg:'#0d1117',s1:'#161b22',s2:'#1c2333',s3:'#222d40',b:'#2d3748',
    t:'#e2e8f0',t2:'#94a3b8',t3:'#4a5568',
    a:'#60a5fa',ok:'#4ade80',warn:'#fb923c',err:'#f87171',
    blue:'#93c5fd',purple:'#c084fc',teal:'#2dd4bf'},
  {id:'scuro_3',nome:'Viola',dark:true,
    bg:'#0e0b14',s1:'#16111f',s2:'#1e1729',s3:'#271f35',b:'#3d3052',
    t:'#ede8f5',t2:'#a898cc',t3:'#6a588a',
    a:'#c084fc',ok:'#4ade80',warn:'#fb923c',err:'#f87171',
    blue:'#60a5fa',purple:'#e879f9',teal:'#2dd4bf'},
  {id:'chiaro_1',nome:'Classico',dark:false,
    bg:'#f5f5f2',s1:'#ffffff',s2:'#f0eff0',s3:'#e8e8e5',b:'#d0d0cc',
    t:'#1a1a1a',t2:'#4a4a4a',t3:'#8a8a8a',
    a:'#e07c00',ok:'#16a34a',warn:'#d97706',err:'#dc2626',
    blue:'#2563eb',purple:'#7c3aed',teal:'#0d9488'},
  {id:'chiaro_2',nome:'Cielo',dark:false,
    bg:'#eef2f7',s1:'#ffffff',s2:'#f0f4f9',s3:'#e2e8f1',b:'#c5d0de',
    t:'#0f1f33',t2:'#3a5068',t3:'#7a90a8',
    a:'#2563eb',ok:'#16a34a',warn:'#d97706',err:'#dc2626',
    blue:'#1d4ed8',purple:'#7c3aed',teal:'#0d9488'},
  {id:'chiaro_3',nome:'Foresta',dark:false,
    bg:'#f0f5f0',s1:'#ffffff',s2:'#edf5ed',s3:'#e0ece0',b:'#c0d4c0',
    t:'#111e11',t2:'#3a5a3a',t3:'#6a8a6a',
    a:'#16a34a',ok:'#15803d',warn:'#d97706',err:'#dc2626',
    blue:'#2563eb',purple:'#7c3aed',teal:'#0d9488'},
];
const TEMA_DEFAULT='scuro_1';
const getActiveBase=(tema)=>{
  if(!tema)return TEMA_PRESETS[0];
  if(tema.preset==='custom'&&tema.custom)return tema.custom;
  return TEMA_PRESETS.find(p=>p.id===tema.preset)||TEMA_PRESETS[0];
};

/* ══ LOCALSTORAGE ══ */
const LS={
  set:(k,v)=>{try{localStorage.setItem('p3d_'+k,JSON.stringify(v));}catch{}},
  get:(k,d)=>{try{const r=localStorage.getItem('p3d_'+k);return r!==null?JSON.parse(r):d;}catch{return d;}},
  del:(k)=>{try{localStorage.removeItem('p3d_'+k);}catch{}}
};

/* ══ SESSION & MEMORY HELPERS ══ */
const calcMemUsage=()=>{
  try{
    let used=0;
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      used+=(localStorage.getItem(k)||'').length*2; // UTF-16 bytes
    }
    const limit=5*1024*1024; // conservative 5 MB estimate
    return{used,usedKB:Math.round(used/1024),usedMB:+(used/1024/1024).toFixed(2),pct:Math.min(100,Math.round(used/limit*100)),limit,limitMB:5,warning:used/limit>0.70};
  }catch{return{used:0,usedKB:0,usedMB:0,pct:0,limit:5*1024*1024,limitMB:5,warning:false};}
};

const buildSessionData=(mats,prints,quotes,printers,settings,usedNums,clients,rcptNums)=>({
  mats,prints,quotes,printers,settings,usedNums,clients,rcptNums,_version:DATA_VERSION,_saved:new Date().toISOString()
});

/* File System Access API helpers */
const FSA_SUPPORTED=typeof window!=='undefined'&&'showSaveFilePicker' in window;

const idbGetHandle=async()=>{
  try{
    return await new Promise((res,rej)=>{
      const req=indexedDB.open('p3d_session',1);
      req.onupgradeneeded=e=>e.target.result.createObjectStore('handles');
      req.onsuccess=e=>{
        const db=e.target.result;
        const tx=db.transaction('handles','readonly');
        const r=tx.objectStore('handles').get('sessionFile');
        r.onsuccess=()=>res(r.result||null);
        r.onerror=()=>res(null);
      };
      req.onerror=()=>res(null);
    });
  }catch{return null;}
};

const idbSetHandle=async(handle)=>{
  try{
    await new Promise((res,rej)=>{
      const req=indexedDB.open('p3d_session',1);
      req.onupgradeneeded=e=>e.target.result.createObjectStore('handles');
      req.onsuccess=e=>{
        const db=e.target.result;
        const tx=db.transaction('handles','readwrite');
        tx.objectStore('handles').put(handle,'sessionFile');
        tx.oncomplete=res;tx.onerror=rej;
      };
      req.onerror=rej;
    });
  }catch{}
};

const writeToHandle=async(handle,data)=>{
  try{
    const perm=await handle.queryPermission({mode:'readwrite'});
    if(perm!=='granted'){const p2=await handle.requestPermission({mode:'readwrite'});if(p2!=='granted')return false;}
    const w=await handle.createWritable();
    await w.write(JSON.stringify(data,null,2));
    await w.close();
    return true;
  }catch{return false;}
};

const dlSession=(data,fn)=>{
  const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const u=URL.createObjectURL(b);
  const a=document.createElement('a');a.href=u;a.download=fn;a.click();
  URL.revokeObjectURL(u);
};

/* ══ CONSTANTS ══ */
/* Legacy — mantenuto per compatibilità con dati precedenti */
/* ── Logo SimonMakerForge (base64) ── */
const SMF_LOGO='data:image/png;base64,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';

const BASE_TIPI=['PLA','PLA+','PLA-CF','PETG','PETG-CF','PETG-HF','ABS','ABS-GF','ASA','ASA-CF','TPU','TPU for AMS','PA (Nylon)','PC','PC FR','PA6-CF','PA6-GF','PAHT-CF','PPA-CF','PPS-CF','Resin Standard','Resin ABS-Like','Resin Flex','Altro'];

/* Nuove liste per nome composto Materiale + Tipo Materiale + Nome Colore */
/* Ordine: A-Z poi numerici */
const BASE_MATERIALI=[
  'ABS','ABS+','ASA','PA (Nylon)','PA6','PA12','PAHT','PC','PETG','PLA','PLA+',
  'PPA','PPS','PVA','Resin','Support','TPU'
];
const BASE_TIPI_MAT=[
  '','85A','95A','ABS-Like','Aero','Air','Basic','CF','CMYK',
  'Color Change (Temp)','Color Change (UV)','Conductive','Crystal',
  'ESD','Flex','..for AMS','FR','Galaxy','GF','Glitter','Glow',
  'Gradient','Gradient Matte','HF','High Gloss','High Speed',
  'High Speed Matte','HT','Marble','Matte','Metal','Neon',
  'Rainbow','Silk','Silk Dual','Silk Triple','Sparkle',
  'Standard','..for ABS','..for PLA','..for PLA/PETG','..for PA/PET',
  'Tough','Translucent','Transparent','Wood'
];
const BASE_PRODUTTORI=[
  'Amazon Basics','Bambu Lab','CC3D','Creality','ELEGOO','eSUN',
  'FlashForge','Generic','Giantarm','Inland','Overture',
  'Polymaker','Prusament','SUNLU'
];

/* Dizionario bilingue IT↔EN per i nomi colore */
const COLOR_BILINGUAL=[
  /* Ordine alfabetico IT A→Z */
  {it:'Acqua',en:'Aqua'},
  {it:'Arancione',en:'Orange'},
  {it:'Argento',en:'Silver'},
  {it:'Argento metallico',en:'Metallic Silver'},
  {it:'Avorio',en:'Ivory'},
  {it:'Azzurro',en:'Light Blue'},
  {it:'Beige',en:'Beige'},
  {it:'Bianco',en:'White'},
  {it:'Bianco giada',en:'Jade White'},
  {it:'Bianco osso',en:'Bone White'},
  {it:'Bianco sporco',en:'Off-White'},
  {it:'Blu',en:'Blue'},
  {it:'Blu ghiaccio',en:'Ice Blue'},
  {it:'Blu navy',en:'Navy'},
  {it:'Bordeaux',en:'Burgundy'},
  {it:'Bronzo',en:'Bronze'},
  {it:'Bronzo metallico',en:'Metallic Bronze'},
  {it:'Carbone',en:'Charcoal'},
  {it:'Castagne arrostite',en:'Roasted Chestnut'},
  {it:'Ciano',en:'Cyan'},
  {it:'Crema',en:'Cream'},
  {it:'Fluorescente',en:'Fluorescent'},
  {it:'Fucsia',en:'Fuchsia'},
  {it:'Giallo',en:'Yellow'},
  {it:'Grigio',en:'Grey'},
  {it:'Grigio chiaro',en:'Light Grey'},
  {it:'Grigio scuro',en:'Dark Grey'},
  {it:'Grigio titanio',en:'Titanium Grey'},
  {it:'Lavanda',en:'Lavender'},
  {it:'Legno',en:'Wood'},
  {it:'Lilla',en:'Lilac'},
  {it:'Lucido',en:'Glossy'},
  {it:'Luminescente',en:'Glow'},
  {it:'Magenta',en:'Magenta'},
  {it:'Marmo',en:'Marble'},
  {it:'Marrone',en:'Brown'},
  {it:'Menta',en:'Mint'},
  {it:'Mezzanotte',en:'Midnight'},
  {it:'Multicolore',en:'Multicolor'},
  {it:'Naturale',en:'Natural'},
  {it:'Nero',en:'Black'},
  {it:'Oliva',en:'Olive'},
  {it:'Opaco',en:'Matte'},
  {it:'Oro',en:'Gold'},
  {it:'Oro metallico',en:'Metallic Gold'},
  {it:'Perlato',en:'Pearlescent'},
  {it:'Rosa',en:'Pink'},
  {it:'Rosso',en:'Red'},
  {it:'Sabbia',en:'Sand'},
  {it:'Seta',en:'Silk'},
  {it:'Trasparente',en:'Transparent'},
  {it:'Turchese',en:'Turquoise'},
  {it:'Verde',en:'Green'},
  {it:'Verde acqua',en:'Teal'},
  {it:'Verde bambù',en:'Bamboo Green'},
  {it:'Verde erba',en:'Grass Green'},
  {it:'Verde fluorescente',en:'Fluorescent Green'},
  {it:'Verde luminoso',en:'Bright Green'},
  {it:'Verde scuro',en:'Dark Green'},
  {it:'Viola',en:'Purple'},
];

/* Traduce un nome colore tra IT e EN; se non trovato restituisce il nome originale */
let _userColorMap=[];/* aggiornato da App ad ogni render con settings.nomi_colore_map */
const translateColor=(name,toLang)=>{
  if(!name)return name;
  const nl=name.toLowerCase().trim();
  /* 1. cerca nella lista hardcoded */
  const pair=COLOR_BILINGUAL.find(c=>c.it.toLowerCase()===nl||c.en.toLowerCase()===nl);
  if(pair)return toLang==='en'?pair.en:pair.it;
  /* 2. cerca nei colori aggiunti dall'utente */
  const uPair=_userColorMap.find(c=>c.it.toLowerCase()===nl||c.en.toLowerCase()===nl);
  if(uPair)return toLang==='en'?uPair.en:uPair.it;
  return name;
};

/* Lista base colori: tutta la lista bilingue */
const BASE_NOMI_COLORE_MAP=[...COLOR_BILINGUAL];
/* Compatibilità legacy: lista EN */
const BASE_NOMI_COLORE=BASE_NOMI_COLORE_MAP.map(c=>c.en);

/* Contrasto testo su sfondo colorato (hex) */
const contrastText=hex=>{
  if(!hex||hex.length<7)return'rgba(255,255,255,0.95)';
  const r=parseInt(hex.slice(1,3),16);
  const g=parseInt(hex.slice(3,5),16);
  const b=parseInt(hex.slice(5,7),16);
  return(0.299*r+0.587*g+0.114*b)>145?'rgba(0,0,0,0.82)':'rgba(255,255,255,0.95)';
};

/* Helper: estrae materiale base dal vecchio campo tipo */
const tipoToMateriale=tipo=>{
  if(!tipo)return'PLA';
  if(tipo.startsWith('Resin'))return'Resin';
  if(tipo==='TPU for AMS')return'TPU';
  if(tipo==='PC FR')return'PC';
  if(/^PA6-/.test(tipo))return'PA6';
  if(/^PAHT-/.test(tipo))return'PAHT';
  if(/^PPA-/.test(tipo))return'PPA';
  if(/^PPS-/.test(tipo))return'PPS';
  return tipo.replace(/-(CF|GF|HF|FR)$/,'');
};
const tipoToTipoMat=tipo=>{
  if(!tipo)return'';
  if(tipo==='Resin Standard')return'Standard';
  if(tipo==='Resin ABS-Like')return'ABS-Like';
  if(tipo==='Resin Flex')return'Flex';
  if(tipo==='TPU for AMS')return'..for AMS';
  if(tipo==='PC FR')return'FR';
  const m=tipo.match(/-(CF|GF|HF|FR)$/);
  return m?m[1]:'';
};

/* Helper nome composto da materiale + tipo_mat + nome_colore (canonical EN) */
const matNome=m=>{
  if(m.materiale){
    const base=[m.materiale,m.tipo_mat].filter(Boolean).join(' ');
    return[base,m.nome_colore].filter(Boolean).join(' ')||m.nome||'—';
  }
  return m.nome||'—';
};
/* Versione localizzata — usa la lingua passata per il nome colore */
const matNomeL=(m,lang)=>{
  if(m.materiale){
    const base=[m.materiale,m.tipo_mat].filter(Boolean).join(' ');
    const nc=translateColor(m.nome_colore,lang)||m.nome_colore;
    return[base,nc].filter(Boolean).join(' ')||m.nome||'—';
  }
  return m.nome||'—';
};

const DIAMETRI=['1.75mm','2.85mm','Resina','N/A'];
const PRINT_STATI=['In attesa','In corso','Completata','Fallita'];
const QUOTE_STATI=['In attesa','Confermato','Completato','Annullato'];

/* Calcola grammi impegnati per materiale da stampe attive (In attesa / In corso)
   non ancora scaricate dallo stock. excludeIds = array di print.id da ignorare
   (usato quando si sta modificando una stampa o un preventivo esistente) */
const calcCommitted=(prints=[],excludeIds=[])=>{
  const map={};
  prints.forEach(p=>{
    if(excludeIds.includes(p.id))return;
    if(!['In attesa','In corso'].includes(p.stato))return;
    if(p.stock_deducted)return;
    (p.materials||[]).forEach(({mat_id,peso_g})=>{
      map[mat_id]=(map[mat_id]||0)+(+peso_g||0);
    });
  });
  return map;
};
const REGIMI=['ordinario','forfettario','occasionale'];
const uid=()=>Math.random().toString(36).slice(2,9);

/* ── Spool helpers ── */
const SPOOL_SIZES=[250,500,750,1000,2000,3000];
const newSpool=()=>({id:'sp'+uid(),etichetta:'',peso_nominale:1000,residuo:1000,stato:'chiusa',tipo_contenitore:'bobina_completa',materiale_bobina:'plastica',riutilizzabile:true,prezzo_acq_eur:null,prezzo_kg:null,data_acquisto:'',lotto:'',note:''});
/* prezzo medio pesato; include storico archiviato (Opzione A) */
const calcPrezzoMedio=(spools=[],fallback=0,storPrezzo=0,storQty=0)=>{
  const priced=spools.filter(s=>s.prezzo_kg!=null&&s.prezzo_kg>0);
  const pesoFn=sp=>sp.stato==='esaurita'?+sp.peso_nominale:+sp.residuo;
  /* contributo spools attive+esaurite */
  const spoolsG=priced.reduce((s,sp)=>s+pesoFn(sp),0);
  const spoolsVal=priced.reduce((s,sp)=>s+(sp.prezzo_kg*pesoFn(sp)),0);
  /* contributo storico archiviato */
  const storG=+storQty||0;
  const storVal=(+storPrezzo||0)*storG;
  const totG=spoolsG+storG;
  if(!totG)return+fallback||0;
  return(spoolsVal+storVal)/totG;
};
/* stock totale da spools */
const calcStockFromSpools=(spools=[])=>spools.filter(s=>s.stato!=='esaurita').reduce((s,sp)=>s+sp.residuo,0);
/* scala grammi dalle spools FIFO:
   1. prima le aperte (residuo minore per prima)
   2. se rimane ancora, apre automaticamente le chiuse (residuo minore per prima) */
const deductFromSpools=(spools,grams)=>{
  let rem=grams;
  const updated=spools.map(sp=>({...sp}));
  /* Fase 1: scala dalle aperte */
  updated.filter(s=>s.stato==='aperta').sort((a,b)=>a.residuo-b.residuo).forEach(sp=>{
    if(rem<=0)return;
    const idx=updated.findIndex(s=>s.id===sp.id);
    const d=Math.min(updated[idx].residuo,rem);
    updated[idx].residuo-=d;
    rem-=d;
    if(updated[idx].residuo<=0)updated[idx].stato='esaurita';
  });
  /* Fase 2: se rimangono grammi, apri automaticamente le bobine chiuse (FIFO) */
  if(rem>0){
    updated.filter(s=>s.stato==='chiusa').sort((a,b)=>a.residuo-b.residuo).forEach(sp=>{
      if(rem<=0)return;
      const idx=updated.findIndex(s=>s.id===sp.id);
      updated[idx].stato='aperta';/* apri automaticamente */
      const d=Math.min(updated[idx].residuo,rem);
      updated[idx].residuo-=d;
      rem-=d;
      if(updated[idx].residuo<=0)updated[idx].stato='esaurita';
    });
  }
  return{spools:updated,remaining:rem};/* esaurite mantennute in lista per storico */
};
const TC={
  'PLA':'#4ade80','PLA+':'#22c55e','PETG':'#22d3ee','ABS':'#f87171','ABS+':'#e55555',
  'ASA':'#fb923c','TPU':'#a78bfa','PA (Nylon)':'#60a5fa','PC':'#94a3b8','PA6':'#f472b6',
  'PA12':'#e879b0','PAHT':'#e879f9','PPA':'#c084fc','PPS':'#9333ea','PVA':'#67e8f9',
  'Resin':'#c084fc','Support':'#64748b','Altro':'#94a3b8',
  /* legacy */
  'PLA-CF':'#16a34a','PETG-CF':'#0891b2','PETG-HF':'#67e8f9','ABS-GF':'#dc2626','ASA-CF':'#ea580c','TPU for AMS':'#7c3aed','PC FR':'#64748b','PA6-CF':'#db2777','PA6-GF':'#f472b6','PAHT-CF':'#e879f9','PPA-CF':'#c084fc','PPS-CF':'#9333ea','Resin Standard':'#e879f9','Resin ABS-Like':'#c084fc','Resin Flex':'#f0abfc'
};
const tC=k=>TC[k]||'#94a3b8';
const tCm=m=>TC[m.materiale]||TC[m.tipo]||'#94a3b8';
/* Colore consistente per brand (hash del nome) */
const BRAND_PALETTE=['#38bdf8','#34d399','#fb923c','#f472b6','#a78bfa','#22d3ee','#4ade80','#facc15','#c084fc','#f87171','#67e8f9','#86efac','#fdba74','#fcd34d','#d8b4fe'];
const brandColor=name=>{if(!name)return'#94a3b8';let h=0;for(let i=0;i<name.length;i++)h=(h<<5)-h+name.charCodeAt(i)|0;return BRAND_PALETTE[Math.abs(h)%BRAND_PALETTE.length];};
/* Colore barra stock: gradiente continuo rosso→arancione→giallo→verde→ciano */
const STOCK_BAR_GRADIENT='linear-gradient(90deg,#f87171 0%,#fb923c 25%,#facc15 50%,#4ade80 75%,#22d3ee 100%)';
const fmtE=(n,v='€')=>`${v} ${Number(n||0).toFixed(2)}`;
const getSt=m=>m.stock<=0?'err':m.stock<m.soglia?'warn':'ok';
const stClr=s=>({ok:C.ok,warn:C.warn,err:C.err})[s];
const stBg=s=>({ok:C.okBg,warn:C.warnBg,err:C.errBg})[s];
const stBr=s=>({ok:C.okBr,warn:C.warnBr,err:C.errBr})[s];
const stLbl=(s,t)=>({ok:t('stk_ok'),warn:t('stk_warn'),err:t('stk_err')})[s]||s;
const stKey={'In attesa':'st_attesa','In corso':'st_corso','Completata':'st_completata','Fallita':'st_fallita','Confermato':'st_confermato','Completato':'st_completato','Annullato':'st_annullato','Annullata':'st_annullata'};
const tSt=(s,t)=>t(stKey[s])||s;
const qStaClr=s=>({In_attesa:C.warn,Confermato:C.blue,Completato:C.ok,Annullato:C.t3})[s?.replace(/ /g,'_')]||C.t3;

const NOTE_FORFETTARIO=`Prestazione svolta in regime forfettario (ex art. 1, commi 54-89, L. 190/2014 e successive modificazioni). Si richiede la non applicazione della ritenuta alla fonte a titolo d'acconto ai sensi dell'art. 1, comma 67, della medesima Legge.`;
const NOTE_OCCASIONALE=`Dichiaro sotto la mia responsabilità che il presente compenso è relativo a una prestazione del tutto occasionale (non svolgendo io lavoro autonomo in modo abituale). L'importo è fuori campo IVA (ex art. 5 D.P.R. 633/72) e non è soggetto a contributi previdenziali, poiché i miei compensi occasionali non superano il limite di 5.000 euro nell'anno solare in corso (ex art. 44 D.L. 269/2003).`;

/* ══ DEFAULTS ══ */
const DM=[
  {id:uid(),nome:'PLA Bianco',materiale:'PLA',tipo_mat:'',nome_colore:'White',codice:'',tipo:'PLA',marca:'Bambu Lab',colore:'#f0ede8',diam:'1.75mm',prezzo:22,markup:0,stock:800,soglia:200,note:''},
  {id:uid(),nome:'PLA Nero',materiale:'PLA',tipo_mat:'',nome_colore:'Black',codice:'',tipo:'PLA',marca:'Bambu Lab',colore:'#1c1c1c',diam:'1.75mm',prezzo:22,markup:0,stock:650,soglia:200,note:''},
  {id:uid(),nome:'PLA Rosso',materiale:'PLA',tipo_mat:'',nome_colore:'Red',codice:'',tipo:'PLA',marca:'Fiberlogy',colore:'#cc2200',diam:'1.75mm',prezzo:24,markup:0,stock:300,soglia:250,note:''},
  {id:uid(),nome:'PETG Trasparente',materiale:'PETG',tipo_mat:'',nome_colore:'Transparent',codice:'',tipo:'PETG',marca:'Prusament',colore:'#cce8f8',diam:'1.75mm',prezzo:28,markup:0,stock:1000,soglia:200,note:''},
  {id:uid(),nome:'ABS Nero',materiale:'ABS',tipo_mat:'',nome_colore:'Black',codice:'',tipo:'ABS',marca:'eSUN',colore:'#1a1a1a',diam:'1.75mm',prezzo:25,markup:0,stock:300,soglia:200,note:''},
  {id:uid(),nome:'ASA Grigio',materiale:'ASA',tipo_mat:'',nome_colore:'Grey',codice:'',tipo:'ASA',marca:'Polymaker',colore:'#777777',diam:'1.75mm',prezzo:32,markup:5,stock:400,soglia:200,note:''},
  {id:uid(),nome:'TPU Nero 95A',materiale:'TPU',tipo_mat:'',nome_colore:'Black',codice:'',tipo:'TPU',marca:'Polymaker',colore:'#2a2a2a',diam:'1.75mm',prezzo:38,markup:10,stock:400,soglia:150,note:''},
  {id:uid(),nome:'Resina Std Grigia',materiale:'Resin',tipo_mat:'Standard',nome_colore:'Grey',codice:'',tipo:'Resin',marca:'Elegoo',colore:'#999999',diam:'Resina',prezzo:42,markup:0,stock:1500,soglia:500,note:''},
];
const DP=[{id:'pr1',marca:'Bambu Lab',modello:'H2C',nome:'Bambu Lab H2C',e_kwh:0.40,a_h:0.08,note:'Core XY · 600mm/s'},{id:'pr2',marca:'Bambu Lab',modello:'P1S',nome:'Bambu Lab P1S',e_kwh:0.30,a_h:0.06,note:'AMS · 300mm/s'}];
const prNome=p=>(p.marca||p.modello)?[p.marca,p.modello].filter(Boolean).join(' '):p.nome||'—';
const DS={
  ragione_sociale:'La Mia Officina 3D',logo:null,
  indirizzo:'',citta:'',provincia:'',cap:'',piva:'',cf_azienda:'',
  c_kwh:0.25,m_op_default:5,tipi:[...BASE_TIPI],markup_globale:30,valuta:'€',colori_en:false,tema:{preset:TEMA_DEFAULT,custom:null},
  quick_types:['PLA','PLA+','PETG','ABS','TPU','ASA','Resin','PA (Nylon)'],
  regime:'ordinario',iva:22,ritenuta:false,
  nota_forfettario:NOTE_FORFETTARIO,nota_occasionale:NOTE_OCCASIONALE,
  materiali:[...BASE_MATERIALI],
  tipi_mat:[...BASE_TIPI_MAT],
  produttori:[...BASE_PRODUTTORI],
  nomi_colore_map:[...BASE_NOMI_COLORE_MAP],
  nomi_colore:[...BASE_NOMI_COLORE],
  servizi_extra:[{id:'sx1',nome:'Packaging',prezzo:2},{id:'sx2',nome:'Verniciatura',prezzo:15},{id:'sx3',nome:'Sacchetto',prezzo:0.5},{id:'sx4',nome:'Adesivo',prezzo:1},{id:'sx5',nome:'Modellazione 3D',prezzo:50}],
  corrieri:[{id:'cr1',nome:'GLS',servizio:'Standard',prezzo:6},{id:'cr2',nome:'BRT',servizio:'Standard',prezzo:7},{id:'cr3',nome:'SDA',servizio:'Standard',prezzo:8},{id:'cr4',nome:'Ritiro in sede',servizio:'',prezzo:0}],
  metodi_pagamento:[
    {id:'mp1',nome:'Bonifico Bancario',descrizione:'Effettuare il bonifico a:\nIBAN: IT00 0000 0000 0000 0000 0000 000\nBIC/SWIFT: XXXXXX\nIntestatario: [Ragione Sociale]\nIndicare nella causale il numero di preventivo.'},
    {id:'mp2',nome:'Contanti',descrizione:'Pagamento in contanti alla consegna o al ritiro del materiale.'},
    {id:'mp3',nome:'PayPal',descrizione:'Inviare il pagamento PayPal a: email@paypal.com\nIndicare nella causale il numero di preventivo.'},
    {id:'mp4',nome:'Satispay',descrizione:'Effettuare il pagamento tramite Satispay cercando: [Ragione Sociale]'},
  ],
};

/* ══ FORMULA ══ */
const calcCost = ({ modelli = [], c_kwh = 0.25, matsDb = [], corriere_prezzo = 0, printers = [] }) => {
  let matCost = 0;
  let energyCost = 0;
  let amortCost = 0;
  let mOp = 0;
  let serviziCost = 0;

  modelli.forEach(modello => {
    if (modello.stato === 'Annullato') return;
    const modMatCost = (modello.materials || []).reduce((s, { mat_id, peso_g = 0 }) => {
      const m = matsDb.find(x => x.id === mat_id);
      if (!m) return s;
      const base = (m.prezzo / 1000) * (+peso_g || 0) * (1 + (+m.markup || 0) / 100);
      const failMult = 1 + (+m.fallimento_pct || 0) / 100;
      return s + base * failMult;
    }, 0);
    matCost += modMatCost;

    const t_h = (+modello.ore || 0) + (+modello.min || 0) / 60;
    const printer = printers.find(p => p.id === modello.printer_id);
    
    energyCost += t_h * (printer?.e_kwh || 0) * (+c_kwh || 0);
    amortCost += t_h * (printer?.a_h || 0);

    mOp += +modello.m_op || 0;

    const modServiziCost = (modello.servizi || []).reduce((s, sv) => s + (+sv.prezzo || 0), 0);
    serviziCost += modServiziCost;
  });

  const corriereCost = +corriere_prezzo || 0;
  const total = matCost + energyCost + amortCost + mOp + serviziCost + corriereCost;

  return { matCost, energyCost, amortCost, mOp, serviziCost, corriereCost, total };
};
const calcSale=(cost,markup,markup_extra,iva,ritenuta)=>{
  const imponibile=cost*(1+(+markup||0)/100)*(1+(+markup_extra||0)/100);
  const ivaAmt=imponibile*(+iva||0)/100;
  const ritenuta_amt=ritenuta?imponibile*0.20:0;
  return{imponibile,ivaAmt,ritenuta_amt,totale:imponibile+ivaAmt-ritenuta_amt};
};

/* ══ QUOTE NUMBER ══ */
const nextQN=(quotes=[],usedNums=[])=>{
  const yy=String(new Date().getFullYear()).slice(-2);
  const pat=new RegExp(`^PREV-(\\d+)_${yy}`);
  const all=[...quotes.map(q=>q.numero),...usedNums];
  const maxN=all.reduce((mx,n)=>{const m=n?.replace(/-dup$/,'').match(pat);return m?Math.max(mx,parseInt(m[1])):mx;},0);
  return `PREV-${String(maxN+1).padStart(3,'0')}_${yy}`;
};
const nextINT=(quotes=[],usedNums=[])=>{
  const yy=String(new Date().getFullYear()).slice(-2);
  const pat=new RegExp(`^INT-(\\d+)_${yy}`);
  const all=[...quotes.map(q=>q.numero),...usedNums];
  const maxN=all.reduce((mx,n)=>{const m=n?.replace(/-dup$/,'').match(pat);return m?Math.max(mx,parseInt(m[1])):mx;},0);
  return `INT-${String(maxN+1).padStart(3,'0')}_${yy}`;
};
const isQNUsed=(num,quotes,usedNums)=>[...quotes.map(q=>q.numero),...usedNums].includes(num);

/* ══ SNAPSHOT / CHANGES ══ */
const makeSnapshot=(q,mats,printers,c_kwh)=>{
  const mat_prices={};const printer_params={};
  (q.modelli||[{printer_id:q.printer_id,materials:q.materials||[]}]).forEach(m=>{
    (m.materials||[]).forEach(({mat_id})=>{const mat=mats.find(x=>x.id===mat_id);if(mat)mat_prices[mat_id]=mat.prezzo;});
    if(m.printer_id&&!printer_params[m.printer_id]){const pr=printers.find(p=>p.id===m.printer_id);if(pr)printer_params[m.printer_id]={e_kwh:pr.e_kwh,a_h:pr.a_h};}
  });
  if(!Object.keys(printer_params).length&&q.printer_id){const pr=printers.find(p=>p.id===q.printer_id);if(pr)printer_params[q.printer_id]={e_kwh:pr.e_kwh,a_h:pr.a_h};}
  return{mat_prices,printer_params,c_kwh};
};
const detectChanges=(q,mats,printers,c_kwh,valuta='€')=>{
  const sn=q.snapshot;if(!sn)return[];const changes=[];const sm=new Set();const sp=new Set();
  const mList=q.modelli||[{printer_id:q.printer_id,materials:q.materials||[]}];
  mList.forEach(m=>{
    (m.materials||[]).forEach(({mat_id})=>{if(sm.has(mat_id))return;sm.add(mat_id);const mat=mats.find(x=>x.id===mat_id);if(!mat){changes.push(`Materiale eliminato (ID:${mat_id})`);return;}if(sn.mat_prices?.[mat_id]!==undefined&&Math.abs(mat.prezzo-sn.mat_prices[mat_id])>0.001)changes.push(`${mat.nome}: ${fmtE(sn.mat_prices[mat_id],valuta)}/kg → ${fmtE(mat.prezzo,valuta)}/kg`);});
    if(m.printer_id&&!sp.has(m.printer_id)){sp.add(m.printer_id);const pr=printers.find(p=>p.id===m.printer_id);if(!pr){changes.push('Stampante eliminata');return;}const s=sn.printer_params?.[m.printer_id];if(s){if(Math.abs((pr.e_kwh||0)-s.e_kwh)>0.0001)changes.push(`${prNome(pr)}: consumo ${s.e_kwh}kW→${pr.e_kwh}kW`);if(Math.abs((pr.a_h||0)-s.a_h)>0.0001)changes.push(`${prNome(pr)}: ammort. ${fmtE(s.a_h,valuta)}/h→${fmtE(pr.a_h,valuta)}/h`);}}
  });
  if(sn.c_kwh!==undefined&&Math.abs(c_kwh-sn.c_kwh)>0.0001)changes.push(`Energia: ${valuta}${sn.c_kwh}/kWh→${valuta}${c_kwh}/kWh`);
  return changes;
};

/* ══ HELPERS ══ */
const dlJson=(data,fn)=>{const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=fn;a.click();URL.revokeObjectURL(u);};
const openPdf = html => {
  try {
    /* Prima prova: Blob URL (funziona in tutti gli ambienti inclusi iframe/sandbox) */
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if(w){
      /* Revoca l'URL dopo 60s per liberare memoria */
      setTimeout(()=>URL.revokeObjectURL(url), 60000);
    } else {
      /* Fallback: scarica come file HTML */
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documento.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url), 5000);
    }
  } catch(e) {
    /* Ultimo fallback: metodo classico */
    const w = window.open('', '_blank');
    if(w){ w.document.write(html); w.document.close(); }
    else alert("Impossibile aprire il documento. Controlla i permessi popup del browser.");
  }
};

const buildCriticiHtml = (alerts, settings, lang='it', groupBy='tipo') => {
  const t = mkT(lang);
  const rs = settings.ragione_sociale || 'Print3D Manager';
  const date = new Date().toLocaleDateString(lang==='en'?'en-GB':'it-IT');
  /* raggruppa per tipo o per marca */
  const byGroup = {};
  alerts.forEach(m => {
    const key = groupBy==='marca' ? (m.marca||'—') : (m.materiale || m.tipo || '—');
    if (!byGroup[key]) byGroup[key] = [];
    byGroup[key].push(m);
  });
  const gruppi = Object.keys(byGroup).sort();
  const groupLabel = groupBy==='marca' ? t('inv_brand') : t('inv_typology');
  const rowsHtml = gruppi.map(g => {
    const mats = byGroup[g];
    const rows = mats.map(m => {
      const st = m.stock <= 0 ? t('crit_st_esaurito') : t('crit_st_basso');
      const stClr = m.stock <= 0 ? '#ef4444' : '#f59e0b';
      const nmDisplay = [m.materiale||m.tipo, m.tipo_mat, m.nome_colore].filter(Boolean).join(' ');
      const val = ((m.stock/1000)*m.prezzo).toFixed(2);
      const isReordered = !!m.riordinato;
      /* bobine disponibili (non esaurite) */
      const spoolsDisp=(m.spools||[]).filter(sp=>sp.stato!=='esaurita');
      const spoolsChiuse=spoolsDisp.filter(sp=>sp.stato==='chiusa').length;
      const spoolsAperte=spoolsDisp.filter(sp=>sp.stato==='aperta').length;
      const spoolInfo=spoolsDisp.length>0
        ?`${spoolsAperte}${lang==='en'?'O':'A'} / ${spoolsChiuse}C`
        :(m.spools||[]).length>0?'—':'';
      /* colore spoolInfo: verde se chiuse>0 (riserva disponibile), arancione se solo aperte, rosso se tutto esaurito */
      const spoolClr=spoolsDisp.length===0?'#ef4444':spoolsChiuse>0?'#22c55e':'#f59e0b';
      return `<tr>
        <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${m.colore||'#ccc'};margin-right:6px;vertical-align:middle"></span>
          <strong>${nmDisplay}</strong><br>
          <span style="font-size:11px;color:#666">${m.marca||''}${m.codice?` · ${m.codice}`:''}</span>
        </td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center">
          <span style="color:${stClr};font-weight:700">${m.stock}g</span>
        </td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center;color:#888;font-size:12px">min ${m.soglia}g</td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center">
          <span style="background:${stClr}22;color:${stClr};border-radius:4px;padding:2px 8px;font-size:11px;font-weight:700">${st}</span>
        </td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px;color:${spoolClr};font-weight:${spoolsDisp.length>0?'700':'400'}">
          ${spoolInfo||'—'}
        </td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:right;color:#888;font-size:12px">
          ${settings.valuta||'€'} ${val}
        </td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center">
          <span style="display:inline-block;width:14px;height:14px;border:1.5px solid ${isReordered?'#22c55e':'#aaa'};border-radius:3px;background:${isReordered?'#22c55e':'#fff'};vertical-align:middle;position:relative">
            ${isReordered?'<span style="color:#fff;font-size:10px;line-height:14px;display:block;text-align:center">✓</span>':''}
          </span>
        </td>
      </tr>`;
    }).join('');
    return `
      <tr><td colspan="6" style="padding:10px 10px 4px;background:#fafafa">
        <span style="font-weight:700;color:#333;font-size:13px">${g}</span>
        <span style="color:#888;font-size:11px;margin-left:6px">${mats.length} ${t('crit_html_items')}</span>
      </td></tr>
      ${rows}`;
  }).join('');

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8">
  <title>${t('inv_crit_title')} — ${date}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111;padding:32px;max-width:780px;margin:0 auto;font-size:13px}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:12px;border-bottom:3px solid #ef4444}
  h1{font-size:20px;font-weight:300;color:#ef4444}.co{font-size:13px;font-weight:700;color:#333}
  table{width:100%;border-collapse:collapse}th{text-align:left;padding:6px 10px;background:#f5f5f5;font-size:10px;text-transform:uppercase;color:#888;letter-spacing:.04em}
  .foot{margin-top:20px;padding-top:8px;border-top:1px solid #eee;font-size:10px;color:#bbb;text-align:center}
  @media print{body{padding:16px}}</style></head><body>
  <div class="hdr">
    <div>${settings.logo?`<img src="${settings.logo}" style="max-height:55px;max-width:160px;display:block;margin-bottom:6px" alt="">`:''}<h1>⚠ ${t('inv_crit_title')}</h1><div style="color:#999;font-size:11px;margin-top:3px">${date} · ${alerts.length} ${t('crit_html_items')} · ${groupLabel}</div></div>
    <div class="co">${rs}</div>
  </div>
  <table>
    <thead><tr>
      <th>${t('crit_html_material')}</th><th style="text-align:center">${t('crit_html_stock')}</th><th style="text-align:center">${t('crit_html_min')}</th><th style="text-align:center">${t('crit_html_status')}</th><th style="text-align:center">${t('crit_html_spools')}</th><th style="text-align:right">${t('crit_html_value')}</th><th style="text-align:center">${t('crit_reordered')}</th>
    </tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div class="foot">Print3D Manager · ${rs} · ${date}</div>
  <script>window.onload=()=>setTimeout(()=>window.print(),400);</script>
  </body></html>`;
};

const buildPdfHtml = (q, mats, printers, settings, isRicevuta = false, lang='it', isMasked = false) => {
  const t = mkT(lang);
  try {
    const regime = settings.regime || 'ordinario';
    const modelliList = q.modelli && q.modelli.length > 0 ? q.modelli : [{
      nome_modello: 'Stampa', printer_id: q.printer_id, materials: q.materials || [],
      ore: q.ore, min: q.min, m_op: q.m_op, servizi: q.servizi || [], stato: q.stato
    }];
    
    const validModelli = modelliList.filter(m => m.stato !== 'Annullato');
    const costs = calcCost({modelli: validModelli, c_kwh: settings.c_kwh, matsDb: mats, corriere_prezzo: +q.corriere_prezzo || 0, printers});
    
    const sale = calcSale(costs.total, q.markup, q.markup_extra, q.iva ?? settings.iva, q.ritenuta && regime === 'occasionale');
    const notaR = regime === 'forfettario' ? (q.nota_forfettario ?? settings.nota_forfettario) : regime === 'occasionale' ? (q.nota_occasionale ?? settings.nota_occasionale) : '';
    const tipoDoc = isRicevuta ? t('pdf_receipt') : t('pdf_quote');
    const az = settings; const rs = az.ragione_sociale || az.azienda || '';
    
    // Calcolo Moltiplicatore per inglobare il Markup
    const mkMult = isMasked ? (1 + (+q.markup || 0) / 100) * (1 + (+q.markup_extra || 0) / 100) : 1;

    let dettagliHtml = '';
    
    validModelli.forEach((mod) => {
      const pr = printers.find(p => p.id === mod.printer_id);
      const t_h = (+mod.ore || 0) + (+mod.min || 0) / 60;
      const nomeSafe = String(mod.nome_modello || 'Modello').toUpperCase();
      
      dettagliHtml += `<tr class="sub"><td colspan="3" style="font-weight:700; color:#f59e0b; padding-top:14px; padding-bottom:4px; font-size:11px;">${nomeSafe}</td></tr>`;
      
      if (isMasked) {
        // --- VERSIONE PER IL CLIENTE: RAGGRUPPATA A MACRO-VOCI ---
        
        // 1. Calcolo voce "Produzione Additiva" (Materiale + Energia + Ammortamento)
        let modMatCost = 0;
        (mod.materials || []).forEach(({mat_id, peso_g, prezzo_snapshot}) => {
          const mat = mats.find(m => m.id === mat_id);
          if (mat) {
             const p = prezzo_snapshot ?? mat.prezzo;
             const mk = +mat.markup || 0;
             modMatCost += ((p / 1000) * peso_g * (1 + mk / 100));
          }
        });
        const modEnCost = t_h * (pr?.e_kwh || 0) * (+settings.c_kwh || 0);
        const modAmCost = t_h * (pr?.a_h || 0);
        const macroProduzione = (modMatCost + modEnCost + modAmCost) * mkMult;
        
        // 2. Calcolo voce "Preparazione Tecnica" (Manodopera)
        const macroPrep = (+mod.m_op || 0) * mkMult;
        
        // Stampa le righe macro se hanno un costo
        if (macroPrep > 0) {
          dettagliHtml += `<tr><td>${t('pdf_prep')}</td><td style="color:#555">${t('pdf_prep_desc')}</td><td>€ ${macroPrep.toFixed(2)}</td></tr>`;
        }
        if (macroProduzione > 0) {
          dettagliHtml += `<tr><td>${t('pdf_additive')}</td><td style="color:#555">${t('pdf_additive_desc')}</td><td>€ ${macroProduzione.toFixed(2)}</td></tr>`;
        }
        
        // 3. Calcolo voce "Post-Processing" (Servizi extra sommati)
        let macroServizi = 0;
        if (mod.servizi && mod.servizi.length > 0) {
           mod.servizi.forEach(s => macroServizi += (+s.prezzo || 0));
           macroServizi *= mkMult;
           
           const nomiServizi = mod.servizi.map(s => s.nome).join(', ');
           dettagliHtml += `<tr><td>${t('pdf_post')}</td><td style="color:#555">${nomiServizi}</td><td>€ ${macroServizi.toFixed(2)}</td></tr>`;
        }
        // Totale parziale modello (versione cliente)
        const modTotale = macroProduzione + macroPrep + macroServizi;
        if (validModelli.length > 1) {
          dettagliHtml += `<tr style="background:#fff8e7"><td colspan="2" style="font-weight:600;font-size:11px;color:#92400e;padding:4px 10px 6px;">Totale ${nomeSafe}</td><td style="font-weight:700;color:#92400e;padding:4px 10px 6px;">€ ${modTotale.toFixed(2)}</td></tr>`;
        }
        
      } else {
        // --- VERSIONE USO INTERNO: DETTAGLIATA RIGA PER RIGA ---
        let modTotaleInt = 0;
        (mod.materials || []).forEach(({mat_id, peso_g, prezzo_snapshot}) => {
          const mat = mats.find(m => m.id === mat_id);
          if (!mat) return;
          const p = prezzo_snapshot ?? mat.prezzo;
          const mk = +mat.markup || 0;
          const costo = (p / 1000) * peso_g * (1 + mk / 100);
          modTotaleInt += costo;
          dettagliHtml += `<tr><td>${t('pdf_row_mat')}</td><td style="color:#555">${mat.nome}${mat.codice ? ` [${mat.codice}]` : ''} · ${peso_g}g${mk > 0 ? ` (+${mk}% mk)` : ''}</td><td>€ ${costo.toFixed(2)}</td></tr>`;
        });
        
        const enCost = t_h * (pr?.e_kwh || 0) * (+settings.c_kwh || 0);
        modTotaleInt += enCost;
        dettagliHtml += `<tr><td>${t('pdf_row_energy')}</td><td style="color:#555">${t_h.toFixed(2)}h × ${pr?.e_kwh || 0}kW × €${settings.c_kwh}/kWh</td><td>€ ${enCost.toFixed(2)}</td></tr>`;
        
        const amCost = t_h * (pr?.a_h || 0);
        modTotaleInt += amCost;
        dettagliHtml += `<tr><td>${t('pdf_row_amort')}</td><td style="color:#555">${t_h.toFixed(2)}h × €${pr?.a_h || 0}/h — ${pr?prNome(pr):'—'}</td><td>€ ${amCost.toFixed(2)}</td></tr>`;
        
        if (+mod.m_op > 0) { modTotaleInt += +mod.m_op; dettagliHtml += `<tr><td>${t('pdf_row_labor')}</td><td></td><td>€ ${(+mod.m_op).toFixed(2)}</td></tr>`; }
        
        (mod.servizi || []).forEach(s => {
          const sp = +s.prezzo || 0; modTotaleInt += sp;
          dettagliHtml += `<tr><td>${s.nome}</td><td></td><td>€ ${sp.toFixed(2)}</td></tr>`;
        });
        // Totale parziale modello (versione interna)
        if (validModelli.length > 1) {
          dettagliHtml += `<tr style="background:#fff8e7"><td colspan="2" style="font-weight:600;font-size:11px;color:#92400e;padding:4px 10px 6px;">Totale ${nomeSafe}</td><td style="font-weight:700;color:#92400e;padding:4px 10px 6px;">€ ${modTotaleInt.toFixed(2)}</td></tr>`;
        }
      }
    });

    const cRowCost = (+q.corriere_prezzo || 0) * mkMult;
    const cRow = q.corriere_nome ? `<tr class="sub"><td colspan="3" style="font-weight:700; color:#f59e0b; padding-top:14px; padding-bottom:4px; font-size:11px;">${t('pdf_global')}</td></tr><tr><td>${t('pdf_shipping')}</td><td style="color:#555">${q.corriere_nome}</td><td>€ ${cRowCost.toFixed(2)}</td></tr>` : '';
    
    const prodRow = !isMasked ? `<tr class="tot"><td colspan="2">${t('pdf_prod_total')}</td><td>€ ${costs.total.toFixed(2)}</td></tr>` : '';
    const impLabel = isMasked ? t('q_taxable') : `${t('q_taxable')} (mk ${q.markup||0}%${q.markup_extra>0?` + extra ${q.markup_extra}%`:''})`;
    
    const ivaR = sale.ivaAmt > 0 ? `<tr class="sub"><td colspan="2">IVA ${q.iva ?? settings.iva}%</td><td>€ ${sale.ivaAmt.toFixed(2)}</td></tr>` : '';
    const ritR = sale.ritenuta_amt > 0 ? `<tr class="sub"><td colspan="2">Ritenuta d'acconto 20%</td><td style="color:#c0392b">- € ${sale.ritenuta_amt.toFixed(2)}</td></tr>` : '';
    
    return `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><title>${tipoDoc} ${q.numero}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111;padding:40px;max-width:740px;margin:0 auto;font-size:13px}.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;padding-bottom:14px;border-bottom:3px solid #f59e0b}h1{font-size:23px;font-weight:300;color:#f59e0b}.co{font-size:14px;font-weight:700}.sub-co{font-size:11px;color:#666;line-height:1.6}.sec{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#aaa;margin:14px 0 5px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:6px 10px;background:#f5f5f5;font-size:10px;text-transform:uppercase;color:#888}td{padding:6px 10px;border-bottom:1px solid #f0f0f0;font-size:12px}td:last-child{text-align:right}.tot{background:#fff8e7;font-weight:700}.sub{background:#fafafa}.tot-box{background:#f59e0b;color:#fff;border-radius:9px;padding:15px 20px;text-align:center;margin-top:14px}.tot-box .v{font-size:28px;font-weight:700}.nota{font-size:11px;color:#555;margin-top:10px;padding:10px;background:#f9f9f9;border-radius:6px;line-height:1.7;white-space:pre-wrap}.pay-box{margin-top:10px;padding:10px;background:#f9f9f9;border-radius:6px;border-left:3px solid #f59e0b}.pay-title{font-size:11px;font-weight:700;color:#f59e0b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}.pay-method{margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #eee}.pay-method:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}.pay-name{font-size:11px;font-weight:700;color:#333;margin-bottom:2px}.pay-desc{font-size:10px;color:#666;white-space:pre-wrap;line-height:1.5}.foot{margin-top:26px;padding-top:8px;border-top:1px solid #eee;font-size:10px;color:#bbb;text-align:center}@media print{body{padding:20px}}</style></head><body><div class="hdr"><div>${az.logo?`<img src="${az.logo}" style="max-height:70px;max-width:180px;display:block;margin-bottom:8px" alt="">`:''}<h1>${tipoDoc}</h1><div style="color:#999;font-size:12px;margin-top:3px">N° ${q.numero} · ${q.data}${q.nome_progetto?` · ${q.nome_progetto}`:''}${q.validita&&!isRicevuta?` · Valido ${q.validita} giorni`:''}</div></div><div><div class="co">${rs}</div><div class="sub-co">${az.indirizzo||''}${az.citta?`<br>${az.cap||''} ${az.citta}${az.provincia?` (${az.provincia})`:''}`:''}${az.piva?`<br>P.IVA: ${az.piva}`:''}${az.cf_azienda?`<br>CF: ${az.cf_azienda}`:''}</div></div></div>${q.cliente?`<div class="sec">Cliente</div><table><tr><td style="padding:8px 10px"><strong>${q.cliente}</strong>${q.email?`<br><span style="color:#666;font-size:11px">${q.email}</span>`:''}</td></tr></table>`:''}<div class="sec">Dettaglio costi</div><table><thead><tr><th>Voce</th><th>Dettaglio</th><th style="text-align:right">€</th></tr></thead><tbody>${dettagliHtml}${cRow}${prodRow}</tbody></table><div class="sec">Riepilogo</div><table><tbody><tr><td colspan="2">${impLabel}</td><td>€ ${sale.imponibile.toFixed(2)}</td></tr>${ivaR}${ritR}<tr class="tot"><td colspan="2">TOTALE</td><td>€ ${sale.totale.toFixed(2)}</td></tr></tbody></table>${q.note?`<div class="nota"><strong>Note:</strong> ${q.note}</div>`:''}${(q.metodi_pagamento||[]).length>0?`<div class="pay-box"><div class="pay-title">${t('pdf_payment')}</div>${q.metodi_pagamento.map(mp=>{const full=(settings.metodi_pagamento||[]).find(x=>x.id===mp.id);return`<div class="pay-method"><div class="pay-name">${mp.nome}</div>${full?.descrizione?`<div class="pay-desc">${full.descrizione}</div>`:''}</div>`;}).join('')}</div>`:''} ${notaR?`<div class="nota">${notaR}</div>`:''}<div class="foot">Print3D Manager · ${rs} · ${new Date().toLocaleDateString('it-IT')}</div><script>window.onload=()=>setTimeout(()=>window.print(),400);</script></body></html>`;
  } catch (error) {
    console.error("Errore generazione PDF:", error);
    return `<html><body><h2 style="color:red">${t('pdf_error')}</h2><p>${error.message}</p></body></html>`;
  }
};


const buildRicevutaHtml=(q,rcv,settings,lang='it',isSintetica=false,isBozza=false,clients=[],mats=[],printers=[])=>{
  const t=mkT(lang);
  const az=settings||{};
  const fmtD=d=>{if(!d)return'';try{const[y,m,dd]=d.split('-');return`${dd}/${m}/${y}`;}catch{return d;}};
  const fmtE2=n=>`${az.valuta||'€'} ${(+n||0).toFixed(2)}`;
  /* Importi */
  const lordo=+(q.prezzo||0);
  const extraSum=(rcv.righe_extra||[]).reduce((s,r)=>s+(+r.costo||0),0);
  const baseImponibile=lordo+extraSum;
  const regime=rcv.regime||settings.regime||'occasionale';
  const ritenuta=regime==='occasionale'&&(rcv.ritenuta_flag!==undefined?rcv.ritenuta_flag:(q.ritenuta??settings.ritenuta??false));
  const ritenuta_amt=ritenuta?baseImponibile*0.20:0;
  const needsStamp=baseImponibile>77.47;
  const stampCost=needsStamp?2.00:0;
  const netto=baseImponibile-ritenuta_amt+stampCost;
  const notaLegale=rcv.nota_legale||(regime==='forfettario'?settings.nota_forfettario:regime==='occasionale'?settings.nota_occasionale:'')||'';
  /* Cliente: cerca dalla rubrica tramite client_id, fallback sui campi stringa del preventivo */
  const cliObj=(clients||[]).find(c=>c.id===q.client_id)||null;
  const cliName=q.cliente||[cliObj?.nome,cliObj?.cognome].filter(Boolean).join(' ')||cliObj?.azienda||'—';
  const cliAddr=cliObj?[cliObj.indirizzo,cliObj.cap,cliObj.citta,cliObj.provincia].filter(Boolean).join(', '):'';
  const cliFisc=cliObj?.piva?`P.IVA: ${cliObj.piva}`:cliObj?.cf?`C.F.: ${cliObj.cf}`:'';
  const cliEmail=q.email||cliObj?.email||'';
  /* Header azienda */
  const azName=az.ragione_sociale||`${az.nome_referente||''} ${az.cognome_referente||''}`.trim()||'';
  const azAddr=[az.indirizzo,az.cap,az.citta,az.provincia].filter(Boolean).join(', ');
  const azFisc=az.cf?`C.F.: ${az.cf}`:'';
  const isAnnullata=rcv.annullata&&!isBozza;
  const numDisplay=isBozza?'—':rcv.numero||'—';
  const dateDisplay=isBozza?'—':fmtD(rcv.data_emissione)||'—';
  /* ── Dettaglio costi dal preventivo (dettagliata = interno, sintetica = cliente) ── */
  const mkMult=isSintetica?(1+(+q.markup||0)/100)*(1+(+q.markup_extra||0)/100):1;
  const modelliList=q.modelli&&q.modelli.length>0?q.modelli:[{nome_modello:'Stampa',printer_id:q.printer_id,materials:q.materials||[],ore:q.ore,min:q.min,m_op:q.m_op,servizi:q.servizi||[],stato:q.stato}];
  const validModelli=modelliList.filter(m=>m.stato!=='Annullato');
  let dettagliHtml='';
  validModelli.forEach(mod=>{
    const pr=printers.find(p=>p.id===mod.printer_id);
    const t_h=(+mod.ore||0)+(+mod.min||0)/60;
    const nomeSafe=String(mod.nome_modello||'Modello').toUpperCase();
    dettagliHtml+=`<tr style="background:#f9f6f0"><td colspan="3" style="font-weight:700;color:#b45309;padding:8px 10px 4px;font-size:11px">${nomeSafe}</td></tr>`;
    if(isSintetica){
      let modMatCost=0;
      (mod.materials||[]).forEach(({mat_id,peso_g,prezzo_snapshot})=>{const mat=mats.find(m=>m.id===mat_id);if(mat){const p=prezzo_snapshot??mat.prezzo;const mk=+mat.markup||0;modMatCost+=((p/1000)*peso_g*(1+mk/100));}});
      const modEnCost=t_h*(pr?.e_kwh||0)*(+settings.c_kwh||0);
      const modAmCost=t_h*(pr?.a_h||0);
      const macroProd=(modMatCost+modEnCost+modAmCost)*mkMult;
      const macroPrep=(+mod.m_op||0)*mkMult;
      if(macroPrep>0)dettagliHtml+=`<tr><td>${t('pdf_prep')}</td><td style="color:#666;font-size:11px">${t('pdf_prep_desc')}</td><td style="text-align:right">${fmtE2(macroPrep)}</td></tr>`;
      if(macroProd>0)dettagliHtml+=`<tr><td>${t('pdf_additive')}</td><td style="color:#666;font-size:11px">${t('pdf_additive_desc')}</td><td style="text-align:right">${fmtE2(macroProd)}</td></tr>`;
      let macroS=0;
      if(mod.servizi&&mod.servizi.length>0){macroS=mod.servizi.reduce((s,sv)=>s+(+sv.prezzo||0),0)*mkMult;dettagliHtml+=`<tr><td>${t('pdf_post')}</td><td style="color:#666;font-size:11px">${mod.servizi.map(s=>s.nome).join(', ')}</td><td style="text-align:right">${fmtE2(macroS)}</td></tr>`;}
      if(validModelli.length>1){const modTot=macroProd+macroPrep+macroS;dettagliHtml+=`<tr style="background:#fff8e7"><td colspan="2" style="font-weight:600;font-size:11px;color:#92400e;padding:4px 6px 6px;">Totale ${nomeSafe}</td><td style="text-align:right;font-weight:700;color:#92400e;padding:4px 6px 6px;">${fmtE2(modTot)}</td></tr>`;}
    }else{
      let modTotInt=0;
      (mod.materials||[]).forEach(({mat_id,peso_g,prezzo_snapshot})=>{const mat=mats.find(m=>m.id===mat_id);if(!mat)return;const p=prezzo_snapshot??mat.prezzo;const mk=+mat.markup||0;const c=(p/1000)*peso_g*(1+mk/100);modTotInt+=c;dettagliHtml+=`<tr><td>${t('pdf_row_mat')}</td><td style="color:#666;font-size:11px">${mat.nome}${mat.codice?` [${mat.codice}]`:''} · ${peso_g}g${mk>0?` (+${mk}% mk)`:''}</td><td style="text-align:right">${fmtE2(c)}</td></tr>`;});
      const enCost=t_h*(pr?.e_kwh||0)*(+settings.c_kwh||0);modTotInt+=enCost;
      dettagliHtml+=`<tr><td>${t('pdf_row_energy')}</td><td style="color:#666;font-size:11px">${t_h.toFixed(2)}h × ${pr?.e_kwh||0}kW × ${fmtE2(settings.c_kwh)}/kWh</td><td style="text-align:right">${fmtE2(enCost)}</td></tr>`;
      const amCost=t_h*(pr?.a_h||0);modTotInt+=amCost;
      dettagliHtml+=`<tr><td>${t('pdf_row_amort')}</td><td style="color:#666;font-size:11px">${t_h.toFixed(2)}h × ${fmtE2(pr?.a_h||0)}/h${pr?` — ${prNome(pr)}`:''}</td><td style="text-align:right">${fmtE2(amCost)}</td></tr>`;
      if(+mod.m_op>0){modTotInt+=(+mod.m_op);dettagliHtml+=`<tr><td>${t('pdf_row_labor')}</td><td></td><td style="text-align:right">${fmtE2(+mod.m_op)}</td></tr>`;}
      (mod.servizi||[]).forEach(s=>{const sp=+s.prezzo||0;modTotInt+=sp;dettagliHtml+=`<tr><td>${s.nome}</td><td></td><td style="text-align:right">${fmtE2(sp)}</td></tr>`;});
      if(validModelli.length>1){dettagliHtml+=`<tr style="background:#fff8e7"><td colspan="2" style="font-weight:600;font-size:11px;color:#92400e;padding:4px 6px 6px;">Totale ${nomeSafe}</td><td style="text-align:right;font-weight:700;color:#92400e;padding:4px 6px 6px;">${fmtE2(modTotInt)}</td></tr>`;}
    }
  });
  if(q.corriere_nome){const cCost=(+q.corriere_prezzo||0)*mkMult;dettagliHtml+=`<tr style="background:#f9f6f0"><td colspan="3" style="font-weight:700;color:#b45309;padding:8px 10px 4px;font-size:11px">${t('pdf_global')}</td></tr><tr><td>${t('pdf_shipping')}</td><td style="color:#666;font-size:11px">${q.corriere_nome}</td><td style="text-align:right">${fmtE2(cCost)}</td></tr>`;}
  return`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${t('rcpt_title')} ${numDisplay}</title>
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#222;margin:0;padding:24px;max-width:700px;margin:auto;}
  h1{font-size:18px;font-weight:700;margin:0 0 2px;}
  .sub{font-size:11px;color:#666;}
  .section-title{font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:#888;margin:14px 0 4px;border-bottom:1px solid #ddd;padding-bottom:2px;}
  table.amounts{width:100%;border-collapse:collapse;margin-top:6px;}
  table.amounts td{padding:4px 6px;font-size:12px;}
  table.amounts td:last-child{text-align:right;white-space:nowrap;}
  table.amounts tr.total td{border-top:2px solid #222;font-weight:700;font-size:14px;padding-top:6px;}
  table.amounts tr.sub td{color:#888;font-size:11px;}
  .draft-banner{background:#FFF3CD;border:2px solid #FFC107;border-radius:6px;padding:8px 14px;text-align:center;font-weight:700;font-size:13px;color:#856404;margin-bottom:16px;}
  .annullata-banner{background:#FFE0E0;border:3px solid #CC0000;border-radius:6px;padding:10px 14px;text-align:center;font-weight:900;font-size:18px;color:#CC0000;margin-bottom:16px;letter-spacing:.06em;}
  .header-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}
  .stamp-box{border:2px dashed #aaa;width:55mm;height:40mm;display:flex;align-items:center;justify-content:center;font-size:9px;color:#999;text-align:center;flex-shrink:0;}
  .sign-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:18px;gap:16px;}
  .sign-block{flex:1;}
  .sign-line{border-bottom:1px solid #555;margin-top:30px;width:100%;}
  .nota{font-size:9px;color:#666;margin-top:14px;line-height:1.5;border-top:1px solid #eee;padding-top:8px;}
  @media print{body{padding:12px;}}
</style></head><body>
${isAnnullata?`<div class="annullata-banner">⛔ ${t('rcpt_cancelled')}</div>`:''}
${isBozza?`<div class="draft-banner">📋 ${t('rcpt_draft_label')}</div>`:''}
<div class="header-row">
  <div>
    ${az.logo?`<img src="${az.logo}" style="max-height:48px;max-width:140px;display:block;margin-bottom:6px" alt="">`:''}
    <h1>${azName}</h1>
    ${azAddr?`<div class="sub">${azAddr}</div>`:''}
    ${azFisc?`<div class="sub">${azFisc}</div>`:''}
  </div>
  <div style="text-align:right">
    <div style="font-size:15px;font-weight:700;color:#333">${t('rcpt_title').toUpperCase()}</div>
    <div style="font-size:12px;margin-top:4px"><strong>${t('rcpt_num')}:</strong> ${numDisplay}</div>
    <div style="font-size:12px"><strong>${t('rcpt_date')}:</strong> ${dateDisplay}</div>
    <div style="font-size:11px;color:#888"><strong>${t('rcpt_ref')}:</strong> ${q.numero||'—'}</div>
  </div>
</div>
<div class="section-title">${t('rcpt_client_section')}</div>
<div style="padding:6px 0">
  <div style="font-weight:600;font-size:13px">${cliName}</div>
  ${cliAddr?`<div class="sub">${cliAddr}</div>`:''}
  ${cliFisc?`<div class="sub">${cliFisc}</div>`:''}
  ${cliEmail?`<div class="sub">${cliEmail}</div>`:''}
</div>
<div class="section-title">${t('rcpt_object')}</div>
<div style="padding:6px 0;font-size:12px">
  ${rcv.oggetto?`<div>${rcv.oggetto}</div>`:''}
  ${rcv.periodo?`<div style="margin-top:4px;color:#555"><em>${t('rcpt_period')}: ${rcv.periodo}</em></div>`:''}
</div>
<div class="section-title">${isSintetica?t('pdf_additive'):t('pdf_row_mat').replace('Materiale','Dettaglio costi')}</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:8px">
  <thead><tr style="background:#f5f5f5"><th style="text-align:left;padding:5px 8px;font-size:10px;text-transform:uppercase;color:#888">Voce</th><th style="text-align:left;padding:5px 8px;font-size:10px;text-transform:uppercase;color:#888">Dettaglio</th><th style="text-align:right;padding:5px 8px;font-size:10px;text-transform:uppercase;color:#888">${az.valuta||'€'}</th></tr></thead>
  <tbody>${dettagliHtml}</tbody>
</table>
<div class="section-title">${t('rcpt_amounts')}</div>
<table class="amounts">
  <tr><td>${t('rcpt_gross')}</td><td>${fmtE2(lordo)}</td></tr>
  ${(rcv.righe_extra||[]).filter(r=>r.testo||r.costo).map(r=>`<tr class="sub"><td>${r.testo||'—'}</td><td style="color:${+r.costo<0?'#c0392b':'#2ecc71'}">${+r.costo<0?'−'+fmtE2(Math.abs(+r.costo)):'+'+fmtE2(+r.costo)}</td></tr>`).join('')}
  ${ritenuta_amt>0?`<tr class="sub"><td>${t('rcpt_withholding')}</td><td style="color:#c0392b">− ${fmtE2(ritenuta_amt)}</td></tr>`:''}
  ${needsStamp?`<tr class="sub"><td>${t('rcpt_stamp')}</td><td>+ ${fmtE2(stampCost)}</td></tr>`:''}
  <tr class="total"><td>${t('rcpt_net')}</td><td>${fmtE2(netto)}</td></tr>
</table>
${notaLegale?`<div class="nota">${notaLegale.replace(/\n/g,'<br>')}</div>`:''}
${isAnnullata&&rcv.motivazione_annullamento?`<div style="margin-top:14px;background:#fff0f0;border:1px solid #ffcccc;border-radius:5px;padding:8px 12px;font-size:11px;color:#880000"><strong>Motivazione annullamento:</strong> ${rcv.motivazione_annullamento}</div>`:''}
<div class="sign-row">
  <div class="sign-block">
    <div style="font-size:11px;color:#555">${t('rcpt_sign')}</div>
    <div style="font-size:11px;color:#555;margin-top:4px">${[az.nome_referente,az.cognome_referente].filter(Boolean).join(' ')}</div>
    <div class="sign-line"></div>
  </div>
  ${needsStamp&&!isAnnullata?`<div class="stamp-box"><div>${t('rcpt_stamp_note')}</div></div>`:''}
</div>
</body></html>`;};

const buildRicevutaListaHtml=(allQuotes,year,settings,lang='it')=>{
  const t=mkT(lang);
  /* Raccoglie ricevuta corrente + archivio per anno */
  const allRcpts=[];
  allQuotes.forEach(q=>{
    if(q.ricevuta?.numero&&q.ricevuta.numero.endsWith(`-${year}`))
      allRcpts.push({q,rcv:q.ricevuta});
    (q.ricevute_archivio||[]).forEach(rv=>{
      if(rv.numero&&rv.numero.endsWith(`-${year}`))allRcpts.push({q,rcv:rv});
    });
  });
  allRcpts.sort((a,b)=>(b.rcv.numero||'').localeCompare(a.rcv.numero||''));
  const fmtD=d=>{if(!d)return'—';try{const[y,m,dd]=d.split('-');return`${dd}/${m}/${y}`;}catch{return d;}};
  const az=settings||{};
  const rows=allRcpts.map(({q,rcv})=>{
    const cliName=q.cliente||'—';
    const stato=rcv.annullata?'ANNULLATA':rcv.emessa?'Emessa':'Bozza';
    const colore=rcv.annullata?'#cc0000':rcv.emessa?'#1a7a1a':'#888';
    return`<tr>
      <td>${rcv.numero||'—'}</td>
      <td>${fmtD(rcv.data_emissione)}</td>
      <td>${q.numero||'—'}</td>
      <td>${cliName}</td>
      <td style="text-align:right">${az.valuta||'€'} ${(+(q.prezzo||0)).toFixed(2)}</td>
      <td style="color:${colore};font-weight:600">${stato}</td>
    </tr>`;
  }).join('');
  return`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Lista Ricevute ${year}</title>
<style>body{font-family:Arial,sans-serif;font-size:12px;padding:20px;}h1{font-size:16px;}table{width:100%;border-collapse:collapse;margin-top:12px;}th{background:#f0f0f0;padding:6px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;}td{padding:5px 8px;border-bottom:1px solid #eee;}@media print{body{padding:10px;}}</style>
</head><body>
<h1>Lista Ricevute — ${year}</h1>
<div style="color:#888;font-size:11px;margin-bottom:8px">${az.ragione_sociale||''} · ${allRcpts.length} ricevute</div>
<table><thead><tr><th>${t('rcpt_num')}</th><th>${t('rcpt_date')}</th><th>${t('rcpt_ref')}</th><th>${t('rcpt_client_section')}</th><th style="text-align:right">Importo</th><th>Stato</th></tr></thead>
<tbody>${rows||`<tr><td colspan="6" style="text-align:center;color:#aaa;padding:20px">${t('rcpt_list_empty')}</td></tr>`}</tbody></table>
</body></html>`;};

const buildMatsListHtml=(mats,settings,lang='it',filters={})=>{
  const t=mkT(lang);
  const rs=settings.ragione_sociale||'Print3D Manager';
  const date=new Date().toLocaleDateString(lang==='en'?'en-GB':'it-IT');
  const valuta=settings.valuta||'€';
  const filterDesc=Object.values(filters).filter(Boolean).join(' · ')||'—';
  const totStock=mats.reduce((s,m)=>s+m.stock,0);
  const totVal=mats.reduce((s,m)=>s+(m.stock/1000)*m.prezzo,0);
  const rows=mats.map(m=>{
    const st=m.stock<=0?'Esaurito':m.stock<m.soglia?'Basso':'OK';
    const stClr=m.stock<=0?'#ef4444':m.stock<m.soglia?'#f59e0b':'#22c55e';
    const val=((m.stock/1000)*m.prezzo).toFixed(2);
    const nm=[m.materiale||m.tipo,m.tipo_mat,m.nome_colore].filter(Boolean).join(' ');
    const nSpool=(m.spools||[]).length;
    const nAperte=(m.spools||[]).filter(s=>s.stato==='aperta').length;
    const nChiuse=(m.spools||[]).filter(s=>s.stato==='chiusa').length;
    const spoolTxt=nSpool>0?`${nAperte}${lang==='en'?'O':'A'} / ${nChiuse}C`:'—';
    const spoolClr=nSpool===0?'#ccc':nChiuse>0?'#22c55e':nAperte>0?'#f59e0b':'#ef4444';
    return`<tr>
      <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${m.colore||'#ccc'};margin-right:6px;vertical-align:middle"></span>
        <strong>${nm||m.nome||'—'}</strong>
        ${m.marca?`<br><span style="font-size:11px;color:#666">${m.marca}${m.codice?` · ${m.codice}`:''}</span>`:''}
      </td>
      <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center">
        <span style="color:${stClr};font-weight:700">${m.stock}g</span><br>
        <span style="font-size:10px;color:#aaa">min ${m.soglia}g</span>
      </td>
      <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center">
        <span style="background:${stClr}22;color:${stClr};border-radius:4px;padding:2px 7px;font-size:11px;font-weight:700">${st}</span>
      </td>
      <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px;color:#888">${valuta} ${val}</td>
      <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px;color:${spoolClr};font-weight:${nSpool>0?'700':'400'}">${spoolTxt}</td>
      <td style="padding:5px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px;color:#666">${valuta} ${((m.prezzo)||0).toFixed(2)}/kg</td>
    </tr>`;
  }).join('');
  return`<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8">
  <title>Lista Materiali — ${date}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111;padding:32px;max-width:820px;margin:0 auto;font-size:13px}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:12px;border-bottom:3px solid #f59e0b}
  h1{font-size:20px;font-weight:300;color:#f59e0b}.co{font-size:13px;font-weight:700;color:#333}
  table{width:100%;border-collapse:collapse}th{text-align:left;padding:6px 10px;background:#f5f5f5;font-size:10px;text-transform:uppercase;color:#888;letter-spacing:.04em}
  .foot{margin-top:20px;padding-top:8px;border-top:1px solid #eee;font-size:10px;color:#bbb;text-align:center}
  .summary{display:flex;gap:20px;margin-bottom:14px;padding:8px 12px;background:#fff8e7;border-radius:6px;border:1px solid #f59e0b44}
  .sum-item{text-align:center}.sum-val{font-weight:700;color:#f59e0b;font-size:15px}.sum-lbl{font-size:10px;color:#888;margin-top:2px}
  @media print{body{padding:16px}}</style></head><body>
  <div class="hdr">
    <div>${settings.logo?`<img src="${settings.logo}" style="max-height:50px;max-width:150px;display:block;margin-bottom:6px" alt="">`:''}<h1>📦 Lista Materiali</h1><div style="color:#999;font-size:11px;margin-top:3px">${date} · ${mats.length} materiali · Filtri: ${filterDesc}</div></div>
    <div class="co">${rs}</div>
  </div>
  <div class="summary">
    <div class="sum-item"><div class="sum-val">${mats.length}</div><div class="sum-lbl">Materiali</div></div>
    <div class="sum-item"><div class="sum-val">${(totStock/1000).toFixed(2)} kg</div><div class="sum-lbl">Stock totale</div></div>
    <div class="sum-item"><div class="sum-val">${valuta} ${totVal.toFixed(2)}</div><div class="sum-lbl">Valore inv.</div></div>
    <div class="sum-item"><div class="sum-val">${mats.filter(m=>m.stock>0&&m.stock<m.soglia).length}</div><div class="sum-lbl">Stock basso</div></div>
    <div class="sum-item"><div class="sum-val">${mats.filter(m=>m.stock<=0).length}</div><div class="sum-lbl">Esauriti</div></div>
  </div>
  <table>
    <thead><tr>
      <th>Materiale</th><th style="text-align:center">Stock</th><th style="text-align:center">Stato</th><th style="text-align:center">Valore</th><th style="text-align:center">Bobine</th><th style="text-align:right">Prezzo/kg</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="foot">Print3D Manager · ${rs} · ${date}</div>
  <script>window.onload=()=>setTimeout(()=>window.print(),400);</script>
  </body></html>`;
};
const CSV_COLS=['nome','materiale','tipo_mat','nome_colore','codice','marca','colore','diam','prezzo','markup','fallimento_pct','stock','soglia','note'];
const dlCsv=(mats,fn)=>{
  const NUM_CSV=new Set(['prezzo','markup','fallimento_pct','stock','soglia']);
  const esc=v=>{
    /* numeri: usa sempre punto come separatore decimale */
    if(typeof v==='number')return String(v).replace(',','.');
    const s=String(v??'');
    /* se il campo è numerico assicura punto decimale */
    return s.includes(',')||s.includes('"')||s.includes('\n')?`"${s.replace(/"/g,'""')}"`:s;
  };
  const escField=(m,k)=>{
    const v=m[k]??'';
    if(NUM_CSV.has(k))return String(typeof v==='number'?v:parseNum(v)).replace(',','.');
    return esc(v);
  };
  const rows=[CSV_COLS.join(','),...mats.map(m=>CSV_COLS.map(k=>escField(m,k)).join(','))];
  const b=new Blob([rows.join('\r\n')],{type:'text/csv;charset=utf-8'});
  const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=fn;a.click();URL.revokeObjectURL(u);
};
/* field label map for CSV diff report */
const CSV_FIELD_LABELS={nome:'Nome',materiale:'Materiale',tipo_mat:'Tipo Mat.',nome_colore:'Nome Colore',codice:'Codice',marca:'Produttore',colore:'Colore',diam:'Formato',prezzo:'Prezzo/kg',markup:'Markup %',fallimento_pct:'Fallimento %',stock:'Stock (g)',soglia:'Soglia min (g)',note:'Note'};

/* ── Spool CSV columns ── */
const SPOOL_CSV_COLS=['materiale_id','materiale_nome','id_bobina','etichetta','peso_nominale','residuo','stato','tipo_contenitore','materiale_bobina','riutilizzabile','prezzo_acq_eur','prezzo_kg','data_acquisto','lotto','note'];

/* Genera CSV bobine da lista materiali */
const buildSpoolsCsv=(mats)=>{
  const esc=v=>{const s=String(v??'');return s.includes(',')||s.includes('"')||s.includes('\n')?`"${s.replace(/"/g,'""')}"`:s;};
  const rows=[SPOOL_CSV_COLS.join(',')];
  mats.forEach(m=>{
    (m.spools||[]).forEach(sp=>{
      rows.push(SPOOL_CSV_COLS.map(k=>{
        if(k==='materiale_id')return esc(m.id);
        if(k==='materiale_nome')return esc(m.nome||'');
        if(k==='riutilizzabile')return esc(sp.riutilizzabile?'1':'0');
        return esc(sp[k]??'');
      }).join(','));
    });
  });
  return rows.join('\r\n');
};

/* Esporta entrambi i CSV contestualmente */
const dlCsvDual=(mats,dateStr)=>{
  const esc=v=>{const s=String(v??'');return s.includes(',')||s.includes('"')||s.includes('\n')?`"${s.replace(/"/g,'""')}"`:s;};
  /* file materiali */
  const matRows=[CSV_COLS.join(','),...mats.map(m=>CSV_COLS.map(k=>esc(m[k]??'')).join(','))];
  const dlBlob=(content,fn,type='text/csv;charset=utf-8')=>{
    const b=new Blob([content],{type});
    const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=fn;a.click();
    setTimeout(()=>URL.revokeObjectURL(u),1000);
  };
  dlBlob(matRows.join('\r\n'),`materiali_${dateStr}.csv`);
  /* file bobine (anche se vuoto — mantiene struttura) */
  setTimeout(()=>dlBlob(buildSpoolsCsv(mats),`bobine_${dateStr}.csv`),300);
};

/* Parse CSV bobine e abbinamento ai materiali */
const parseCsvSpools=(text,mats=[])=>{
  if(!text||!text.trim())return{spoolsMap:{},errors:[],ok:false};
  const lines=text.trim().split(/\r?\n/);
  if(lines.length<2)return{spoolsMap:{},errors:['File bobine senza dati.'],ok:false};
  const parseRow=line=>{const cells=[];let cur='',inQ=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){if(inQ&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ;}else if(ch===','&&!inQ){cells.push(cur);cur='';}else cur+=ch;}cells.push(cur);return cells;};
  const hdr=parseRow(lines[0]).map(h=>h.trim().toLowerCase());
  const get=(cells,k)=>{const i=hdr.indexOf(k);return i>=0?(cells[i]?.trim()??''):'';};
  const errors=[];
  const spoolsMap={};/* mat_id → spools[] */
  for(let i=1;i<lines.length;i++){
    if(!lines[i].trim())continue;
    const cells=parseRow(lines[i]);
    const matId=get(cells,'materiale_id');
    const mat=mats.find(m=>m.id===matId);
    if(!mat){errors.push(`Riga ${i+1}: materiale_id "${matId}" non trovato — bobina saltata.`);continue;}
    const sp={
      id:get(cells,'id_bobina')||('sp'+Math.random().toString(36).slice(2,9)),
      etichetta:get(cells,'etichetta'),
      peso_nominale:+get(cells,'peso_nominale')||1000,
      residuo:+get(cells,'residuo')||0,
      stato:get(cells,'stato')||'chiusa',
      tipo_contenitore:get(cells,'tipo_contenitore')||'bobina_completa',
      materiale_bobina:get(cells,'materiale_bobina')||'cartone',
      riutilizzabile:get(cells,'riutilizzabile')==='1',
      prezzo_acq_eur:get(cells,'prezzo_acq_eur')!==''?+get(cells,'prezzo_acq_eur'):null,
      prezzo_kg:get(cells,'prezzo_kg')!==''?+get(cells,'prezzo_kg'):null,
      data_acquisto:get(cells,'data_acquisto'),
      lotto:get(cells,'lotto'),
      note:get(cells,'note'),
    };
    if(!spoolsMap[matId])spoolsMap[matId]=[];
    spoolsMap[matId].push(sp);
  }
  return{spoolsMap,errors,ok:true};
};
const NUM_FIELDS=new Set(['prezzo','markup','stock','soglia']);

const parseCsvMats=(text,existingMats=[])=>{
  if(!text||!text.trim())return{mats:[],diff:{created:[],updated:[],unchanged:[],removed:[]},errors:['File CSV vuoto.'],ok:false};
  const lines=text.trim().split(/\r?\n/);
  if(lines.length<2)return{mats:[],diff:{created:[],updated:[],unchanged:[],removed:[]},errors:['File CSV senza dati (solo intestazione o vuoto).'],ok:false};

  /* RFC 4180 row parser */
  const parseRow=line=>{
    const cells=[];let cur='',inQ=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){if(inQ&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ;}
      else if(ch===','&&!inQ){cells.push(cur);cur='';}
      else cur+=ch;
    }
    cells.push(cur);return cells;
  };

  const hdr=parseRow(lines[0]).map(h=>h.trim().toLowerCase());
  const get=(cells,k)=>{const i=hdr.indexOf(k);return i>=0?(cells[i]?.trim()??''):'';};
  const errors=[];
  const csvNames=new Set();
  const result=[];
  const diff={created:[],updated:[],unchanged:[],removed:[]};

  for(let i=1;i<lines.length;i++){
    if(!lines[i].trim())continue;
    const cells=parseRow(lines[i]);
    const nome=get(cells,'nome');
    if(!nome){errors.push(`Riga ${i+1}: campo "nome" mancante — riga saltata.`);continue;}
    if(csvNames.has(nome)){errors.push(`Riga ${i+1}: "${nome}" duplicato nel CSV — seconda occorrenza saltata.`);continue;}
    csvNames.add(nome);

    const existing=existingMats.find(m=>m.nome===nome);
    /* Supporto sia CSV nuovo (con materiale/tipo_mat/nome_colore) che vecchio (con tipo) */
    const csvMat=get(cells,'materiale')||tipoToMateriale(get(cells,'tipo')||'PLA');
    const csvTipoMat=get(cells,'tipo_mat')||(get(cells,'materiale')?'':tipoToTipoMat(get(cells,'tipo')||''));
    const csvNomeColore=get(cells,'nome_colore')||'';
    const nomeCalc=matNome({materiale:csvMat,tipo_mat:csvTipoMat,nome_colore:csvNomeColore})||nome;
    const parsed={
      id:existing?.id||uid(),
      nome:nomeCalc,
      materiale:csvMat,
      tipo_mat:csvTipoMat,
      nome_colore:csvNomeColore,
      tipo:csvMat,
      codice:get(cells,'codice'),
      marca:get(cells,'marca'),
      colore:get(cells,'colore')||'#888888',
      diam:get(cells,'diam')||'1.75mm',
      prezzo:parseNum(get(cells,'prezzo'))||0,
      markup:parseNum(get(cells,'markup'))||0,
      fallimento_pct:parseNum(get(cells,'fallimento_pct'))||0,
      stock:parseNum(get(cells,'stock'))||0,
      soglia:parseNum(get(cells,'soglia'))||200,
      note:get(cells,'note'),
    };
    result.push(parsed);

    if(!existing){
      diff.created.push({nome:parsed.nome,tipo:parsed.materiale,marca:parsed.marca,stock:parsed.stock,prezzo:parsed.prezzo});
    } else {
      const changes=[];
      CSV_COLS.filter(k=>k!=='nome').forEach(k=>{
        const from=NUM_FIELDS.has(k)?+existing[k]:String(existing[k]??'');
        const to=NUM_FIELDS.has(k)?parsed[k]:String(parsed[k]??'');
        if(from!==to)changes.push({field:k,label:CSV_FIELD_LABELS[k]||k,from,to});
      });
      if(changes.length>0)diff.updated.push({nome:parsed.nome,changes});
      else diff.unchanged.push({nome:parsed.nome});
    }
  }

  /* detect removed: existing mats not present in CSV */
  existingMats.forEach(m=>{
    if(!csvNames.has(m.nome))diff.removed.push({nome:m.nome,tipo:m.tipo,marca:m.marca,stock:m.stock});
  });

  return{mats:result,diff,errors,ok:result.length>0};
};

/* ══ MIGRATION ══ */
const migrateMat=m=>{
  const base={codice:'',markup:0,fallimento_pct:0,...m};
  /* v9: aggiungi campi spools e prezzo_manuale se mancanti */
  if(!base.spools)base.spools=[];
  if(base.prezzo_manuale===undefined)base.prezzo_manuale=+base.prezzo||0;
  if(base.prezzo_storico_archiviato_kg===undefined)base.prezzo_storico_archiviato_kg=0;
  if(base.qty_storica_g===undefined)base.qty_storica_g=0;
  /* Se il materiale ha già i nuovi campi, restituisce com'è */
  if(base.materiale)return base;
  /* Retrocompatibilità: estrae i nuovi campi dal vecchio campo tipo */
  const mat=tipoToMateriale(base.tipo||'');
  const tm=tipoToTipoMat(base.tipo||'');
  /* Ricava nome_colore dal nome esistente rimuovendo il prefisso tipo.
     IMPORTANTE: escapa i caratteri speciali regex (es. '+' in 'PLA+') */
  const escapedTipo=(base.tipo||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const nc=base.nome
    ?base.nome.replace(new RegExp(`^${escapedTipo}\\s*`),'').trim()
    :'';
  const nomeComposto=matNome({materiale:mat,tipo_mat:tm,nome_colore:nc})||base.nome||'';
  return{...base,materiale:mat,tipo_mat:tm,nome_colore:nc,tipo:mat,nome:nomeComposto};
};
const migratePrinter=p=>{if(p.marca!==undefined||p.modello!==undefined)return p;const nome=p.nome||'';const parts=nome.trim().split(' ');const marca=parts.length>1?parts[0]:'';const modello=parts.length>1?parts.slice(1).join(' '):nome;return{...p,marca,modello};};
const migratePrint=p=>{if(Array.isArray(p.materials)&&p.materials.length>0)return{stock_deducted:p.stato==='Completata',waste_deducted:false,quote_id:null,...p};const materials=p.mat_id?[{mat_id:p.mat_id,peso_g:+p.peso_g||0}]:[];const{mat_id,peso_g,en_h,...rest}=p;return{...rest,materials,ore:+p.ore||1,min:+p.min||0,m_op:+p.m_op||5,stock_deducted:false,waste_deducted:false,quote_id:null};};
const migrateQuote=q=>{
  let mg={stato:'In attesa',markup_extra:0,client_id:null,corriere_id:'',corriere_nome:'',corriere_prezzo:0,congelato:false,uso_interno:false,nome_progetto:'',metodi_pagamento:[],...q};
  if(mg.numero&&/^PRV-\d{4}-\d+$/.test(mg.numero)){const[,yr,n]=mg.numero.split('-');mg.numero=`PREV-${String(parseInt(n)).padStart(3,'0')}_${String(yr).slice(-2)}`;}
  if(!mg.costo_prod&&mg.costo)mg.costo_prod=mg.costo;
  if(!mg.modelli||!mg.modelli.length){
    let materials=Array.isArray(mg.materials)&&mg.materials.length?mg.materials:q.mat_id?[{mat_id:q.mat_id,peso_g:+q.peso_g||0}]:[];
    mg.modelli=[{id:uid(),nome_modello:'Modello 1',printer_id:mg.printer_id||'',materials,ore:+mg.ore||1,min:+mg.min||0,m_op:+mg.m_op||5,servizi:mg.servizi||[],stato:mg.stato==='Completato'?'Completata':mg.stato==='Annullato'?'Annullato':'In attesa'}];
  }
  return mg;
};
/* ── Ricevute: helper numerazione ── */
const rcptYear=()=>String(new Date().getFullYear());
const nextRcptNum=(rcptNums={},year=rcptYear())=>{
  const n=(rcptNums[year]||0)+1;
  return`RCPT_${String(n).padStart(3,'0')}-${year}`;
};
const consumeRcptNum=(rcptNums={},year=rcptYear())=>{
  const n=(rcptNums[year]||0)+1;
  return{newNums:{...rcptNums,[year]:n},numero:`RCPT_${String(n).padStart(3,'0')}-${year}`};
};
/* Ricevuta vuota di default */
const newRicevuta=(numero=null)=>({numero,data_emissione:null,oggetto:'',periodo:'',regime:null,nota_legale:'',righe_extra:[],pagato:false,emessa:false,annullata:false,motivazione_annullamento:''});

/* ── Normalizzazione liste: aggiorna valori legacy di materiali e tipi-mat ── */
const MAT_REMAP={'Nylon':'PA (Nylon)','Altro':'Support'};
const TIPO_MAT_REMAP={'Support for ABS':'..for ABS','Support for PLA':'..for PLA','Support for PLA/PETG':'..for PLA/PETG','for AMS':'..for AMS'};
const normalizeMateriali=arr=>[...new Set((arr||[]).map(v=>MAT_REMAP[v]||v))];
const normalizeTipiMat=arr=>{
  const r=[...new Set((arr||[]).map(v=>TIPO_MAT_REMAP[v]||v))];
  for(const v of['..for AMS','..for PLA','..for PLA/PETG','..for PA/PET'])if(!r.includes(v))r.push(v);
  return r;
};

const migrateBackup=raw=>{
  const ver=raw._version?String(raw._version):'1';
  const notes=[];
  let{mats=[],prints=[],quotes=[],printers=[],settings={},usedNums=[],clients=[]}=raw;
  mats=mats.map(migrateMat).map(m=>({...m,tipo_mat:TIPO_MAT_REMAP[m.tipo_mat]||m.tipo_mat}));prints=prints.map(migratePrint);quotes=quotes.map(migrateQuote);printers=printers.map(migratePrinter);
  if(!printers.length){printers=DP;notes.push('Stampanti default ripristinate.');}
  const nu=[...new Set([...usedNums,...quotes.map(q=>q.numero).filter(Boolean)])];
  const rawCorr=(settings.corrieri||DS.corrieri).map(c=>({servizio:'',...c}));
  /* Migra nomi_colore (string[]) → nomi_colore_map ({it,en}[]) e aggiunge nuovi colori base */
  let ncMap=settings.nomi_colore_map;
  if(!ncMap){
    const srcArr=settings.nomi_colore||BASE_NOMI_COLORE;
    ncMap=srcArr.map(name=>{
      const pair=COLOR_BILINGUAL.find(c=>c.it.toLowerCase()===name.toLowerCase()||c.en.toLowerCase()===name.toLowerCase());
      return pair||{it:name,en:name};
    });
  }
  /* Merge: aggiunge colori base non ancora presenti (nuovi colori aggiunti nelle versioni successive) */
  BASE_NOMI_COLORE_MAP.forEach(base=>{
    if(!ncMap.find(c=>c.en.toLowerCase()===base.en.toLowerCase()))ncMap.push(base);
  });
  /* Ordine alfabetico IT */
  ncMap=[...ncMap].sort((a,b)=>a.it.localeCompare(b.it,'it'));
  const ms={...DS,...settings,
    tipi:settings.tipi||DS.tipi,
    materiali:normalizeMateriali(settings.materiali||DS.materiali),
    tipi_mat:normalizeTipiMat(settings.tipi_mat||DS.tipi_mat),
    nomi_colore_map:ncMap,
    nomi_colore:ncMap.map(c=>c.en),
    servizi_extra:settings.servizi_extra||DS.servizi_extra,
    corrieri:rawCorr,
    metodi_pagamento:settings.metodi_pagamento||DS.metodi_pagamento
  };
  if(ver==='7')notes.push('Migrazione v7→v8: campi materiale/tipo_mat/nome_colore aggiunti automaticamente.');
  if(ver==='8')notes.push('Migrazione v8→v9: gestione bobine (spools) aggiunta. I materiali esistenti partono con 0 bobine.');
  if(ver==='9'){quotes=quotes.map(q=>q.ricevuta===undefined?{...q,ricevuta:null}:q);notes.push('Migrazione v9→v10: sistema ricevute aggiunto.');}
  if(ver==='9'||ver==='10'){quotes=quotes.map(q=>q.ricevute_archivio===undefined?{...q,ricevute_archivio:[]}:q);notes.push('Migrazione →v11: archivio storico ricevute aggiunto.');}
  const rcptNums=raw.rcptNums||{};
  if(ver!==DATA_VERSION)notes.push(`Formato: v${ver}→v${DATA_VERSION} (${APP_VERSION}).`);
  return{mats,prints,quotes,printers,settings:ms,usedNums:nu,clients,rcptNums,notes,sourceVersion:ver};
};
const migrateMatsOnly=raw=>{if(!Array.isArray(raw))return{mats:[],notes:['File non valido.'],ok:false};return{mats:raw.map(migrateMat),notes:[`${raw.length} materiali importati.`],ok:true};};

/* ══ UI PRIMITIVES ══ */
const inp={background:C.s3,border:`1px solid ${C.b}`,borderRadius:6,color:C.t,padding:'0.4rem 0.65rem',fontSize:'0.85rem',width:'100%',outline:'none',boxSizing:'border-box',fontFamily:'inherit'};
const ta={...inp,resize:'vertical',minHeight:68};
/* helper: normalizza stringa numerica (virgola→punto) e converte in number */
const parseNum=v=>{if(v===''||v===null||v===undefined)return 0;return+String(v).replace(',','.');};

/* Componente input numerico con stato locale stringa — preserva "1." durante la digitazione */
function InpNum({v,set,ph,style={},disabled}){
  const [local,setLocal]=useState(v==null||v===''?'':String(v));
  const prevV=useRef(v);
  useEffect(()=>{
    if(prevV.current!==v){prevV.current=v;setLocal(v==null||v===''?'':String(v));}
  },[v]);
  return(<input
    type="text"
    inputMode="decimal"
    value={local}
    disabled={disabled}
    onChange={e=>{
      const raw=e.target.value;
      if(raw===''||/^-?[\d]*[.,]?[\d]*$/.test(raw)){
        setLocal(raw);
        if(raw===''||raw==='-')set(0);
        else set(parseNum(raw));
      }
    }}
    onBlur={()=>{
      const n=parseNum(local);
      setLocal(n===0&&local!=='0'&&local!==''?'':String(n));
      set(n);
    }}
    placeholder={ph}
    style={{...inp,opacity:disabled?0.7:1,cursor:disabled?'not-allowed':'text',...style}}/>);
}

const Inp=({v,set,type='text',ph,min,max,step,style={},disabled})=>{
  if(type==='number') return <InpNum v={v} set={set} ph={ph} style={style} disabled={disabled}/>;
  return(<input type={type} value={v??''} disabled={disabled} onChange={e=>set(e.target.value)} placeholder={ph} min={min} max={max} step={step} style={{...inp,opacity:disabled?0.7:1,cursor:disabled?'not-allowed':'text',...style}}/>);
};
const Ta=({v,set,ph,rows=3})=>(<textarea value={v} onChange={e=>set(e.target.value)} placeholder={ph} rows={rows} style={ta}/>);
const Sel=({v,set,children,disabled})=>(<select value={v} onChange={e=>set(e.target.value)} disabled={disabled} style={{...inp,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1}}>{children}</select>);
const Chk=({v,set,label,disabled})=>(<label style={{display:'flex',alignItems:'center',gap:6,cursor:disabled?'not-allowed':'pointer',fontSize:'0.85rem',color:C.t2,opacity:disabled?0.5:1}}><input type="checkbox" checked={!!v} onChange={e=>!disabled&&set(e.target.checked)} style={{accentColor:C.a}}/>{label}</label>);
const Btn=({onClick,children,variant='sec',sm,full,disabled,title})=>{const vs={pri:{bg:C.a,clr:'#000',br:'none'},sec:{bg:C.s3,clr:C.t,br:`1px solid ${C.b}`},dan:{bg:C.errBg,clr:C.err,br:`1px solid ${C.errBr}`},blue:{bg:C.blueBg,clr:C.blue,br:`1px solid ${C.blueBr}`},purple:{bg:C.purpleBg,clr:C.purple,br:`1px solid ${C.purpleBr}`},ok:{bg:C.okBg,clr:C.ok,br:`1px solid ${C.okBr}`},warn:{bg:C.warnBg,clr:C.warn,br:`1px solid ${C.warnBr}`}};const v=vs[variant]||vs.sec;return(<button onClick={onClick} disabled={disabled} title={title} style={{background:v.bg,border:v.br,color:v.clr,borderRadius:6,cursor:disabled?'not-allowed':'pointer',padding:sm?'0.2rem 0.45rem':'0.4rem 0.875rem',fontWeight:variant==='pri'?600:400,opacity:disabled?0.5:1,display:'inline-flex',alignItems:'center',gap:5,fontFamily:'inherit',width:full?'100%':'auto',justifyContent:full?'center':'flex-start'}}>{children}</button>);};
const Badge=({label,color,bg})=>(<span style={{color,background:bg||`${color}18`,padding:'2px 8px',borderRadius:4,fontSize:'0.72rem',fontWeight:500,whiteSpace:'nowrap'}}>{label}</span>);
const Modal=({title,onClose,children,wide,maxWidth})=>(
  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.82)',display:'flex',alignItems:'flex-start',justifyContent:'center',zIndex:100,padding:'1.5rem 1rem',overflowY:'auto'}}>
    <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:'1.25rem',width:'100%',maxWidth:maxWidth||(wide?720:560),marginTop:'1rem',flexShrink:0}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
        <div style={{color:C.t,fontSize:'1rem',fontWeight:600}}>{title}</div>
        <button onClick={onClose} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',padding:2,display:'flex'}}><X size={16}/></button>
      </div>
      {children}
    </div>
  </div>
);
const F=({label,children,span2})=>(<div style={{gridColumn:span2?'1/-1':'span 1',marginBottom:4}}><div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:3}}>{label}</div>{children}</div>);
const StatCard=({label,val,sub,color})=>(<div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.875rem 1rem',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}><div style={{color:color||C.a,fontSize:'1.35rem',fontWeight:700,lineHeight:1}}>{val}</div><div style={{color:C.t,fontSize:'0.85rem',marginTop:3}}>{label}</div>{sub&&<div style={{color:C.t3,fontSize:'0.72rem',marginTop:1}}>{sub}</div>}</div>);

function DonutChart({data,totalLabel,centerValue,size=160}){
  const r=54;const sw=20;const circ=2*Math.PI*r;const tot=data.reduce((s,d)=>s+(d.value||0),0);let acc=0;
  const arcs=data.filter(d=>d.value>0).map(d=>{const dash=(d.value/tot)*circ;const seg={...d,dash,offset:acc};acc+=dash;return seg;});
  /* calcola dimensione font adattiva in base alla lunghezza del valore */
  const cvStr=String(centerValue??tot);
  const cvFontSize=cvStr.length<=4?20:cvStr.length<=6?16:cvStr.length<=8?13:11;
  return(<div style={{display:'flex',alignItems:'center',gap:12}}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.s2} strokeWidth={sw}/>
      <g transform={`rotate(-90,${size/2},${size/2})`}>{arcs.map((s,i)=>(<circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={sw} strokeDasharray={`${s.dash} ${circ-s.dash}`} strokeDashoffset={-s.offset}/>))}</g>
      <text x={size/2} y={size/2-5} textAnchor="middle" fill={C.t} fontSize={cvFontSize} fontWeight="700" fontFamily="system-ui" dominantBaseline="middle">{cvStr}</text>
      <text x={size/2} y={size/2+16} textAnchor="middle" fill={C.t3} fontSize="9" fontFamily="system-ui">{totalLabel}</text>
    </svg>
    <div style={{display:'grid',gridTemplateColumns:'8px auto auto',gap:'4px 6px',alignItems:'center',alignContent:'start',maxHeight:size,overflowY:'auto',minWidth:0,flexShrink:1}}>
      {data.filter(d=>d.value>0).flatMap((d,i)=>[
        <div key={`dot-${i}`} style={{width:7,height:7,borderRadius:'50%',background:d.color}}/>,
        <span key={`lbl-${i}`} style={{color:C.t2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',minWidth:0,fontSize:'0.72rem'}} title={d.label}>{d.label}</span>,
        <span key={`val-${i}`} style={{color:C.t,fontWeight:500,whiteSpace:'nowrap',fontSize:'0.72rem',paddingLeft:4}}>{d.display??d.value}</span>
      ])}
    </div>
  </div>);
}

const MatRow=({row,index,mats,onChange,onRemove,canRemove,showSnap,committedMap,inFormUsageMap, disabled})=>{
  const {t,lang,colorLang}=useT();
  const fmtV=useFmt();
  const [srch,setSrch]=useState('');
  const [open,setOpen]=useState(false);
  const ref=useRef();
  const mat=mats.find(m=>m.id===row.mat_id);
  const hasM=mat&&(+mat.markup||0)>0;
  const adjCost=mat?(mat.prezzo/1000)*(+row.peso_g||0)*(1+(+mat.markup||0)/100):0;
  const priceChanged=showSnap&&row.prezzo_snapshot!==undefined&&mat&&Math.abs(mat.prezzo-row.prezzo_snapshot)>0.001;

  /* stock dinamico */
  const realStock=mat!=null?mat.stock:null;
  const soglia=mat?.soglia||200;
  const extCommitted=mat?(committedMap?.[mat.id]||0):0;
  const totalInForm=mat?(inFormUsageMap?.[mat.id]||0):0;
  const inFormOthers=Math.max(0,totalInForm-(+row.peso_g||0));
  const netAvail=realStock!==null?realStock-extCommitted-inFormOthers:null;
  const needed=+row.peso_g||0;
  const remaining=netAvail!==null?netAvail-needed:null;
  const stkClr=remaining===null?C.t3:remaining<0?C.err:remaining<soglia?C.warn:C.ok;
  const stkLbl=remaining===null?'—':remaining<0?`−${Math.abs(remaining)}g`:`${remaining}g`;
  const totalDeductions=extCommitted+inFormOthers;
  const tooltipText=mat?`Reale: ${realStock}g${extCommitted>0?` | Imp.attivi: ${extCommitted}g`:''}${inFormOthers>0?` | Questo form altri: ${inFormOthers}g`:''} → Disp.: ${netAvail}g`:'';

  /* Filtro materiali — cerca anche il nome colore nella lingua corrente */
  const filtered=(srch.trim()
    ?mats.filter(m=>[matNomeL(m,colorLang),m.materiale||'',m.tipo_mat||'',translateColor(m.nome_colore,colorLang)||'',m.marca||'',m.codice||''].some(v=>v.toLowerCase().includes(srch.toLowerCase())))
    :mats).slice().sort((a,b)=>{
      const ma=(a.marca||'').toLowerCase();const mb=(b.marca||'').toLowerCase();
      if(ma!==mb)return ma<mb?-1:1;
      return matNomeL(a,colorLang).toLowerCase()<matNomeL(b,colorLang).toLowerCase()?-1:1;
    });

  /* Chiudi dropdown quando si clicca fuori */
  useEffect(()=>{
    if(!open)return;
    const handler=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener('mousedown',handler);
    return()=>document.removeEventListener('mousedown',handler);
  },[open]);

  const selectMat=m=>{onChange(index,'mat_id',m.id);setOpen(false);setSrch('');};

  return(
    <div style={{display:'flex',gap:5,alignItems:'center',background:C.s2,borderRadius:6,padding:'0.3rem 0.5rem',marginBottom:4,opacity:disabled?0.7:1}}>
      {mat&&<div style={{width:9,height:9,borderRadius:'50%',background:mat.colore,border:'1px solid rgba(255,255,255,0.15)',flexShrink:0}}/>}

      {/* Selettore materiale con ricerca */}
      <div ref={ref} style={{flex:'1 1 140px',position:'relative'}}>
        <button disabled={disabled} onClick={()=>!disabled&&setOpen(o=>!o)}
          style={{...inp,width:'100%',textAlign:'left',cursor:disabled?'not-allowed':'pointer',padding:'0.25rem 0.4rem',fontSize:'0.78rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:4}}>
          <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>
            {mat?matNomeL(mat,colorLang):t('mat_search_ph')}
          </span>
          <ChevronRight size={10} style={{flexShrink:0,transform:open?'rotate(90deg)':'rotate(0deg)',transition:'transform 0.15s',color:C.t3}}/>
        </button>
        {open&&(
          <div style={{position:'absolute',top:'100%',left:0,zIndex:50,background:C.s1,border:`1px solid ${C.a3}`,borderRadius:7,minWidth:220,maxWidth:320,boxShadow:'0 4px 20px rgba(0,0,0,0.4)',marginTop:2}}>
            <div style={{padding:'0.35rem'}}>
              <div style={{position:'relative'}}>
                <Search size={11} style={{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
                <input autoFocus value={srch} onChange={e=>setSrch(e.target.value)}
                  placeholder={t('search')+'...'}
                  style={{...inp,paddingLeft:'1.5rem',fontSize:'0.78rem',padding:'0.3rem 0.4rem 0.3rem 1.5rem'}}/>
              </div>
            </div>
            <div style={{maxHeight:180,overflowY:'auto',display:'grid',gridTemplateColumns:'1fr auto auto'}}>
              {filtered.length===0&&<div style={{color:C.t3,fontSize:'0.75rem',padding:'0.5rem 0.75rem',gridColumn:'1/-1'}}>{t('mat_none')}</div>}
              {filtered.map(m=>{
                const st=getSt(m);
                return(
                  <button key={m.id} onClick={()=>selectMat(m)}
                    style={{display:'grid',gridColumn:'1/-1',gridTemplateColumns:'subgrid',alignItems:'center',padding:'0.35rem 0.625rem',background:m.id===row.mat_id?C.a2:'transparent',border:'none',borderBottom:`1px solid ${C.b}`,cursor:'pointer',fontFamily:'inherit',width:'100%',gap:'0 8px'}}>
                    <span style={{display:'flex',alignItems:'center',gap:6,overflow:'hidden',minWidth:0}}>
                      <span style={{width:8,height:8,borderRadius:'50%',background:m.colore,flexShrink:0,display:'inline-block'}}/>
                      <span style={{color:C.t,fontSize:'0.78rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={matNomeL(m,colorLang)}>{matNomeL(m,colorLang)}</span>
                    </span>
                    <span style={{color:stClr(st),fontSize:'0.65rem',textAlign:'right',whiteSpace:'nowrap',paddingLeft:8}}>{m.stock}g</span>
                    {m.marca
                      ?<span style={{color:C.t3,fontSize:'0.62rem',border:`1px solid ${C.b}`,borderRadius:3,padding:'0 5px',textAlign:'right',whiteSpace:'nowrap',paddingLeft:8}}>{m.marca}</span>
                      :<span/>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <input disabled={disabled} type="number" value={row.peso_g} min={0} onChange={e=>onChange(index,'peso_g',+e.target.value)} placeholder="g"
        style={{...inp,width:58,padding:'0.25rem 0.4rem',fontSize:'0.78rem',
          borderColor:remaining!==null&&remaining<0?C.err:remaining!==null&&remaining<soglia?C.warn:''}}/>
      <span style={{color:C.t3,fontSize:'0.7rem'}}>g</span>
      {mat&&<span style={{color:hasM?C.warn:C.t3,fontSize:'0.7rem',minWidth:42}}>{fmtV(adjCost)}</span>}
      {mat&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:1,minWidth:68}} title={tooltipText}>
          <span style={{color:stkClr,fontSize:'0.68rem',background:`${stkClr}18`,borderRadius:3,padding:'1px 4px',whiteSpace:'nowrap',fontWeight:remaining!==null&&remaining<0?700:400}}>
            {remaining!==null&&remaining<0?'⚠ ':''}{stkLbl}
          </span>
          {totalDeductions>0&&<span style={{color:C.t3,fontSize:'0.6rem',whiteSpace:'nowrap'}}>imp. {totalDeductions}g</span>}
        </div>
      )}
      {priceChanged&&<span style={{color:C.warn,fontSize:'0.65rem',flexShrink:0}}>⚠</span>}
      {canRemove&&<button onClick={()=>onRemove(index)} style={{background:'none',border:'none',color:C.err,cursor:'pointer',padding:2,display:'flex',flexShrink:0}}><Minus size={13}/></button>}
    </div>
  );
};

const CostBox=({costs,markup,markup_extra,iva,ritenuta_flag,uso_interno})=>{
  const {t}=useT();
  const fmtV=useFmt();
  const sale=calcSale(costs.total,markup,markup_extra,iva,ritenuta_flag);
  if(uso_interno){
    return(<div style={{background:'rgba(245,158,11,0.08)',border:`1px solid ${C.warnBr}`,borderRadius:8,padding:'0.6rem 1rem',margin:'0.6rem 0'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',textAlign:'center',gap:4,marginBottom:6}}>
        {[[t('cb_mat'),costs.matCost],[t('cb_energy'),costs.energyCost],[t('cb_amort'),costs.amortCost],[t('cb_labor'),costs.mOp]].map(([l,v])=>(
          <div key={l}><div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',marginBottom:1}}>{l}</div><div style={{color:C.warn,fontSize:'0.8rem',fontWeight:500}}>{fmtV(v)}</div></div>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${C.warnBr}`,paddingTop:5,display:'flex',justifyContent:'center',alignItems:'center',gap:8}}>
        <span style={{color:C.t3,fontSize:'0.72rem'}}>🏭 Costo totale aziendale:</span>
        <span style={{color:C.warn,fontWeight:700,fontSize:'1rem'}}>{fmtV(costs.total)}</span>
      </div>
    </div>);
  }
  return(<div style={{background:C.a2,border:`1px solid ${C.a3}`,borderRadius:8,padding:'0.6rem 1rem',margin:'0.6rem 0'}}><div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',textAlign:'center',gap:4,marginBottom:6}}>{[[t('cb_mat'),costs.matCost],[t('cb_energy'),costs.energyCost],[t('cb_amort'),costs.amortCost],[t('cb_labor'),costs.mOp],[t('cb_services'),costs.serviziCost],[t('cb_shipping'),costs.corriereCost]].map(([l,v])=>(<div key={l}><div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',marginBottom:1}}>{l}</div><div style={{color:C.a,fontSize:'0.8rem',fontWeight:500}}>{fmtV(v)}</div></div>))}</div><div style={{borderTop:`1px solid ${C.a3}`,paddingTop:5,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:4}}><span style={{color:C.t3,fontSize:'0.72rem'}}>{t('cb_prod')} <strong style={{color:C.t}}>{fmtV(costs.total)}</strong></span><div style={{display:'flex',gap:8,alignItems:'center'}}>{sale.ivaAmt>0&&<span style={{color:C.t3,fontSize:'0.72rem'}}>IVA: <strong style={{color:C.t2}}>{fmtV(sale.ivaAmt)}</strong></span>}{sale.ritenuta_amt>0&&<span style={{color:C.err,fontSize:'0.72rem'}}>Rit.: <strong>-{fmtV(sale.ritenuta_amt)}</strong></span>}<span style={{color:C.purple,fontWeight:700,fontSize:'1rem'}}>{t('cb_tot')} {fmtV(sale.totale)}</span></div></div></div>);
};

/* ══ FORMS ══ */
function MatForm({init,settings,onSave,onClose}){
  const {t,lang,valuta,colorLang}=useT();
  const fmtV=useFmt();
  const mats_list=[...(settings.materiali||BASE_MATERIALI)].sort((a,b)=>a.localeCompare(b));
  const tipi_mat_list=[...(settings.tipi_mat||BASE_TIPI_MAT)].sort((a,b)=>a.localeCompare(b,'it'));
  const colori_map=[...(settings.nomi_colore_map||BASE_NOMI_COLORE_MAP)].sort((a,b)=>a.it.localeCompare(b.it,'it'));
  const [f,setF]=useState(()=>{
    if(init){return{...init,materiale:init.materiale||tipoToMateriale(init.tipo||'PLA'),tipo_mat:init.tipo_mat!==undefined?init.tipo_mat:tipoToTipoMat(init.tipo||''),nome_colore:init.nome_colore||'',esclude_critici:init.esclude_critici||false};}
    return{nome:'',materiale:mats_list[0]||'PLA',tipo_mat:'',nome_colore:'',codice:'',tipo:'PLA',marca:'',colore:'#e05010',diam:'1.75mm',prezzo:22,prezzo_manuale:22,markup:0,fallimento_pct:0,stock:1000,soglia:200,note:'',spools:[],esclude_critici:false};
  });
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  /* Nome colore visualizzato nella lingua corrente */
  const ncDisplay=translateColor(f.nome_colore,colorLang)||f.nome_colore;
  /* Anteprima nome composto nella lingua corrente */
  const nomePreview=[f.materiale,f.tipo_mat,ncDisplay].filter(Boolean).join(' ')||'—';
  const hasPricedSpools=(f.spools||[]).some(sp=>sp.prezzo_kg>0);
  const prezzoCalc=hasPricedSpools?calcPrezzoMedio(f.spools,f.prezzo_manuale||f.prezzo):null;
  const handleSave=()=>{
    if(!f.materiale)return;
    const prezzo=prezzoCalc||+(f.prezzo_manuale||f.prezzo)||0;
    onSave({...f,nome:matNome(f),tipo:f.materiale,prezzo,prezzo_manuale:+(f.prezzo_manuale||f.prezzo)||0});
  };
  /* Selezione dal dropdown: canonical EN */
  const selectColore=v=>{
    const pair=colori_map.find(c=>c.en===v||c.it===v);
    s('nome_colore',pair?pair.en:v);
  };
  /* Input libero: prova a trovare il canonical EN, altrimenti salva as-is */
  const typeColore=v=>{
    const translated=translateColor(v,'en');
    s('nome_colore',translated&&translated!==v?translated:v);
  };

  return(<div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
      <F label={t('mat_field_material')}><Sel v={f.materiale} set={v=>s('materiale',v)}>{mats_list.map(m=><option key={m}>{m}</option>)}</Sel></F>
      <F label={t('mat_field_type')}><Sel v={f.tipo_mat} set={v=>s('tipo_mat',v)}>{tipi_mat_list.map(ti=><option key={ti} value={ti}>{ti||'—'}</option>)}</Sel></F>
      <F label={t('mat_field_color_name')} span2>
        <Sel v={f.nome_colore} set={selectColore}>
          <option value="">— {t('mat_field_color_none')} —</option>
          {colori_map.map(pair=>(
            <option key={pair.en} value={pair.en}>{lang==='en'?pair.en:pair.it}</option>
          ))}
        </Sel>
      </F>
      <F label={t('mat_full_name')} span2>
        <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:6,padding:'0.4rem 0.65rem',color:C.a,fontWeight:500,fontSize:'0.9rem'}}>{nomePreview}</div>
      </F>
      <F label={t('mat_code')}><Inp v={f.codice} set={v=>s('codice',v)} ph="es. PLW-175"/></F>
      <F label={t('brand')}>
        <div style={{position:'relative'}}>
          <input value={f.marca} onChange={e=>s('marca',e.target.value)}
            list="produttori-list"
            placeholder="es. Bambu Lab"
            style={{...inp,width:'100%'}}/>
          <datalist id="produttori-list">
            {[...(settings.produttori||BASE_PRODUTTORI)].sort((a,b)=>a.localeCompare(b,'it',{sensitivity:'base'})).map(p=><option key={p} value={p}/>)}
          </datalist>
        </div>
      </F>
      <F label={t('format')}><Sel v={f.diam} set={v=>s('diam',v)}>{DIAMETRI.map(d=><option key={d}>{d}</option>)}</Sel></F>
      <F label={t('mat_field_visual_color')}><div style={{display:'flex',gap:5}}><input type="color" value={f.colore} onChange={e=>s('colore',e.target.value)} style={{width:34,height:32,borderRadius:4,border:`1px solid ${C.b}`,background:C.s3,cursor:'pointer',padding:2}}/><Inp v={f.colore} set={v=>s('colore',v)} style={{flex:1}}/></div></F>
      <F label={t('spool_manual_price')}>
        <Inp type="number" v={f.prezzo_manuale??f.prezzo} set={v=>{s('prezzo_manuale',v);if(!hasPricedSpools)s('prezzo',v);}} min={0} step={0.5}/>
      </F>
      {hasPricedSpools&&<F label={t('spool_prezzo_medio')}>
        <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:6,padding:'0.4rem 0.65rem',color:C.a,fontWeight:600,fontSize:'0.9rem'}}>{fmtV(prezzoCalc)}/kg</div>
        <div style={{color:C.t3,fontSize:'0.65rem',marginTop:2}}>{t('spool_prezzo_medio_hint')}</div>
      </F>}
      {!hasPricedSpools&&<F label={t('mat_kg')} style={{opacity:0.6}}>
        <Inp type="number" v={f.prezzo_manuale??f.prezzo} set={v=>{s('prezzo_manuale',v);s('prezzo',v);}} min={0} step={0.5}/>
      </F>}
      <F label={t('mat_markup_pct')}><Inp type="number" v={f.markup} set={v=>s('markup',v)} min={0} step={1}/></F>
      <F label={t('mat_fail_pct')}><Inp type="number" v={f.fallimento_pct||0} set={v=>s('fallimento_pct',v)} min={0} step={1}/><div style={{color:C.t3,fontSize:'0.68rem',marginTop:2}}>{t('mat_fail_hint')}</div></F>
      <F label={t('mat_stock_g')}><Inp type="number" v={f.stock} set={v=>s('stock',v)} min={0}/></F>
      <F label={t('mat_min_g')}><Inp type="number" v={f.soglia} set={v=>s('soglia',v)} min={0}/></F>
      <F label={t('notes')} span2><Inp v={f.note} set={v=>s('note',v)} ph={t('mat_note_ph')}/></F>
    </div>
    <div style={{display:'flex',gap:8,justifyContent:'space-between',alignItems:'center',marginTop:'0.75rem'}}>
      <label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',color:C.t2,fontSize:'0.8rem',userSelect:'none'}}>
        <input type="checkbox" checked={!!f.esclude_critici} onChange={e=>s('esclude_critici',e.target.checked)} style={{cursor:'pointer',accentColor:C.a}}/>
        {t('mat_excl_crit')}
      </label>
      <div style={{display:'flex',gap:8}}>
        <Btn onClick={onClose}>{t('cancel')}</Btn>
        <Btn onClick={handleSave} variant="pri" disabled={!f.materiale}><Plus size={13}/>{t('save')}</Btn>
      </div>
    </div>
  </div>);
}
function ClientForm({init,onSave,onClose}){
  const {t}=useT();
  const fmtV=useFmt();
  const [f,setF]=useState(init||{nome:'',cognome:'',azienda:'',email:'',telefono:'',piva:'',cf:'',note:''});const s=(k,v)=>setF(p=>({...p,[k]:v}));return(<div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}><F label={t('rb_field_name')}><Inp v={f.nome} set={v=>s('nome',v)} ph="Mario"/></F><F label={t('rb_field_surname')}><Inp v={f.cognome} set={v=>s('cognome',v)} ph="Rossi"/></F><F label={t('rb_field_company')} span2><Inp v={f.azienda} set={v=>s('azienda',v)} ph="Rossi Srl (opzionale)"/></F><F label="Email"><Inp v={f.email} set={v=>s('email',v)} ph="email@esempio.it"/></F><F label={t('rb_field_phone')}><Inp v={f.telefono} set={v=>s('telefono',v)} ph="+39 ..."/></F><div style={{gridColumn:'1/-1',borderTop:`1px solid ${C.b}`,paddingTop:8,marginTop:4}}><div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6}}>{t('rb_fiscal')}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}><F label={t('rb_piva')}><Inp v={f.piva} set={v=>s('piva',v)} ph="IT12345678901"/></F><F label={t('rb_cf')}><Inp v={f.cf} set={v=>s('cf',v)} ph="RSSMRA80A01H501U"/></F></div></div><F label={t('notes')} span2><Ta v={f.note} set={v=>s('note',v)} ph={t('rb_note_ph')} rows={2}/></F></div><div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:'0.75rem'}}><Btn onClick={onClose}>{t('cancel')}</Btn><Btn onClick={()=>(f.nome||f.cognome)&&onSave(f)} variant="pri"><Plus size={13}/>{t('save')}</Btn></div></div>);
}
function PrinterForm({init,onSave,onClose}){
  const {t}=useT();
  const fmtV=useFmt();
  const [f,setF]=useState(()=>{
    const base=init||{marca:'',modello:'',e_kwh:0.30,a_h:0.05,note:''};
    if(init&&!init.marca&&!init.modello&&init.nome){
      const parts=(init.nome||'').trim().split(' ');
      return{...base,marca:parts.length>1?parts[0]:'',modello:parts.length>1?parts.slice(1).join(' '):init.nome};
    }
    return base;
  });
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const displayNome=[f.marca,f.modello].filter(Boolean).join(' ');
  return(<div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
      <F label={t('pr_brand')}><Inp v={f.marca} set={v=>s('marca',v)} ph="es. Bambu Lab"/></F>
      <F label={t('pr_model')}><Inp v={f.modello} set={v=>s('modello',v)} ph="es. P1S"/></F>
      <F label={t('pr_consumption_label')}><Inp type="number" v={f.e_kwh} set={v=>s('e_kwh',v)} min={0} step={0.05}/></F>
      <F label={t('pr_amort_label')}><Inp type="number" v={f.a_h} set={v=>s('a_h',v)} min={0} step={0.01}/></F>
      <F label={t('pr_note_label')} span2><Inp v={f.note} set={v=>s('note',v)} ph="Core XY · AMS · 300mm/s..."/></F>
    </div>
    <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:'0.75rem'}}>
      <Btn onClick={onClose}>{t('cancel')}</Btn>
      <Btn onClick={()=>displayNome&&onSave({...f,nome:displayNome})} variant="pri"><Plus size={13}/>{t('save')}</Btn>
    </div>
  </div>);
}
function StockForm({mat,onSave,onClose}){
  const {t}=useT();
  const fmtV=useFmt();
  const [mode,setMode]=useState('set');const [val,setVal]=useState(mat.stock);const ns=mode==='set'?Math.max(0,+val):Math.max(0,mat.stock+(+val));
  const nomeCompleto=[mat.marca,mat.nome].filter(Boolean).join(' - ');
  return(<div><div style={{color:C.t2,fontSize:'0.875rem',marginBottom:'0.75rem'}}>{t('stk_of')} <strong style={{color:C.t}}>{nomeCompleto}</strong>: <strong style={{color:C.a}}>{mat.stock}g</strong></div><div style={{display:'flex',gap:6,marginBottom:'0.75rem'}}>{[['set',t('stk_set')],['add',t('stk_add')]].map(([m,l])=>(<button key={m} onClick={()=>{setMode(m);setVal(m==='set'?mat.stock:0);}} style={{flex:1,padding:'0.35rem',background:mode===m?C.a2:'transparent',border:`1px solid ${mode===m?C.a:C.b}`,color:mode===m?C.a:C.t2,borderRadius:6,cursor:'pointer',fontSize:'0.82rem',fontFamily:'inherit'}}>{l}</button>))}</div><F label={mode==='set'?t('stk_new'):t('stk_qty')}><Inp type="number" v={val} set={setVal} step={1}/></F>{mode==='add'&&<div style={{color:C.t2,fontSize:'0.82rem',margin:'0.4rem 0'}}>{t('stk_cur')}: <strong style={{color:C.a}}>{ns}g</strong></div>}<div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:'0.75rem'}}><Btn onClick={onClose}>{t('cancel')}</Btn><Btn onClick={()=>onSave(ns)} variant="pri"><RefreshCw size={13}/>{t('stk_upd')}</Btn></div></div>);
}

function SpoolManager({mat,onSave,onClose}){
  const {t,lang,valuta,colorLang}=useT();
  const fmtV=useFmt();
  const [spools,setSpools]=useState(()=>[...(mat.spools||[])]);
  const [selId,setSelId]=useState(null);
  const [isNew,setIsNew]=useState(false);
  const [det,setDet]=useState(null);
  const [pendingDelSp,setPendingDelSp]=useState(null);
  /* storico archiviato — Opzione A — dichiarati prima di prezzoMedio */
  const [storPrezzo,setStorPrezzo]=useState(+(mat.prezzo_storico_archiviato_kg)||0);
  const [storQty,setStorQty]=useState(+(mat.qty_storica_g)||0);
  /* auto-generate panel */
  const [autoGen,setAutoGen]=useState(null); /* null | {nominalG, tipo_contenitore, materiale_bobina} */
  /* riordinato: chiedi se disattivare quando si aggiunge una bobina */
  const [askRiord,setAskRiord]=useState(false);
  const [clearRiord,setClearRiord]=useState(false);

  const prezzoMedio=calcPrezzoMedio(spools,mat.prezzo_manuale??mat.prezzo,storPrezzo,storQty);
  const totStock=calcStockFromSpools(spools);
  const nAperte=spools.filter(s=>s.stato==='aperta').length;
  /* grammi di stock mat non ancora coperti dalle spools */
  const stockGap=Math.max(0,mat.stock-totStock);

  /* ordina: aperte prima, poi chiuse, poi esaurite */
  const sortedSpools=[
    ...spools.filter(s=>s.stato==='aperta'),
    ...spools.filter(s=>s.stato==='chiusa'),
    ...spools.filter(s=>s.stato==='esaurita'||s.residuo<=0),
  ];

  const selectSpool=sp=>{setDet({...sp});setIsNew(false);setSelId(sp.id);};
  const startNew=()=>{
    const isFirst=spools.length===0&&mat.stock>0;
    const ns={...newSpool(),...(isFirst?{residuo:mat.stock}:{})};
    setDet(ns);setIsNew(true);setSelId(null);
  };

  const saveDet=()=>{
    if(!det)return;
    const d=det.tipo_contenitore==='refill'?{...det,riutilizzabile:false,materiale_bobina:'nessuno'}:{...det};
    d.residuo=Math.min(+d.residuo,+d.peso_nominale);
    /* logica stato:
       - residuo parziale (0 < residuo < nominale) → forzata aperta
       - residuo = 0 → esaurita
       - residuo = nominale → rispetta la scelta manuale (aperta o chiusa) */
    if(d.residuo>0&&d.residuo<d.peso_nominale)d.stato='aperta';
    else if(d.residuo<=0)d.stato='esaurita';
    /* se residuo==nominale: d.stato resta quello scelto dall'utente nel form */
    const wasFirst=spools.length===0;
    const newSpools=isNew?[...spools,d]:spools.map(s=>s.id===d.id?d:s);
    setSpools(newSpools);
    setDet(null);setSelId(null);setIsNew(false);
    /* se è una nuova bobina e il materiale è in stato riordinato → chiedi */
    if(isNew&&mat.riordinato&&!askRiord)setAskRiord(true);
    /* dopo il primo inserimento: se rimane gap proponi auto-generate */
    if(wasFirst&&mat.stock>0){
      const gap=Math.max(0,mat.stock-calcStockFromSpools(newSpools));
      if(gap>0){
        setAutoGen({nominalG:d.peso_nominale,tipo_contenitore:d.tipo_contenitore,materiale_bobina:d.materiale_bobina});
      }
    }
  };

  const confirmDelSp=()=>{
    if(!pendingDelSp)return;
    const sp=spools.find(s=>s.id===pendingDelSp);
    /* se aveva prezzo_kg, accumula nel storico archiviato */
    if(sp&&sp.prezzo_kg>0){
      const spG=sp.peso_nominale;
      const oldVal=storPrezzo*storQty;
      const newG=storQty+spG;
      const newP=newG>0?(oldVal+sp.prezzo_kg*spG)/newG:storPrezzo;
      setStorPrezzo(newP);
      setStorQty(newG);
    }
    setSpools(ss=>ss.filter(s=>s.id!==pendingDelSp));
    if(det?.id===pendingDelSp){setDet(null);setSelId(null);}
    setPendingDelSp(null);
  };

  const applyQuick=g=>{if(!det)return;setDet(d=>({...d,residuo:Math.max(0,Math.min((+d.peso_nominale||1000),(+d.residuo||0)+g))}));};



  const handleSave=()=>{
    const newStock=calcStockFromSpools(spools);
    const newPrezzo=calcPrezzoMedio(spools,mat.prezzo_manuale??mat.prezzo,storPrezzo,storQty);
    onSave({...mat,spools,stock:newStock,
      prezzo:newPrezzo||mat.prezzo,
      prezzo_manuale:mat.prezzo_manuale??mat.prezzo,
      prezzo_storico_archiviato_kg:storPrezzo,
      qty_storica_g:storQty,
      ...(clearRiord?{riordinato:false}:{})});
  };

  const matColor=mat.colore||'#888';
  const txtC=contrastText(matColor);
  const nmDisplay=[mat.materiale||mat.tipo,mat.tipo_mat,translateColor(mat.nome_colore,colorLang)].filter(Boolean).join(' ');

  /* Esegui auto-generazione bobine per coprire il gap di stock */
  const execAutoGen=()=>{
    if(!autoGen)return;
    const{nominalG,tipo_contenitore,materiale_bobina}=autoGen;
    const gap=Math.max(0,mat.stock-calcStockFromSpools(spools));
    if(gap<=0){setAutoGen(null);return;}
    const fullCount=Math.floor(gap/nominalG);
    const remainder=gap%nominalG;
    const newSpools=[];
    const existingAutoCount=spools.filter(s=>s.etichetta?.startsWith('Auto_')).length;
    let idx=existingAutoCount+1;
    const mkLabel=()=>`Auto_${String(idx++).padStart(3,'0')}`;
    const riut=tipo_contenitore!=='refill'&&materiale_bobina==='plastica';
    for(let i=0;i<fullCount;i++){
      newSpools.push({...newSpool(),id:'sp'+uid(),etichetta:mkLabel(),peso_nominale:nominalG,residuo:nominalG,stato:'chiusa',tipo_contenitore,materiale_bobina,riutilizzabile:riut});
    }
    if(remainder>0){
      newSpools.push({...newSpool(),id:'sp'+uid(),etichetta:mkLabel(),peso_nominale:nominalG,residuo:remainder,stato:'aperta',tipo_contenitore,materiale_bobina,riutilizzabile:riut});
    }
    setSpools(ss=>[...ss,...newSpools]);
    setAutoGen(null);
  };

  /* Preview righe per auto-generate */
  const autoGenPreview=(nominalG,gap)=>{
    if(!nominalG||nominalG<=0)return[];
    const full=Math.floor(gap/nominalG);
    const rem=gap%nominalG;
    const rows=[];
    if(full>0)rows.push({label:`${full}× ${t('spool_autogen_full')} ${nominalG}g`,g:full*nominalG,full:true});
    if(rem>0)rows.push({label:`1× ${t('spool_autogen_partial')} ${rem}g`,g:rem,full:false});
    return rows;
  };

  /* barra pct per una spool */
  const SpoolBar=({sp})=>{
    const pct=sp.peso_nominale>0?Math.round((sp.residuo/sp.peso_nominale)*100):0;
    /* FIX 4: colore barra = colore residuo (rosso/giallo/verde) */
    const barClr=pct<=20?C.err:pct<=50?C.warn:C.ok;
    /* FIX 5: pallino = colore filamento mat */
    const dotClr=matColor;
    const isSel=selId===sp.id||(isNew&&sp.id===det?.id);
    /* 3 stati: esaurita=rosso, aperta=verde, chiusa=grigio */
    const isEsaurita=sp.stato==='esaurita'||sp.residuo<=0;
    const isAperta=!isEsaurita&&(sp.residuo<sp.peso_nominale||sp.stato==='aperta');
    const statoLabel=isEsaurita?t('spool_esaurita'):isAperta?t('spool_open'):t('spool_closed');
    const statoClr=isEsaurita?C.err:isAperta?C.ok:C.t3;
    const residuoClr=isEsaurita?C.err:pct<=20?C.err:pct<=50?C.warn:C.ok;
    const cardBg=isSel?C.a2:isEsaurita?C.errBg:isAperta?`${C.ok}0d`:C.s2;
    const cardBorder=isSel?C.a:isEsaurita?C.errBr:isAperta?C.okBr:C.b;
    const borderW=(isAperta||isEsaurita)&&!isSel?'2px':'1px';
    return(
      <div onClick={()=>selectSpool(sp)} style={{background:cardBg,border:`${borderW} solid ${cardBorder}`,borderRadius:8,padding:'0.6rem 0.75rem',cursor:'pointer',marginBottom:6,transition:'background 0.12s,border-color 0.12s',opacity:isEsaurita?0.85:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            {/* pallino = colore filamento */}
            <span style={{width:10,height:10,borderRadius:'50%',background:isEsaurita?C.err:dotClr,border:'1.5px solid rgba(255,255,255,0.25)',display:'inline-block',flexShrink:0}}/>
            <div style={{display:'flex',flexDirection:'column',gap:1}}>
              <span style={{color:isEsaurita?C.err:C.t,fontWeight:500,fontSize:'0.82rem',textDecoration:isEsaurita?'line-through':'none'}}>{sp.etichetta||`${sp.tipo_contenitore==='refill'?t('spool_tipo_refill'):sp.tipo_contenitore==='sample'?t('spool_tipo_sample'):t('spool_tipo_full')} · ${sp.peso_nominale}g`}</span>
              <span style={{fontSize:'0.65rem',fontWeight:700,color:statoClr}}>{statoLabel}</span>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            {!isEsaurita&&<><span style={{color:residuoClr,fontWeight:600,fontSize:'0.82rem'}}>{sp.residuo}g</span>
            <span style={{color:C.t3,fontSize:'0.68rem'}}>({pct}%)</span></>}
            {isEsaurita&&<span style={{color:C.err,fontSize:'0.72rem',background:C.errBg,padding:'1px 6px',borderRadius:3}}>0g</span>}
          </div>
        </div>
        {/* barra colore = colore residuo */}
        <div style={{height:5,background:C.s3,borderRadius:3,overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${isEsaurita?0:pct}%`,background:isEsaurita?C.err:barClr,transition:'width 0.3s',borderRadius:3}}/>
        </div>
        {sp.etichetta&&<div style={{color:C.t3,fontSize:'0.65rem',marginTop:3}}>
          {sp.tipo_contenitore==='refill'?t('spool_tipo_refill'):sp.tipo_contenitore==='sample'?t('spool_tipo_sample'):t('spool_tipo_full')} · {sp.peso_nominale}g
          {sp.prezzo_kg>0&&<span style={{marginLeft:6}}>· {fmtV(sp.prezzo_kg)}/kg{sp.prezzo_acq_eur>0?` (${valuta}${sp.prezzo_acq_eur.toFixed(2)} tot.)`:''}</span>}
        </div>}
      </div>
    );
  };

  return(
    <div>

      {/* Header materiale */}
      <div style={{background:matColor,borderRadius:8,padding:'0.6rem 0.875rem',marginBottom:'0.875rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{color:txtC,fontWeight:700,fontSize:'0.95rem'}}>{nmDisplay}</div>
          <div style={{color:txtC,fontSize:'0.7rem',opacity:0.85}}>{mat.marca}{mat.codice?` · ${mat.codice}`:''}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{color:txtC,fontWeight:700,fontSize:'1.1rem'}}>{spools.length>0?totStock:mat.stock}g</div>
          {(()=>{
            const nChiuse=spools.filter(s=>s.stato==='chiusa').length;
            const nEsaurite=spools.filter(s=>s.stato==='esaurita'||s.residuo<=0).length;
            return(
              <div style={{color:txtC,fontSize:'0.7rem',opacity:0.85}}>
                {t('spool_count')}: {nChiuse} {lang==='en'?'closed':'chiuse'} · {nAperte} {t('spool_open').toLowerCase()}
                {nEsaurite>0?` · ${nEsaurite} ${t('spool_esaurita').toLowerCase()}`:''}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Prezzo medio */}
      <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:7,padding:'0.6rem 0.75rem',marginBottom:'0.75rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.4rem'}}>
          <div>
            <div style={{color:C.t3,fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>{t('spool_prezzo_medio')}</div>
            <div style={{color:C.a,fontWeight:700,fontSize:'1.05rem'}}>{fmtV(prezzoMedio)}<span style={{fontSize:'0.7rem',fontWeight:400}}>/kg</span></div>
            <div style={{color:C.t3,fontSize:'0.62rem',marginTop:1}}>{t('spool_prezzo_medio_hint')}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{color:C.t3,fontSize:'0.68rem'}}>{t('spool_manual_price')}</div>
            <div style={{color:C.t2,fontSize:'0.85rem',fontWeight:500}}>{fmtV(mat.prezzo_manuale??mat.prezzo)}/kg</div>
            <div style={{color:C.t3,fontSize:'0.62rem'}}>{t('spool_manual_price_hint')}</div>
          </div>
        </div>
        {/* Storico archiviato — Opzione A */}
        <div style={{borderTop:`1px solid ${C.b}`,paddingTop:'0.4rem',marginTop:'0.2rem'}}>
          <div style={{color:C.t3,fontSize:'0.65rem',marginBottom:4}}>{t('spool_storico_label')}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
            <div>
              <div style={{color:C.t3,fontSize:'0.62rem',marginBottom:2}}>{t('spool_storico_prezzo')} ({valuta}/kg)</div>
              <input type="number" value={storPrezzo||''} min={0} step={0.5}
                onChange={e=>setStorPrezzo(+e.target.value||0)}
                placeholder="0"
                style={{...{background:'var(--s3,#2a2a2a)',border:`1px solid ${C.b}`,borderRadius:5,color:C.t,padding:'0.3rem 0.5rem',fontSize:'0.8rem',width:'100%',outline:'none',boxSizing:'border-box',fontFamily:'inherit'}}}/>
            </div>
            <div>
              <div style={{color:C.t3,fontSize:'0.62rem',marginBottom:2}}>{t('spool_storico_qty')} (g)</div>
              <input type="number" value={storQty||''} min={0} step={100}
                onChange={e=>setStorQty(+e.target.value||0)}
                placeholder="0"
                style={{...{background:'var(--s3,#2a2a2a)',border:`1px solid ${C.b}`,borderRadius:5,color:C.t,padding:'0.3rem 0.5rem',fontSize:'0.8rem',width:'100%',outline:'none',boxSizing:'border-box',fontFamily:'inherit'}}}/>
            </div>
          </div>
          <div style={{color:C.t3,fontSize:'0.6rem',marginTop:3}}>{t('spool_storico_hint')}</div>
        </div>
      </div>

      {/* Banner stock gap — quando le spools non coprono tutto il mat.stock */}
      {!autoGen&&spools.length>0&&stockGap>0&&(
        <div style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:7,padding:'0.5rem 0.875rem',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
          <div>
            <div style={{color:C.warn,fontWeight:600,fontSize:'0.8rem'}}>{t('spool_stock_gap')}: {stockGap}g ({(stockGap/1000).toFixed(3)} kg)</div>
            <div style={{color:C.t3,fontSize:'0.68rem'}}>{t('spool_stock_gap_hint')}</div>
          </div>
          <Btn sm onClick={()=>setAutoGen({nominalG:1000,tipo_contenitore:'bobina_completa',materiale_bobina:'plastica'})} variant="warn">
            <Archive size={11}/>{t('spool_autogen_title')}
          </Btn>
        </div>
      )}
      {pendingDelSp&&<div style={{background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:7,padding:'0.6rem 0.75rem',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{color:C.err,fontSize:'0.82rem'}}>{t('confirm_del')}</span>
        <div style={{display:'flex',gap:6}}><Btn onClick={()=>setPendingDelSp(null)}>{t('cancel')}</Btn><Btn onClick={confirmDelSp} variant="dan"><Trash2 size={12}/>{t('del')}</Btn></div>
      </div>}

      <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
        {/* ── Lista bobine (sinistra) ── */}
        <div style={{flex:'0 0 260px',minWidth:220}}>
          {spools.length===0&&!isNew&&<div style={{color:C.t3,fontSize:'0.82rem',padding:'1rem 0',textAlign:'center'}}>{t('spool_no_spools')}</div>}
          {sortedSpools.map(sp=><SpoolBar key={sp.id} sp={sp}/>)}
          {isNew&&det&&<SpoolBar key="__new__" sp={{...det,id:'__new__'}}/>}
          <Btn onClick={startNew} variant="pri" full><Plus size={13}/>{t('spool_add')}</Btn>
        </div>

        {/* ── Dettaglio accordion (destra) ── */}
        {det&&<div style={{flex:1,background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.875rem'}}>
          <div style={{color:C.t,fontWeight:600,fontSize:'0.85rem',marginBottom:'0.75rem'}}>{isNew?t('spool_new'):t('spool_detail')}</div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginBottom:'0.5rem'}}>
            <F label={t('spool_label')} span2><Inp v={det.etichetta||''} set={v=>setDet(d=>({...d,etichetta:v}))} ph="es. Printer 1, Scorta..."/></F>

            <F label={t('spool_tipo')}>
              <Sel v={det.tipo_contenitore} set={v=>setDet(d=>({...d,tipo_contenitore:v,...(v==='refill'?{riutilizzabile:false,materiale_bobina:'nessuno'}:{})}))}>
                <option value="bobina_completa">{t('spool_tipo_full')}</option>
                <option value="refill">{t('spool_tipo_refill')}</option>
                <option value="sample">{t('spool_tipo_sample')}</option>
              </Sel>
            </F>
            <F label={t('spool_mat')}>
              <Sel v={det.materiale_bobina}
                set={v=>setDet(d=>({
                  ...d,
                  materiale_bobina:v,
                  /* se si seleziona 'nessuno' su una bobina_completa → diventa refill */
                  ...(v==='nessuno'&&d.tipo_contenitore!=='refill'?{tipo_contenitore:'refill',riutilizzabile:false}:{}),
                }))}
                disabled={det.tipo_contenitore==='refill'}>
                <option value="cartone">{t('spool_mat_cartone')}</option>
                <option value="plastica">{t('spool_mat_plastica')}</option>
                <option value="nessuno">{t('spool_mat_nessuno')}</option>
              </Sel>
            </F>

            <F label={t('spool_nominal')}>
              {(()=>{
                const STD=[250,500,750,1000];
                const isCustom=!STD.includes(+det.peso_nominale);
                return(<>
                  <Sel v={isCustom?'custom':String(det.peso_nominale)}
                    set={v=>{if(v!=='custom')setDet(d=>({...d,peso_nominale:+v,residuo:Math.min(+d.residuo,+v)}));}}>
                    {STD.map(s=><option key={s} value={String(s)}>{s}g</option>)}
                    <option value="custom">{t('spool_nominal_custom')}…</option>
                  </Sel>
                  {isCustom&&<Inp type="number" v={det.peso_nominale}
                    set={v=>setDet(d=>({...d,peso_nominale:Math.max(1,+v),residuo:Math.min(+d.residuo,Math.max(1,+v))}))}
                    min={1} step={50} style={{marginTop:4}}/>}
                </>);
              })()}
            </F>
            <F label={t('spool_residuo')}>
              <div style={{display:'flex',gap:4,alignItems:'center'}}>
                <Inp type="number" v={det.residuo} set={v=>setDet(d=>({...d,residuo:Math.max(0,Math.min(+d.peso_nominale,+v))}))} min={0} max={det.peso_nominale} step={1}/>
              </div>
              <div style={{display:'flex',gap:4,marginTop:4}}>
                {[-25,-50,-100].map(g=>(
                  <button key={g} onClick={()=>applyQuick(g)} style={{background:C.s3,border:`1px solid ${C.b}`,color:C.t2,borderRadius:4,padding:'2px 7px',cursor:'pointer',fontSize:'0.7rem',fontFamily:'inherit'}}>{g}g</button>
                ))}
              </div>
            </F>

            <F label={`${t('spool_prezzo_acq')} (${valuta})`}>
              <Inp type="number" v={det.prezzo_acq_eur??''} set={v=>{
                const eur=v===''?null:+v;
                const kgPrice=eur!=null&&+det.peso_nominale>0?(eur/(+det.peso_nominale/1000)):null;
                setDet(d=>({...d,prezzo_acq_eur:eur,prezzo_kg:kgPrice!=null?Math.round(kgPrice*100)/100:null}));
              }} min={0} step={0.5} ph={t('spool_prezzo_acq_hint')}/>
              {det.prezzo_kg!=null&&det.prezzo_kg>0&&<div style={{color:C.a,fontSize:'0.7rem',marginTop:3}}>
                = {fmtV(det.prezzo_kg)}/kg
              </div>}
            </F>
            <F label={t('spool_data')}><Inp type="date" v={det.data_acquisto||''} set={v=>setDet(d=>({...d,data_acquisto:v}))}/></F>

            <F label={t('spool_lotto')}><Inp v={det.lotto||''} set={v=>setDet(d=>({...d,lotto:v}))} ph="es. BL-2025-001"/></F>
            <F label={t('notes')}><Inp v={det.note||''} set={v=>setDet(d=>({...d,note:v}))}/></F>

            <div style={{gridColumn:'1/-1'}}>
              {(()=>{const bloccoRiut=det.tipo_contenitore==='refill'||det.materiale_bobina==='nessuno'||det.materiale_bobina==='cartone';
              return <Chk v={bloccoRiut?false:det.riutilizzabile} set={v=>setDet(d=>({...d,riutilizzabile:v}))} label={t('spool_riutilizzabile')} disabled={bloccoRiut}/>;})()}
            </div>
          </div>

          {(()=>{
            const isEsauritaDet=det.stato==='esaurita'||+det.residuo<=0;
            const isPartial=!isEsauritaDet&&+det.residuo>0&&+det.residuo<+det.peso_nominale;
            /* se parziale: forzata aperta e bloccata; se completa: libera */
            return(
            <div style={{marginTop:'0.5rem',marginBottom:'0.5rem',padding:'0.4rem 0.6rem',background:isPartial?`${C.ok}10`:C.s3,border:`1px solid ${isPartial?C.okBr:C.b}`,borderRadius:6,display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" id="spool_aperta_chk"
                checked={det.stato==='aperta'}
                disabled={isPartial||isEsauritaDet}
                onChange={e=>!isPartial&&setDet(d=>({...d,stato:e.target.checked?'aperta':'chiusa'}))}
                style={{accentColor:C.ok,cursor:isPartial?'not-allowed':'pointer',width:14,height:14}}/>
              <label htmlFor="spool_aperta_chk" style={{color:isEsauritaDet?C.err:isPartial?C.ok:det.stato==='aperta'?C.ok:C.t2,fontSize:'0.82rem',cursor:isPartial||isEsauritaDet?'default':'pointer',fontWeight:isPartial||det.stato==='aperta'?600:400}}>
                {isEsauritaDet?t('spool_esaurita'):isPartial?t('spool_open_chk'):det.stato==='aperta'?t('spool_open_chk'):t('spool_closed_chk')}
              </label>
              {isEsauritaDet&&<span style={{color:C.err,fontSize:'0.68rem',marginLeft:2}}>{t('spool_esaurita_chk')}</span>}
              {!isEsauritaDet&&isPartial&&<span style={{color:C.ok,fontSize:'0.68rem',marginLeft:2}}>{t('spool_auto_open')}</span>}
              {!isEsauritaDet&&!isPartial&&<span style={{color:C.t3,fontSize:'0.68rem',marginLeft:2}}>{t('spool_full_free')}</span>}
            </div>);
          })()}
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:'0.25rem'}}>
            <Btn onClick={saveDet} variant="pri"><Plus size={13}/>{t('save')}</Btn>
            {!isNew&&<Btn onClick={()=>setPendingDelSp(det.id)} variant="dan"><Trash2 size={12}/>{t('del')}</Btn>}
            <Btn onClick={()=>{setDet(null);setSelId(null);setIsNew(false);}}>{t('cancel')}</Btn>
          </div>
        </div>}
      </div>

      {/* ── Pannello auto-generate (in fondo, visibile dopo la prima bobina) ── */}
      {(()=>{
        if(!autoGen)return null;
        const gap=Math.max(0,mat.stock-calcStockFromSpools(spools));
        const preview=autoGenPreview(autoGen.nominalG,gap);
        const STD_SIZES=[250,500,750,1000,2000];
        return(
          <div style={{background:C.blueBg,border:`2px solid ${C.blueBr}`,borderRadius:9,padding:'1rem',marginBottom:'1rem',marginTop:'0.5rem'}}>
            <div style={{color:C.blue,fontWeight:700,fontSize:'0.9rem',marginBottom:4,display:'flex',alignItems:'center',gap:6}}>
              <Archive size={14}/>{t('spool_autogen_title')}
            </div>
            <div style={{color:C.t2,fontSize:'0.78rem',marginBottom:'0.75rem',lineHeight:1.5}}>{t('spool_autogen_hint')}</div>
            <div style={{background:C.s2,borderRadius:6,padding:'0.4rem 0.75rem',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:C.t3,fontSize:'0.75rem'}}>{t('spool_autogen_remaining')}</span>
              <span style={{color:C.warn,fontWeight:700,fontSize:'1rem'}}>{gap}g <span style={{fontSize:'0.78rem',fontWeight:400,color:C.t3}}>({(gap/1000).toFixed(3)} kg)</span></span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:'0.625rem'}}>
              <div>
                <div style={{color:C.t3,fontSize:'0.68rem',marginBottom:4}}>{t('spool_autogen_nominal')}</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {STD_SIZES.map(s=>(
                    <button key={s} onClick={()=>setAutoGen(g=>({...g,nominalG:s}))}
                      style={{padding:'3px 8px',borderRadius:4,border:`1px solid ${autoGen.nominalG===s?C.blue:C.b}`,background:autoGen.nominalG===s?C.blueBg:'transparent',color:autoGen.nominalG===s?C.blue:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit'}}>
                      {s}g
                    </button>
                  ))}
                  {!STD_SIZES.includes(autoGen.nominalG)&&<input type="number" value={autoGen.nominalG}
                    onChange={e=>setAutoGen(g=>({...g,nominalG:Math.max(1,+e.target.value||1)}))}
                    min={1} step={50} style={{...inp,width:72,padding:'2px 6px',fontSize:'0.72rem'}}/>}
                </div>
              </div>
              <div>
                <div style={{color:C.t3,fontSize:'0.68rem',marginBottom:4}}>{t('spool_autogen_tipo')}</div>
                <select value={autoGen.tipo_contenitore}
                  onChange={e=>{const tc=e.target.value;setAutoGen(g=>({...g,tipo_contenitore:tc,materiale_bobina:tc==='refill'?'nessuno':g.materiale_bobina}));}}
                  style={{...inp,fontSize:'0.78rem',padding:'0.25rem 0.4rem'}}>
                  <option value="bobina_completa">{t('spool_tipo_full')}</option>
                  <option value="refill">{t('spool_tipo_refill')}</option>
                  <option value="sample">{t('spool_tipo_sample')}</option>
                </select>
              </div>
            </div>
            {preview.length>0&&(
              <div style={{background:C.s3,borderRadius:6,padding:'0.4rem 0.75rem',marginBottom:'0.75rem'}}>
                <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('spool_autogen_preview')}</div>
                {preview.map((p,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.78rem',color:p.full?C.ok:C.warn,marginBottom:2}}>
                    <span style={{width:7,height:7,borderRadius:'50%',background:p.full?C.ok:C.warn,display:'inline-block',flexShrink:0}}/>
                    {p.label}
                  </div>
                ))}
              </div>
            )}
            <div style={{display:'flex',gap:8}}>
              <Btn onClick={()=>setAutoGen(null)} full>{t('spool_autogen_skip')}</Btn>
              <Btn onClick={execAutoGen} variant="blue" full disabled={!autoGen.nominalG||preview.length===0}>
                <Archive size={13}/>{t('spool_autogen_go')}
              </Btn>
            </div>
          </div>
        );
      })()}

      {/* Banner: disattiva riordinato? */}
      {askRiord&&(
        <div style={{background:C.okBg,border:`1px solid ${C.okBr}`,borderRadius:8,padding:'0.65rem 0.875rem',marginTop:'0.75rem',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <span style={{color:C.ok,fontSize:'0.82rem',flex:1}}>✓ Bobina aggiunta. Disattivo <strong>Riordinato</strong>?</span>
          <div style={{display:'flex',gap:6}}>
            <button onClick={()=>{setClearRiord(true);setAskRiord(false);}}
              style={{background:C.ok,color:'#000',border:'none',borderRadius:5,padding:'3px 12px',cursor:'pointer',fontSize:'0.78rem',fontWeight:600,fontFamily:'inherit'}}>Sì</button>
            <button onClick={()=>{setClearRiord(false);setAskRiord(false);}}
              style={{background:'none',color:C.t2,border:`1px solid ${C.b}`,borderRadius:5,padding:'3px 10px',cursor:'pointer',fontSize:'0.78rem',fontFamily:'inherit'}}>No</button>
          </div>
        </div>
      )}
      {clearRiord&&(
        <div style={{color:C.ok,fontSize:'0.75rem',marginTop:4}}>✓ Riordinato verrà disattivato al salvataggio.</div>
      )}

      {/* Footer salva tutto */}
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:'1rem',paddingTop:'0.875rem',borderTop:`1px solid ${C.b}`}}>
        <Btn onClick={onClose}>{t('cancel')}</Btn>
        <Btn onClick={handleSave} variant="pri"><Archive size={13}/>{t('save')} ({spools.length} {t('spool_count')})</Btn>
      </div>
    </div>
  );
}

function WasteForm({print,mats,onSave,onClose}){
  const {t}=useT();
  const initQty=print.materials.map(m=>({mat_id:m.mat_id,peso_g:0}));
  const [deduct,setDeduct]=useState(true);
  const [qtys,setQtys]=useState(initQty);
  const setQ=(i,v)=>setQtys(q=>q.map((x,j)=>j===i?{...x,peso_g:Math.max(0,+v)}:x));
  return(
    <div>
      <div style={{color:C.t2,fontSize:'0.85rem',marginBottom:'0.875rem',lineHeight:1.5}}>
        La stampa <strong style={{color:C.t}}>{print.nome}</strong> è stata dichiarata <span style={{color:C.err,fontWeight:600}}>{t('waste_failed_label')}</span>.<br/>
        <span style={{color:C.t3,fontSize:'0.78rem'}}>{t('waste_intro')}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'0.75rem',background:C.s2,borderRadius:6,padding:'0.5rem 0.75rem'}}>
        <input type="checkbox" id="waste_chk" checked={deduct} onChange={e=>setDeduct(e.target.checked)} style={{accentColor:C.err,cursor:'pointer',width:14,height:14}}/>
        <label htmlFor="waste_chk" style={{color:C.t,fontSize:'0.85rem',cursor:'pointer'}}>{t('waste_checkbox')}</label>
      </div>
      {deduct&&(
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:'0.875rem'}}>
          {print.materials.map((m,i)=>{
            const mat=mats.find(x=>x.id===m.mat_id);
            const stk=mat?.stock??0;
            const stkClr=stk<=0?C.err:stk<(mat?.soglia||200)?C.warn:C.ok;
            return(
              <div key={i} style={{background:C.s2,borderRadius:6,padding:'0.4rem 0.625rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                  {mat&&<div style={{width:8,height:8,borderRadius:'50%',background:mat.colore,flexShrink:0}}/>}
                  <span style={{color:C.t,fontSize:'0.82rem',flex:1}}>{mat?.nome||t('waste_unknown_mat')}</span>
                  <span style={{color:C.t3,fontSize:'0.72rem'}}>{t('waste_expected')}: <strong style={{color:C.t2}}>{m.peso_g}g</strong></span>
                  <span style={{color:stkClr,fontSize:'0.72rem'}}>{t('stock')}: <strong>{stk}g</strong></span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <label style={{color:C.t3,fontSize:'0.75rem',minWidth:120}}>{t('waste_consumed_label')}:</label>
                  <input type="number" value={qtys[i].peso_g} min={0} max={m.peso_g} onChange={e=>setQ(i,e.target.value)}
                    style={{...inp,width:80,padding:'0.2rem 0.4rem',fontSize:'0.82rem'}}/>
                  <button onClick={()=>setQ(i,Math.min(m.peso_g,stk))} style={{background:'none',border:`1px solid ${C.b}`,color:C.t3,borderRadius:4,padding:'2px 7px',cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit'}}>Max</button>
                  {qtys[i].peso_g>0&&<span style={{color:C.t3,fontSize:'0.72rem'}}>{t('waste_new_stock')}: {Math.max(0,stk-qtys[i].peso_g)}g</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <Btn onClick={()=>onSave(false,[])}>{t('waste_skip')}</Btn>
        {deduct&&<Btn onClick={()=>onSave(true,qtys)} variant="dan"><Trash2 size={13}/>{t('waste_scale')}</Btn>}
        {!deduct&&<Btn onClick={()=>onSave(false,[])} variant="pri">{t('waste_confirm')}</Btn>}
      </div>
    </div>
  );
}

function PrintForm({mats,printers,settings,quotes,prints,init,isEdit,onSave,onClose}){
  const {t}=useT();
  const fmtV=useFmt();
  const [f,setF]=useState(()=>init||{nome:'',data:new Date().toISOString().slice(0,10),printer_id:printers[0]?.id||'',materials:[{mat_id:mats[0]?.id||'',peso_g:20}],ore:1,min:0,stato:'In attesa',cliente:'',note:'',m_op:+(settings.m_op_default)||5,quote_id:null,stock_deducted:false,waste_deducted:false});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  
  const committedMap=calcCommitted(prints||[],init?.id?[init.id]:[]);
  const inFormUsageMap=f.materials.reduce((acc,m)=>{acc[m.mat_id]=(acc[m.mat_id]||0)+(+m.peso_g||0);return acc;},{});
  
  const chg=(i,k,v)=>{const ms=[...f.materials];ms[i]={...ms[i],[k]:v};s('materials',ms);};
  const lQ=f.quote_id?quotes.find(q=>q.id===f.quote_id):null;

  // --- RECUPERO SERVIZI EXTRA DAL PREVENTIVO ---
  // Prendiamo solo i servizi extra associati a questo specifico modello
  const linkedMod = lQ ? (lQ.modelli || []).find(m => m.id === f.quote_model_id) : null;
  const myServizi = linkedMod ? (linkedMod.servizi || []) : [];

  // Calcoliamo i costi IN TEMPO REALE (inclusi i servizi extra, ma ESCLUSI corriere e markup)
  const modelloTmp=[{printer_id:f.printer_id,materials:f.materials,ore:f.ore,min:f.min,m_op:+f.m_op||0,servizi:myServizi,stato:'In attesa'}];
  const costs=calcCost({modelli:modelloTmp,c_kwh:settings.c_kwh,matsDb:mats,corriere_prezzo:0,printers});

  // --- LOGICHE DI BLOCCO ---
  const rcptLocked = !!(lQ?.ricevuta?.emessa && !lQ?.ricevuta?.annullata);
  const technicalLocked = rcptLocked || f.stato === 'In corso' || f.stato === 'Completata';
  const anagraficaLocked = rcptLocked || technicalLocked || (isEdit && f.stato === 'In attesa');
  
  return(
    <div>
      {lQ&&<div style={{background:C.blueBg,border:`1px solid ${C.blueBr}`,borderRadius:6,padding:'0.4rem 0.75rem',fontSize:'0.8rem',color:C.blue,marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:5}}>
        <FileText size={13}/>
        {t('print_form_linked_q')} <strong>{lQ.numero}</strong> — {lQ.cliente} {lQ.nome_progetto ? ` — ${t('print_project')}: ${lQ.nome_progetto}` : ''}
      </div>}
      
      {/* AVVISI VISIVI */}
      {rcptLocked&&(
        <div style={{color:C.err,background:C.errBg,border:`1px solid ${C.errBr}`,padding:'8px 12px',borderRadius:'6px',fontSize:'0.85rem',marginBottom:'12px',fontWeight:500}}>
          {t('print_rcpt_locked')}
        </div>
      )}
      {!rcptLocked&&technicalLocked && (
        <div style={{ color: f.stato === 'Completata' ? C.ok : '#d97706', background: f.stato === 'Completata' ? `${C.ok}15` : 'rgba(217, 119, 6, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '12px', fontWeight: 500, border: `1px solid ${f.stato === 'Completata' ? C.ok : '#d97706'}` }}>
          {f.stato === 'Completata' ? `✅ ${t('st_completata')}: ${t('print_tech_locked')}` : `⚠️ ${t('st_corso')}: ${t('print_tech_locked')}`}
        </div>
      )}
      {!rcptLocked&&anagraficaLocked && !technicalLocked && (
        <div style={{ color: C.t2, background: C.s1, border: `1px solid ${C.b}`, padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
          {t('print_form_wait_lock')}
        </div>
      )}
      
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
        <F label={t('print_ref_label')} span2><Inp v={f.nome} set={v=>s('nome',v)} ph="es. Supporto smartphone" disabled={anagraficaLocked}/></F>
        <F label={t('date_label')}><input type="date" value={f.data} onChange={e=>s('data',e.target.value)} disabled={anagraficaLocked} style={{...inp, opacity: anagraficaLocked ? 0.7 : 1, cursor: anagraficaLocked ? 'not-allowed' : 'text'}}/></F>
        <F label={t('print_client')}><Inp v={f.cliente} set={v=>s('cliente',v)} ph={t('q_customer_ph')} disabled={anagraficaLocked}/></F>
        <F label={t('print_printer')} span2>
          <Sel v={f.printer_id} set={v=>s('printer_id',v)} disabled={technicalLocked}>
            {printers.map(p=><option key={p.id} value={p.id}>{prNome(p)}</option>)}
          </Sel>
        </F>
      </div>
      
      <div style={{margin:'0.4rem 0'}}>
        <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('print_form_materials')}</div>
        {f.materials.map((row,i)=>(
          <MatRow 
            key={i} 
            row={row} 
            index={i} 
            mats={mats} 
            onChange={chg} 
            onRemove={idx=>s('materials',f.materials.filter((_,j)=>j!==idx))} 
            canRemove={f.materials.length>1 && !technicalLocked} 
            committedMap={committedMap} 
            inFormUsageMap={inFormUsageMap} 
            disabled={technicalLocked} 
          />
        ))}
        {!technicalLocked && (
          <button onClick={()=>s('materials',[...f.materials,{mat_id:mats[0]?.id||'',peso_g:10}])} style={{background:'none',border:`1px dashed ${C.b}`,color:C.t3,borderRadius:5,padding:'0.2rem 0.6rem',cursor:'pointer',fontSize:'0.75rem',display:'flex',alignItems:'center',gap:3,fontFamily:'inherit',marginTop:4}}>
            <Plus size={11}/>{t('print_form_add_mat')}
          </button>
        )}
      </div>
      
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.5rem'}}>
        <F label={t('print_hours')}><Inp type="number" v={f.ore} set={v=>s('ore',v)} min={0} disabled={technicalLocked}/></F>
        <F label={t('print_min')}><Inp type="number" v={f.min} set={v=>s('min',v)} min={0} max={59} disabled={technicalLocked}/></F>
        <F label={t('print_labor')}><Inp type="number" v={f.m_op} set={v=>s('m_op',v)} min={0} step={0.5} disabled={technicalLocked}/></F>
        <F label={t('print_status')}><Sel v={f.stato} set={v=>s('stato',v)} disabled={rcptLocked}>{PRINT_STATI.map(st=><option key={st} value={st}>{tSt(st,t)}</option>)}</Sel></F>
      </div>
      
      <F label={t('notes')}><Inp v={f.note} set={v=>s('note',v)} ph={t('print_note_ph')} disabled={rcptLocked}/></F>
      
      {/* DETTAGLIO COSTI IN TEMPO REALE */}
      {isEdit&&(
        <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.75rem',marginBottom:'0.4rem'}}>
          <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8}}>{t('print_cost_detail')}</div>
          {/* Riga voci singole */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6,marginBottom:8}}>
            {[[t('cb_mat'),costs.matCost,C.teal],[t('cb_energy'),costs.energyCost,C.blue],[t('cb_amort'),costs.amortCost,C.purple],[t('cb_labor'),costs.mOp,C.warn],[t('cb_services'),costs.serviziCost,C.ok]].map(([l,v,clr])=>(
              <div key={l} style={{background:C.s3,borderRadius:6,padding:'0.4rem 0.5rem',textAlign:'center'}}>
                <div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',marginBottom:2}}>{l}</div>
                <div style={{color:v>0?clr:C.t3,fontSize:'0.82rem',fontWeight:600}}>{fmtV(v)}</div>
              </div>
            ))}
          </div>
          {/* Totale */}
          <div style={{background:C.a2,border:`1px solid ${C.a3}`,borderRadius:6,padding:'0.4rem 0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{color:C.t2,fontSize:'0.78rem',fontWeight:500}}>{t('print_form_total_prod')}</span>
            <span style={{color:C.a,fontWeight:700,fontSize:'1rem'}}>{fmtV(costs.total)}</span>
          </div>
        </div>
      )}
      
      {isEdit&&<div style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:6,padding:'0.4rem 0.75rem',fontSize:'0.75rem',color:C.warn,margin:'0.4rem 0'}}>{t('print_stock_info')}</div>}
      
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:'0.5rem'}}>
        <Btn onClick={onClose}>{t('cancel')}</Btn>
        <Btn onClick={()=>f.nome&&onSave({...f,costo:costs.total,cost_detail:costs})} variant="pri">
          <Printer size={13}/>{isEdit?t('print_save'):t('print_reg')}
        </Btn>
      </div>
    </div>
  );
}

function QuoteForm({mats,printers,settings,quotes,clients,usedNums,prints,init,isEdit,onSave,onClose}){
  const {t,lang,colorLang}=useT();
  const fmtV=useFmt();
  const iva=settings.regime==='ordinario'?+settings.iva:0;

  const defaultModello = {
    id: uid(),
    nome_modello: 'Modello 1',
    printer_id: init?.printer_id || printers[0]?.id || '',
    materials: init?.materials || [{mat_id:mats[0]?.id||'',peso_g:20,prezzo_snapshot:mats[0]?.prezzo}],
    ore: init?.ore || 1,
    min: init?.min || 0,
    m_op: init?.m_op !== undefined ? init.m_op : (+(settings.m_op_default)||5),
    servizi: init?.servizi || [],
    stato: init?.stato || 'In attesa'
  };

  const initModelli = init?.modelli?.length > 0 ? init.modelli : [defaultModello];
  const isInternalInit = init?.uso_interno || false;

  const [f,setF]=useState(init||{
    numero: isEdit?(init?.numero||''):(isInternalInit?nextINT(quotes,usedNums):nextQN(quotes,usedNums)),
    data:new Date().toISOString().slice(0,10),
    client_id:'',cliente:'',email:'',telefono:'',
    nome_progetto:'',
    modelli:initModelli,
    markup:+(settings.markup_globale)||30,markup_extra:0,note:'',validita:30,
    stato:'In attesa',congelato:false,
    corriere_id:'',corriere_nome:'',corriere_prezzo:0,
    iva,ritenuta:!!settings.ritenuta,uso_interno:false,metodi_pagamento:[]
  });
  const [numErr,setNumErr]=useState('');
  const ss=(k,v)=>setF(p=>({...p,[k]:v}));

  /* quando si attiva/disattiva uso_interno aggiorna numero e cliente */
  const toggleInterno=(val)=>{
    setF(p=>({
      ...p,
      uso_interno:val,
      numero: isEdit ? p.numero : (val ? nextINT(quotes,usedNums) : nextQN(quotes,usedNums)),
      cliente: val ? (settings.ragione_sociale||p.cliente) : p.cliente,
      markup: val ? 0 : (+(settings.markup_globale)||30),
      markup_extra: val ? 0 : p.markup_extra,
      iva: val ? 0 : iva,
      ritenuta: val ? false : p.ritenuta,
      corriere_id: val ? '' : p.corriere_id,
      corriere_nome: val ? '' : p.corriere_nome,
      corriere_prezzo: val ? 0 : p.corriere_prezzo,
    }));
  };

  /* toggle metodo pagamento */
  const togglePayment=(mp)=>{
    setF(p=>{
      const cur=p.metodi_pagamento||[];
      const exists=cur.find(x=>x.id===mp.id);
      return{...p,metodi_pagamento:exists?cur.filter(x=>x.id!==mp.id):[...cur,{id:mp.id,nome:mp.nome}]};
    });
  };

  const selCl=cid=>{ss('client_id',cid);const cl=clients.find(c=>c.id===cid);if(cl){ss('cliente',[cl.nome,cl.cognome].filter(Boolean).join(' ')+(cl.azienda?` (${cl.azienda})`:''));ss('email',cl.email||'');ss('telefono',cl.telefono||'');}};
  const selCorr=cid=>{const cr=(settings.corrieri||[]).find(c=>c.id===cid);ss('corriere_id',cid);ss('corriere_nome',cr?[cr.nome,cr.servizio].filter(Boolean).join(' — '):'');ss('corriere_prezzo',+cr?.prezzo||0);};

  const costsModelli=f.uso_interno?f.modelli.map(m=>({...m,m_op:0,servizi:[]})):f.modelli;
  const costs=calcCost({modelli:costsModelli, c_kwh:settings.c_kwh, matsDb:mats, corriere_prezzo:f.uso_interno?0:(+f.corriere_prezzo||0), printers});
  /* stock impegnato: escludi le stampe già collegate a questo preventivo (in modifica) */
  const excludedPrintIds=isEdit&&init?.id?(prints||[]).filter(p=>p.quote_id===init.id).map(p=>p.id):[];
  const committedMap=calcCommitted(prints||[],excludedPrintIds);
  /* inFormUsageMap: totale grammi per mat_id in tutti i modelli del form corrente */
  const inFormUsageMap=f.modelli.reduce((acc,mod)=>{
    (mod.materials||[]).forEach(m=>{acc[m.mat_id]=(acc[m.mat_id]||0)+(+m.peso_g||0);});
    return acc;
  },{});
  const isModelLocked = (modId) => {
    if (!isEdit || !init?.id) return false;
    const linkedPrint = (prints || []).find(p => p.quote_id === init.id && p.quote_model_id === modId);
    return linkedPrint && linkedPrint.stato === 'In corso';
  };

  const chgMod = (mIdx, k, v) => {
    const newMods = [...f.modelli];
    newMods[mIdx] = { ...newMods[mIdx], [k]: v };
    ss('modelli', newMods);
  };

  const chgMat = (mIdx, matIdx, k, v) => {
    const newMods = [...f.modelli];
    const ms = [...newMods[mIdx].materials];
    ms[matIdx] = { ...ms[matIdx], [k]: v };
    if(k==='mat_id'){
      const m=mats.find(x=>x.id===v);
      ms[matIdx].prezzo_snapshot=m?.prezzo;
    }
    newMods[mIdx].materials = ms;
    ss('modelli', newMods);
  };

  const addMat = (mIdx) => {
    const newMods = [...f.modelli];
    const m=mats[0];
    newMods[mIdx].materials.push({mat_id:m?.id||'',peso_g:10,prezzo_snapshot:m?.prezzo});
    ss('modelli', newMods);
  };

  const removeMat = (mIdx, matIdx) => {
    const newMods = [...f.modelli];
    newMods[mIdx].materials = newMods[mIdx].materials.filter((_, j) => j !== matIdx);
    ss('modelli', newMods);
  };

  const toggleSv = (mIdx, sv) => {
    const newMods = [...f.modelli];
    const has = newMods[mIdx].servizi.find(x => x.id === sv.id);
    newMods[mIdx].servizi = has 
      ? newMods[mIdx].servizi.filter(x => x.id !== sv.id) 
      : [...newMods[mIdx].servizi, {id:sv.id,nome:sv.nome,prezzo:sv.prezzo}];
    ss('modelli', newMods);
  };

  const chgSvPrice = (mIdx, svId, price) => {
    const newMods = [...f.modelli];
    newMods[mIdx].servizi = newMods[mIdx].servizi.map(x => x.id === svId ? {...x, prezzo: price} : x);
    ss('modelli', newMods);
  };

  const addModello = () => {
    ss('modelli', [...f.modelli, {
      id: uid(), nome_modello: `Modello ${f.modelli.length + 1}`, printer_id: printers[0]?.id || '',
      materials: [{mat_id:mats[0]?.id||'',peso_g:20,prezzo_snapshot:mats[0]?.prezzo}],
      ore: 1, min: 0, m_op: +(settings.m_op_default)||5, servizi: [], stato: 'In attesa'
    }]);
  };

  const removeModello = (mIdx) => {
    ss('modelli', f.modelli.filter((_, i) => i !== mIdx));
  };

  const handleSave=()=>{
    if(!f.cliente){setNumErr('Inserisci il cliente');return;}
    if(!isEdit&&isQNUsed(f.numero,quotes,usedNums)){setNumErr(`Numero "${f.numero}" già usato`);return;}
    setNumErr('');

    let qStato = 'In attesa';
    const nonAnnullati = f.modelli.filter(m => m.stato !== 'Annullato');
    if (nonAnnullati.length > 0) {
      if (nonAnnullati.every(m => m.stato === 'Completata')) qStato = 'Completato';
      else if (nonAnnullati.some(m => m.stato === 'In corso')) qStato = 'Confermato';
      else if (nonAnnullati.some(m => m.stato === 'Fallita')) qStato = 'In attesa';
    } else if (f.modelli.length > 0) {
      qStato = 'Annullato';
    }

    const mWithSnap = f.modelli.map(mod => ({
      ...mod,
      m_op: f.uso_interno ? 0 : mod.m_op,
      servizi: f.uso_interno ? [] : mod.servizi,
      materials: mod.materials.map(m => {
        if(m.prezzo_snapshot!==undefined) return m;
        const mat=mats.find(x=>x.id===m.mat_id);
        return {...m, prezzo_snapshot: mat?.prezzo};
      })
    }));

    /* per uso interno markup/iva/corriere sempre azzerati */
    const effMarkup = f.uso_interno ? 0 : f.markup;
    const effMarkupExtra = f.uso_interno ? 0 : f.markup_extra;
    const effIva = f.uso_interno ? 0 : f.iva;
    const effRitenuta = f.uso_interno ? false : (f.ritenuta&&settings.regime==='occasionale');
    const sale=calcSale(costs.total,effMarkup,effMarkupExtra,effIva,effRitenuta);
    onSave({...f, modelli: mWithSnap, stato: isEdit ? f.stato : qStato,
      markup:effMarkup, markup_extra:effMarkupExtra, iva:effIva, ritenuta:effRitenuta&&settings.regime==='occasionale',
      costo_prod:costs.total, prezzo:sale.totale, imponibile:sale.imponibile,
      iva_amt:sale.ivaAmt, ritenuta_amt:sale.ritenuta_amt, cost_detail:costs});
  };

  const sale=calcSale(costs.total,f.uso_interno?0:+f.markup||0,f.uso_interno?0:+f.markup_extra||0,f.uso_interno?0:f.iva,(!f.uso_interno)&&f.ritenuta&&settings.regime==='occasionale');

  return(<div>
    {/* ── Checkbox uso interno ── */}
    <div style={{background:f.uso_interno?'rgba(245,158,11,0.08)':'transparent',border:`1px solid ${f.uso_interno?C.warnBr:C.b}`,borderRadius:8,padding:'0.6rem 0.875rem',marginBottom:'0.75rem',display:'flex',alignItems:'flex-start',gap:10}}>
      <input type="checkbox" id="uso_interno_chk" checked={!!f.uso_interno} onChange={e=>toggleInterno(e.target.checked)} style={{accentColor:C.warn,marginTop:3,cursor:'pointer',width:15,height:15}}/>
      <label htmlFor="uso_interno_chk" style={{cursor:'pointer',flex:1}}>
        <div style={{color:f.uso_interno?C.warn:C.t,fontSize:'0.88rem',fontWeight:f.uso_interno?600:400}}>🏭 {t('q_uso_interno')}</div>
        <div style={{color:C.t3,fontSize:'0.72rem',marginTop:2,lineHeight:1.4}}>{t('q_uso_interno_hint')}</div>
      </label>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}><F label={t('q_num')}><Inp v={f.numero} set={v=>{ss('numero',v);setNumErr('');}} />{numErr&&<div style={{color:C.err,fontSize:'0.72rem',marginTop:2}}>{numErr}</div>}</F><F label="Data"><input type="date" value={f.data} onChange={e=>ss('data',e.target.value)} style={inp}/></F></div>
    <div style={{marginBottom:'0.5rem'}}><F label={t('q_nome_progetto')}><Inp v={f.nome_progetto||''} set={v=>ss('nome_progetto',v)} ph={t('q_nome_progetto_ph')}/></F></div>
    {clients.length>0&&!f.uso_interno&&<div style={{marginBottom:'0.5rem'}}><div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:3}}>{t('q_from_rb')}</div><Sel v={f.client_id||''} set={v=>v&&selCl(v)}><option value="">{t('q_pick_rb')}</option>{clients.map(c=><option key={c.id} value={c.id}>{[c.nome,c.cognome].filter(Boolean).join(' ')}{c.azienda?` (${c.azienda})`:''}</option>)}</Sel></div>}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem', marginBottom: '1rem'}}>
      <F label={t('q_customer')}><Inp v={f.cliente} set={v=>ss('cliente',v)} ph={f.uso_interno?settings.ragione_sociale:t('q_customer_ph')}/></F>
      {!f.uso_interno&&<F label={t('q_validity')}><Inp type="number" v={f.validita} set={v=>ss('validita',v)} min={1}/></F>}
      {!f.uso_interno&&<F label="Email"><Inp v={f.email} set={v=>ss('email',v)} ph="email@..."/></F>}
      {!f.uso_interno&&<F label={t('rb_field_phone')}><Inp v={f.telefono} set={v=>ss('telefono',v)} ph="+39..."/></F>}
    </div>
    
    <div style={{marginBottom:'1rem', borderTop: `1px solid ${C.b}`, paddingTop: '1rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
        <div style={{color:C.t,fontSize:'1rem',fontWeight:500}}>{t('q_models')}</div>
        <Btn onClick={addModello} variant="pri" sm><Plus size={13}/> {t('q_add_model')}</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(380px,1fr))',gap:'0.75rem'}}>
      {f.modelli.map((mod, mIdx) => {
  const printInCorso = isModelLocked(mod.id);
  
  // LOGICHE DI BLOCCO:
  // 1. Dettagli Tecnici (Materiali, Stampante, Ore, Minuti, MANODOPERA): 
  //    Bloccati SOLO se "In corso" o "Completata"
  const technicalLocked = printInCorso || mod.stato === 'In corso' || mod.stato === 'Completata';
  
  // 2. Nome Modello:
  //    Bloccato se tecnici bloccati, OPPURE se in modifica ed è "In attesa"
  const nameLocked = technicalLocked || (isEdit && mod.stato === 'In attesa');
  
  return (
    <div key={mod.id} style={{background: C.s2, border: `1px solid ${C.b}`, borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem', opacity: mod.stato === 'Annullato' ? 0.6 : 1}}>
      
      {/* AVVISI VISIVI */}
      {technicalLocked && (
        <div style={{ color: mod.stato === 'Completata' ? C.ok : '#d97706', background: mod.stato === 'Completata' ? `${C.ok}15` : 'rgba(217, 119, 6, 0.1)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '10px', fontWeight: 500 }}>
          {mod.stato === 'Completata' ? `✅ ${t('st_completata')}: ${t('print_tech_locked')}` : `⚠️ ${t('st_corso')}: ${t('print_tech_locked')}`}
        </div>
      )}
      {nameLocked && !technicalLocked && (
        <div style={{ color: C.t2, background: C.s1, border: `1px solid ${C.b}`, padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '10px' }}>
          {t('q_model_wait_lock')}
        </div>
      )}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.5rem',gap:'0.5rem'}}>
        {/* Colonna sinistra: Nome Modello (largo) + Stampante indentata sotto */}
        <div style={{flex:1}}>
          <F label={t('q_model_name')}>
            <Inp v={mod.nome_modello} set={v=>chgMod(mIdx,'nome_modello',v)} ph="Es. Ingranaggio 1" disabled={nameLocked}/>
          </F>
          <div style={{paddingLeft:'0.75rem',marginTop:'0.35rem'}}>
            <F label={<span style={{fontSize:'0.65rem',color:C.t3}}>{t('print_printer')}</span>}>
              <Sel v={mod.printer_id} set={v=>chgMod(mIdx,'printer_id',v)} disabled={technicalLocked} style={{fontSize:'0.78rem',padding:'0.2rem 0.4rem'}}>
                {printers.map(p=><option key={p.id} value={p.id}>{prNome(p)}</option>)}
              </Sel>
            </F>
          </div>
        </div>
        {/* Colonna destra: Stato (solo lettura, comanda la stampa) + pulsante elimina */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
          <F label={t('q_model_status')} style={{minWidth:130}}>
            <div style={{padding:'0.3rem 0.6rem',borderRadius:6,border:`1px solid ${C.b}`,background:C.s3,display:'flex',alignItems:'center',gap:6,minWidth:130}}>
              <Badge label={tSt(mod.stato,t)} color={qStaClr(mod.stato)}/>
              <Lock size={10} color={C.t3} title={lang==='en'?'Controlled by the linked print':'Controllato dalla stampa collegata'}/>
            </div>
          </F>
          {f.modelli.length>1&&!technicalLocked&&<Btn onClick={()=>removeModello(mIdx)} variant="dan" sm><Trash2 size={13}/></Btn>}
        </div>
      </div>
      
      <div style={{margin:'0.4rem 0'}}><div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('q_model_materials')}</div>
        {mod.materials.map((row,i)=> (
          <MatRow 
            key={i} 
            row={row} 
            index={i} 
            mats={mats} 
            onChange={(idx, k, v) => chgMat(mIdx, idx, k, v)} 
            onRemove={idx=>removeMat(mIdx, idx)} 
            canRemove={mod.materials.length>1 && !technicalLocked} 
            showSnap 
            committedMap={committedMap} 
            inFormUsageMap={inFormUsageMap}
            disabled={technicalLocked} 
          />
        ))}
        {!technicalLocked && (
          <button onClick={()=>addMat(mIdx)} style={{background:'none',border:`1px dashed ${C.b}`,color:C.t3,borderRadius:5,padding:'0.2rem 0.6rem',cursor:'pointer',fontSize:'0.75rem',display:'flex',alignItems:'center',gap:3,fontFamily:'inherit',marginTop:4}}>
            <Plus size={11}/>{t('print_form_add_mat')}
          </button>
        )}
      </div>

      <div style={{display:'grid',gridTemplateColumns:f.uso_interno?'1fr 1fr':'repeat(3,1fr)',gap:'0.5rem', marginTop: '0.5rem'}}>
        <F label={t('print_hours')}><Inp type="number" v={mod.ore} set={v=>chgMod(mIdx, 'ore', v)} min={0} disabled={technicalLocked}/></F>
        <F label={t('print_min')}><Inp type="number" v={mod.min} set={v=>chgMod(mIdx, 'min', v)} min={0} max={59} disabled={technicalLocked}/></F>
        
        {/* MANODOPERA: Ora bloccata se In Corso/Completata */}
        {!f.uso_interno&&<F label={t('print_labor')}><Inp type="number" v={mod.m_op} set={v=>chgMod(mIdx, 'm_op', v)} min={0} step={0.5} disabled={technicalLocked}/></F>}
      </div>

      {/* SERVIZI EXTRA: Sempre attivi */}
      {!f.uso_interno&&(settings.servizi_extra||[]).length>0&&<div style={{marginTop:'0.5rem'}}><div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('q_model_extra')}</div><div style={{display:'flex',flexWrap:'wrap',gap:4}}>{(settings.servizi_extra||[]).map(sv=>{
        const sel=mod.servizi.find(x=>x.id===sv.id);
        return(
          <div key={sv.id} onClick={()=> toggleSv(mIdx, sv)} style={{display:'flex',alignItems:'center',gap:3,background:sel?C.a2:C.s2,border:`1px solid ${sel?C.a:C.b}`,borderRadius:5,padding:'2px 7px 2px 6px',cursor:'pointer'}}>
            <span style={{color:sel?C.a:C.t2,fontSize:'0.78rem'}}>{sv.nome}</span>
            {sel&&<input type="number" value={sel.prezzo} min={0} step={0.5} onClick={e=>e.stopPropagation()} onChange={e=>chgSvPrice(mIdx, sv.id, +e.target.value)} style={{...inp,width:50,padding:'1px 4px',fontSize:'0.72rem'}} disabled={false}/>}
            {!sel&&<span style={{color:C.t3,fontSize:'0.7rem'}}>{fmtV(sv.prezzo)}</span>}
          </div>
        );
      })}</div></div>}
    </div>
  );
})}
    </div>

    {!f.uso_interno&&<div style={{display:'grid',gridTemplateColumns:f.corriere_id?'1fr 1fr':'1fr',gap:'0.5rem',marginBottom:'0.25rem'}}><F label={t('q_shipping')}><Sel v={f.corriere_id||''} set={v=>selCorr(v)}><option value="">{t('q_no_shipping')}</option>{(settings.corrieri||[]).map(c=><option key={c.id} value={c.id}>{c.nome}{c.servizio?` — ${c.servizio}`:''} · {fmtV(c.prezzo)}</option>)}</Sel></F>{f.corriere_id&&<F label={t('q_ship_cost')}><Inp type="number" v={f.corriere_prezzo} set={v=>ss('corriere_prezzo',+v)} min={0} step={0.5}/></F>}</div>}
    {!f.uso_interno&&<div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.5rem'}}><F label={t('q_markup_base')}><Inp type="number" v={f.markup} set={v=>ss('markup',v)} min={0}/></F><F label={t('q_markup_extra')}><Inp type="number" v={f.markup_extra} set={v=>ss('markup_extra',v)} min={0}/></F><F label={t('q_iva')}><Inp type="number" v={f.iva} set={v=>ss('iva',+v)} min={0} disabled={settings.regime!=='ordinario'}/></F><F label={t('q_ritenuta')}>{settings.regime==='occasionale'?<Chk v={f.ritenuta} set={v=>ss('ritenuta',v)} label={t('set_ritenuta_apply')}/>:<span style={{color:C.t3,fontSize:'0.72rem',paddingTop:4,display:'block'}}>{t('q_ritenuta_only')}</span>}</F></div>}
    {!f.uso_interno&&(settings.metodi_pagamento||[]).length>0&&(
      <div style={{marginBottom:'0.5rem',marginTop:'0.25rem'}}>
        <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:5}}>{t('q_payment_methods')}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {(settings.metodi_pagamento||[]).map(mp=>{
            const sel=!!(f.metodi_pagamento||[]).find(x=>x.id===mp.id);
            return(<button key={mp.id} type="button" onClick={()=>togglePayment(mp)}
              style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:5,
                border:`1px solid ${sel?C.ok:C.b}`,background:sel?C.okBg:'transparent',
                color:sel?C.ok:C.t2,cursor:'pointer',fontSize:'0.78rem',fontFamily:'inherit'}}>
              {sel&&<span style={{fontSize:'0.65rem'}}>✓</span>}{mp.nome}
            </button>);
          })}
        </div>
      </div>
    )}
    </div>{/* fine grid modelli */}
    <F label={t('q_global_notes')}><Inp v={f.note} set={v=>ss('note',v)} ph={t('q_notes_ph')}/></F>
    
    <CostBox costs={costs} markup={f.uso_interno?0:(+f.markup||0)} markup_extra={f.uso_interno?0:(+f.markup_extra||0)} iva={f.uso_interno?0:f.iva} ritenuta_flag={(!f.uso_interno)&&f.ritenuta&&settings.regime==='occasionale'} uso_interno={f.uso_interno}/>
    
    {!f.uso_interno&&<div style={{background:C.purpleBg,border:`1px solid ${C.purpleBr}`,borderRadius:8,padding:'0.7rem 1rem',display:'flex',justifyContent:'space-between',alignItems:'center',margin:'0.5rem 0'}}><div><div style={{color:C.t3,fontSize:'0.72rem'}}>{t('q_taxable')} (mk {f.markup}%{f.markup_extra>0?` + extra ${f.markup_extra}%`:''})</div><div style={{color:C.purple,fontWeight:700,fontSize:'1.3rem'}}>{fmtV(sale.totale)}</div></div><div style={{textAlign:'right'}}><div style={{color:C.t3,fontSize:'0.72rem'}}>{t('q_gross')}</div><div style={{color:C.t2,fontWeight:600}}>{fmtV(sale.imponibile-costs.total)}</div></div></div>}
    
    {!isEdit&&<div style={{background:C.blueBg,border:`1px solid ${C.blueBr}`,borderRadius:6,padding:'0.4rem 0.75rem',fontSize:'0.75rem',color:C.blue,marginBottom:6}}>{t('q_auto_prints')}</div>}
    <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn onClick={onClose}>{t('cancel')}</Btn><Btn onClick={handleSave} variant="pri"><FileText size={13}/>{isEdit?'Salva modifiche':'Salva preventivo'}</Btn></div>
  </div>);
}

/* ══ VIEWS ══ */
function Dashboard({mats,prints,quotes,printers,alerts,setTab,settings}){
  const {t,lang,valuta,colorLang}=useT();
  const fmtV=useFmt();
  const now=new Date();
  const [period,setPeriod]=useState('month');
  const [selDay,setSelDay]=useState(now.toISOString().slice(0,10));
  const [selMonth,setSelMonth]=useState(now.getMonth());
  const [selYear,setSelYear]=useState(now.getFullYear());
  const [customFrom,setCustomFrom]=useState(new Date(now.getFullYear(),now.getMonth()-2,1).toISOString().slice(0,10));
  const [customTo,setCustomTo]=useState(now.toISOString().slice(0,10));

  /* ── Inventory data (always current) ── */
  const totInv=mats.reduce((s,m)=>s+(m.stock/1000)*m.prezzo,0);
  const inC=prints.filter(p=>p.stato==='In corso').length;
  const qByTipo={};mats.forEach(m=>{qByTipo[m.tipo]=(qByTipo[m.tipo]||0)+1;});
  const qD=Object.entries(qByTipo).sort((a,b)=>b[1]-a[1]).map(([tp,n])=>({label:tp,value:n,color:tC(tp)}));
  const vByTipo={};mats.forEach(m=>{vByTipo[m.tipo]=(vByTipo[m.tipo]||0)+(m.stock/1000)*m.prezzo;});
  const sv=Object.entries(vByTipo).sort((a,b)=>b[1]-a[1]);const thr=totInv*0.04;
  const othSum=sv.filter(([,v])=>v<thr).reduce((s,[,v])=>s+v,0);
  const vD=[...sv.filter(([,v])=>v>=thr).map(([tp,v])=>({label:tp,value:v,color:tC(tp),display:fmtV(v)})),...(othSum>0?[{label:t('dash_other'),value:othSum,color:C.t3,display:fmtV(othSum)}]:[])];

  /* ── Period filter helpers ── */
  const inPeriod=dateStr=>{
    if(!dateStr)return false;
    const d=new Date(dateStr+'T00:00:00');
    if(period==='day')  return dateStr===selDay;
    if(period==='month')return d.getMonth()===selMonth&&d.getFullYear()===selYear;
    if(period==='year') return d.getFullYear()===selYear;
    if(period==='custom'){const from=new Date(customFrom+'T00:00:00');const to=new Date(customTo+'T23:59:59');return d>=from&&d<=to;}
    return true;
  };

  /* ── Filtered analytics ── */
  const filteredQ=quotes.filter(q=>q.stato==='Completato'&&!q.uso_interno&&inPeriod(q.data));
  /* lavori interni nel periodo (tutti gli stati) */
  const filteredIntQ=quotes.filter(q=>q.uso_interno&&inPeriod(q.data));
  const filteredIntQComp=filteredIntQ.filter(q=>q.stato==='Completato');
  const filteredPrints=prints.filter(p=>inPeriod(p.data));
  const failedPrints=filteredPrints.filter(p=>p.stato==='Fallita');
  const completedPrints=filteredPrints.filter(p=>p.stato==='Completata');

  const revenue=filteredQ.reduce((s,q)=>s+(+q.prezzo||0),0);
  const profitQ=filteredQ.reduce((s,q)=>s+(+q.prezzo||0)-(+q.costo_prod||0),0);
  const avgVal=filteredQ.length>0?revenue/filteredQ.length:0;
  /* costo interno = somma tutti i lavori interni nel periodo (qualsiasi stato) */
  const internalCost=filteredIntQ.reduce((s,q)=>s+(+q.costo_prod||0),0);
  const internalCostComp=filteredIntQComp.reduce((s,q)=>s+(+q.costo_prod||0),0);

  /* kg consumed by filament type from completed prints in period */
  const kgByTipo={};
  completedPrints.forEach(p=>{
    (p.materials||[]).forEach(({mat_id,peso_g})=>{
      const mat=mats.find(m=>m.id===mat_id);
      const tipo=mat?.tipo||'Sconosciuto';
      kgByTipo[tipo]=(kgByTipo[tipo]||0)+(+peso_g||0)/1000;
    });
  });
  const kgData=Object.entries(kgByTipo).sort((a,b)=>b[1]-a[1]).map(([tp,kg])=>({label:tp,value:+kg.toFixed(3),color:tC(tp),display:`${kg.toFixed(2)}kg`}));
  const totalKg=Object.values(kgByTipo).reduce((s,v)=>s+v,0);

  /* print hours from completed prints */
  const totalHours=completedPrints.reduce((s,p)=>{
    const h=(+p.ore||0)+(+p.min||0)/60;return s+h;
  },0);

  /* material distribution from filtered completed quotes (no interni) */
  const matDistrib={};
  filteredQ.forEach(q=>{
    (q.modelli||[]).forEach(mod=>{
      (mod.materials||[]).forEach(({mat_id,peso_g})=>{
        const mat=mats.find(m=>m.id===mat_id);
        const tipo=mat?.tipo||'Sconosciuto';
        matDistrib[tipo]=(matDistrib[tipo]||0)+(+peso_g||0)/1000;
      });
    });
  });
  const matDistribData=Object.entries(matDistrib).sort((a,b)=>b[1]-a[1]).map(([tp,kg])=>({label:tp,value:+kg.toFixed(3),color:tC(tp),display:`${kg.toFixed(2)}kg`}));
  const totalMatKg=Object.values(matDistrib).reduce((s,v)=>s+v,0);

  /* period label for display */
  const MONTHS_IT=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  const MONTHS_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MONTHS=lang==='en'?MONTHS_EN:MONTHS_IT;
  const periodLabel=period==='day'?selDay:period==='month'?`${MONTHS[selMonth]} ${selYear}`:period==='year'?String(selYear):`${customFrom} → ${customTo}`;

  /* years for selector */
  const allYears=[...new Set([...quotes.map(q=>q.data?.slice(0,4)),...prints.map(p=>p.data?.slice(0,4))].filter(Boolean).map(Number))].sort((a,b)=>b-a);
  if(!allYears.includes(now.getFullYear()))allYears.unshift(now.getFullYear());

  return(<div style={{maxWidth:1400,margin:'0 auto'}}>
    <div style={{color:C.t,fontSize:'1.25rem',fontWeight:500,marginBottom:'1.25rem'}}>{t('nav_dash')}</div>

    {/* ── Stat cards (always current) ── */}
    {(()=>{
      const totSpoolsActive=mats.reduce((s,m)=>(m.spools||[]).filter(sp=>sp.stato!=='esaurita').length+s,0);
      const totSpoolsLow=mats.reduce((s,m)=>(m.spools||[]).filter(sp=>sp.stato!=='esaurita'&&sp.peso_nominale>0&&(sp.residuo/sp.peso_nominale)<0.20).length+s,0);
      return(
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:'1.25rem'}}>
          <StatCard label={t('print_materials')} val={mats.length} sub={`${printers.length} ${t('dash_printers_sub')}`}/>
          <StatCard label={t('dash_critical')} val={alerts.length} color={alerts.length>0?C.err:C.t3}/>
          <StatCard label={t('dash_inv_value')} val={fmtV(totInv)} color={C.blue}/>
          <StatCard label={t('dash_in_progress')} val={inC} color={inC>0?C.warn:C.t3} sub={`${prints.length} ${t('dash_total_sub')}`}/>
          <StatCard label={t('dash_spools_title')} val={totSpoolsActive} color={totSpoolsLow>0?C.warn:C.ok} sub={totSpoolsLow>0?`${totSpoolsLow} ${t('dash_spools_low')}`:`OK`}/>
        </div>
      );
    })()}

    {/* ── Analytics panel (time-filtered) ── */}
    <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:'1rem',marginBottom:'1rem'}}>
      {/* Header + period selector */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem',flexWrap:'wrap',gap:10}}>
        <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.06em',display:'flex',alignItems:'center',gap:6}}>
          <LayoutDashboard size={13}/>{t('dash_analytics')}
          <span style={{background:C.a2,color:C.a,borderRadius:4,padding:'1px 7px',fontSize:'0.68rem',fontWeight:500,marginLeft:4}}>{periodLabel}</span>
        </div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap',alignItems:'center'}}>
          {/* Period type buttons */}
          {[['day',t('dash_period_day')],['month',t('dash_period_month')],['year',t('dash_period_year')],['custom',t('dash_period_custom')]].map(([k,l])=>(
            <button key={k} onClick={()=>setPeriod(k)} style={{padding:'0.25rem 0.65rem',borderRadius:5,border:`1px solid ${period===k?C.a:C.b}`,background:period===k?C.a2:'transparent',color:period===k?C.a:C.t2,cursor:'pointer',fontSize:'0.78rem',fontFamily:'inherit'}}>{l}</button>
          ))}
        </div>
      </div>

      {/* Period selectors */}
      <div style={{display:'flex',gap:8,marginBottom:'1rem',flexWrap:'wrap',alignItems:'center'}}>
        {period==='day'&&(
          <input type="date" value={selDay} onChange={e=>setSelDay(e.target.value)} style={{...{background:C.s3,border:`1px solid ${C.b}`,borderRadius:6,color:C.t,padding:'0.35rem 0.65rem',fontSize:'0.85rem',outline:'none',fontFamily:'inherit'}}}/>
        )}
        {period==='month'&&(<>
          <select value={selMonth} onChange={e=>setSelMonth(+e.target.value)} style={{background:C.s3,border:`1px solid ${C.b}`,borderRadius:6,color:C.t,padding:'0.35rem 0.65rem',fontSize:'0.85rem',outline:'none',fontFamily:'inherit',cursor:'pointer'}}>
            {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
          </select>
          <select value={selYear} onChange={e=>setSelYear(+e.target.value)} style={{background:C.s3,border:`1px solid ${C.b}`,borderRadius:6,color:C.t,padding:'0.35rem 0.65rem',fontSize:'0.85rem',outline:'none',fontFamily:'inherit',cursor:'pointer'}}>
            {allYears.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </>)}
        {period==='year'&&(
          <select value={selYear} onChange={e=>setSelYear(+e.target.value)} style={{background:C.s3,border:`1px solid ${C.b}`,borderRadius:6,color:C.t,padding:'0.35rem 0.65rem',fontSize:'0.85rem',outline:'none',fontFamily:'inherit',cursor:'pointer'}}>
            {allYears.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        )}
        {period==='custom'&&(<>
          <span style={{color:C.t3,fontSize:'0.8rem'}}>{t('dash_period_from')}</span>
          <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} style={{background:C.s3,border:`1px solid ${C.b}`,borderRadius:6,color:C.t,padding:'0.35rem 0.65rem',fontSize:'0.85rem',outline:'none',fontFamily:'inherit'}}/>
          <span style={{color:C.t3,fontSize:'0.8rem'}}>{t('dash_period_to')}</span>
          <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} style={{background:C.s3,border:`1px solid ${C.b}`,borderRadius:6,color:C.t,padding:'0.35rem 0.65rem',fontSize:'0.85rem',outline:'none',fontFamily:'inherit'}}/>
        </>)}
      </div>

      {filteredQ.length===0&&filteredPrints.length===0&&filteredIntQ.length===0?(
        <div style={{color:C.t3,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t('dash_no_data')}</div>
      ):(
        <>
          {/* KPI row — max 320px per card */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,320px))',gap:8,marginBottom:'1rem'}}>
            {/* Card 1 — Fatturato Totale (con count preventivi in basso) */}
            <div style={{background:C.s2,borderRadius:8,padding:'0.75rem'}}>
              <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('dash_revenue')}</div>
              <div style={{color:C.ok,fontSize:'1.2rem',fontWeight:700,lineHeight:1}}>{fmtV(revenue)}</div>
              {revenue>0&&profitQ>0&&<div style={{color:C.t3,fontSize:'0.7rem',marginTop:3}}>{t('dash_margine')}: {(profitQ/revenue*100).toFixed(1)}%</div>}
              <div style={{borderTop:`1px solid ${C.b}`,marginTop:6,paddingTop:5,display:'flex',alignItems:'baseline',gap:5}}>
                <span style={{color:C.purple,fontSize:'1rem',fontWeight:700}}>{filteredQ.length}</span>
                <span style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.03em'}}>{t('dash_quotes_count')}</span>
                {filteredQ.length>0&&<span style={{color:C.t3,fontSize:'0.65rem',marginLeft:'auto'}}>{t('dash_medio')}: {fmtV(avgVal)}</span>}
              </div>
            </div>
            {/* Card 2 — Profitto */}
            {(()=>{
              const profitPend=quotes.filter(q=>['In attesa','Confermato'].includes(q.stato)&&!q.uso_interno).reduce((s,q)=>s+(+q.prezzo||0)-(+q.costo_prod||0),0);
              const nPend=quotes.filter(q=>['In attesa','Confermato'].includes(q.stato)&&!q.uso_interno).length;
              return(
                <div style={{background:C.s2,borderRadius:8,padding:'0.75rem'}}>
                  <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6}}>{t('dash_profits')}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:4}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:4}}>
                      <span style={{color:C.t3,fontSize:'0.68rem',whiteSpace:'nowrap'}}>{t('dash_profit_from_comp')} ({filteredQ.length})</span>
                      <span style={{color:profitQ>=0?C.ok:C.err,fontSize:'1rem',fontWeight:700,whiteSpace:'nowrap'}}>{fmtV(profitQ)}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:4}}>
                      <span style={{color:C.t3,fontSize:'0.68rem',whiteSpace:'nowrap'}}>{t('dash_profit_from_pend')} ({nPend})</span>
                      <span style={{color:C.warn,fontSize:'0.9rem',fontWeight:600,whiteSpace:'nowrap'}}>{fmtV(profitPend)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
            {/* Card 3 — Costi Stampe Interne */}
            <div style={{background:C.s2,borderRadius:8,padding:'0.75rem'}}>
              <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('dash_int_costs')}</div>
              <div style={{color:C.warn,fontSize:'1.2rem',fontWeight:700,lineHeight:1}}>{fmtV(internalCost)}</div>
              {filteredIntQComp.length>0&&<div style={{color:C.t3,fontSize:'0.7rem',marginTop:3}}>{t('dash_completati_kpi')}: {fmtV(internalCostComp)}</div>}
              <div style={{borderTop:`1px solid ${C.b}`,marginTop:6,paddingTop:5,display:'flex',alignItems:'baseline',gap:5}}>
                <span style={{color:C.warn,fontSize:'1rem',fontWeight:700}}>{filteredIntQ.length}</span>
                <span style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.03em'}}>{t('dash_int_label_count')}</span>
                {filteredIntQComp.length>0&&<span style={{color:C.t3,fontSize:'0.65rem',marginLeft:'auto'}}>{t('dash_medio')}: {fmtV(internalCostComp/(filteredIntQComp.length||1))}</span>}
              </div>
            </div>
          </div>

          {/* Layout a 2 colonne: sinistra elastica, destra fissa 280px */}
          <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 280px',gap:'1rem',alignItems:'start'}}>

            {/* Colonna sinistra: Trend + Ore/Fallimenti */}
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {(()=>{
            const MONTHS_SHORT_IT=['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
            const MONTHS_SHORT_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const MS=lang==='en'?MONTHS_SHORT_EN:MONTHS_SHORT_IT;
            const trendData=[];
            for(let i=11;i>=0;i--){
              const d=new Date(now.getFullYear(),now.getMonth()-i,1);
              const m=d.getMonth();const y=d.getFullYear();
              const rev=quotes.filter(q=>!q.uso_interno&&q.stato==='Completato'&&q.data?.slice(0,7)===`${y}-${String(m+1).padStart(2,'0')}`).reduce((s,q)=>s+(+q.prezzo||0),0);
              const profit=quotes.filter(q=>!q.uso_interno&&q.stato==='Completato'&&q.data?.slice(0,7)===`${y}-${String(m+1).padStart(2,'0')}`).reduce((s,q)=>s+(+q.prezzo||0)-(+q.costo_prod||0),0);
              trendData.push({label:MS[m],rev,profit,isCurrent:m===now.getMonth()&&y===now.getFullYear()});
            }
            const maxRev=Math.max(...trendData.map(d=>d.rev),1);
            const H=44;const W_bar=13;const GAP=5;const totalW=trendData.length*(W_bar+GAP)-GAP;
            const LABEL_W=28;
            const hasData=trendData.some(d=>d.rev>0);
            if(!hasData)return null;
            const nTicks=4;
            const rawStep=maxRev/nTicks;
            const magnitude=Math.pow(10,Math.floor(Math.log10(rawStep)));
            const niceStep=Math.ceil(rawStep/magnitude)*magnitude;
            const scaleMax=niceStep*nTicks;
            const ticks=Array.from({length:nTicks+1},(_,i)=>i*niceStep);
            const fmtTick=v=>v>=1000?`${(v/1000).toFixed(v%1000===0?0:1)}k`:String(Math.round(v));
            const TOP_PAD=7;
            const SVG_W=totalW+4+LABEL_W;
            const SVG_H=H+TOP_PAD+13;
            return(
              <div style={{background:C.s2,borderRadius:8,padding:'0.4rem 0.65rem'}}>
                <div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('dash_trend')} ({t('dash_12months')})</div>
                <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{overflow:'hidden',display:'block'}}>
                  {ticks.map((tv,ti)=>{
                    const yPos=TOP_PAD+H-Math.round((tv/scaleMax)*H);
                    if(yPos<0||yPos>TOP_PAD+H)return null;
                    return(
                      <g key={ti}>
                        <line x1={LABEL_W} y1={yPos} x2={SVG_W-2} y2={yPos} stroke={C.b} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.7"/>
                        <text x={LABEL_W-2} y={yPos} textAnchor="end" dominantBaseline="middle" fill={C.t3} fontSize="3.8" fontFamily="system-ui">{fmtTick(tv)}</text>
                      </g>
                    );
                  })}
                  {trendData.map((d,i)=>{
                    const x=LABEL_W+i*(W_bar+GAP);
                    const hRev=d.rev>0?Math.max(3,Math.round((d.rev/scaleMax)*H)):0;
                    const hProfit=d.profit>0?Math.max(2,Math.round((d.profit/scaleMax)*H)):0;
                    return(
                      <g key={i}>
                        {hRev>0&&<rect x={x} y={TOP_PAD+H-hRev} width={W_bar} height={hRev} rx={2} fill={C.a} opacity={d.isCurrent?0.95:0.5}/>}
                        {hProfit>0&&<rect x={x+2} y={TOP_PAD+H-hProfit} width={W_bar-4} height={hProfit} rx={2} fill={C.ok} opacity={d.isCurrent?1:0.75}/>}
                        <text x={x+W_bar/2} y={TOP_PAD+H+9} textAnchor="middle" fill={d.isCurrent?C.a:C.t3} fontSize="4.5" fontWeight={d.isCurrent?700:400} fontFamily="system-ui">{d.label}</text>
                      </g>
                    );
                  })}
                </svg>
                <div style={{display:'flex',gap:10,marginTop:2}}>
                  <div style={{display:'flex',alignItems:'center',gap:3,fontSize:'0.58rem',color:C.t3}}><div style={{width:7,height:3,borderRadius:1,background:C.a,opacity:0.95}}/> {t('dash_fatturato')}</div>
                  <div style={{display:'flex',alignItems:'center',gap:3,fontSize:'0.58rem',color:C.t3}}><div style={{width:7,height:3,borderRadius:1,background:C.ok,opacity:1}}/> {t('dash_profitto')}</div>
                </div>
              </div>
            );
          })()}

          {/* Stampe row — dentro colonna sinistra */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {/* Card Ore di Stampa — con breakdown per stampante */}
            {(()=>{
              const byPrinter=printers.map(pr=>{
                const prPrints=completedPrints.filter(p=>p.printer_id===pr.id);
                const h=prPrints.reduce((s,p)=>s+(+p.ore||0)+(+p.min||0)/60,0);
                return{name:pr.nome||pr.marca||'—',h,n:prPrints.length};
              }).filter(x=>x.h>0).sort((a,b)=>b.h-a.h);
              const fmtH=h=>h>=1?`${Math.floor(h)}h ${Math.round((h%1)*60)}m`:`${Math.round(h*60)}m`;
              return(
                <div style={{background:C.s2,borderRadius:8,padding:'0.75rem',display:'flex',flexDirection:'column'}}>
                  <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('dash_print_hours')}</div>
                  <div style={{color:C.blue,fontSize:'1.2rem',fontWeight:700,lineHeight:1}}>{fmtH(totalHours)}</div>
                  <div style={{color:C.t3,fontSize:'0.7rem',marginTop:3,marginBottom:6}}>{completedPrints.length} {t('dash_completed_prints')}</div>
                  {byPrinter.length>0&&<>
                    <div style={{borderTop:`1px solid ${C.b}`,paddingTop:6,flex:1}}>
                      <div style={{maxHeight:72,overflowY:'auto',display:'flex',flexDirection:'column',gap:4}}>
                        {byPrinter.map((pr,i)=>(
                          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:'0 6px',alignItems:'center'}}>
                            <span style={{color:C.t2,fontSize:'0.68rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={pr.name}>{pr.name}</span>
                            <span style={{color:C.t3,fontSize:'0.65rem',whiteSpace:'nowrap'}}>{pr.n} stampe</span>
                            <span style={{color:C.blue,fontSize:'0.72rem',fontWeight:500,whiteSpace:'nowrap'}}>{fmtH(pr.h)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>}
                </div>
              );
            })()}
            {/* Card Fallimenti Stampa */}
            {(()=>{
              const byPrFail=printers.map(pr=>{
                const n=failedPrints.filter(p=>p.printer_id===pr.id).length;
                return{name:pr.nome||pr.marca||'—',n};
              }).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);
              return(
                <div style={{background:C.s2,borderRadius:8,padding:'0.75rem',display:'flex',flexDirection:'column'}}>
                  <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('dash_print_failures')}</div>
                  <div style={{color:failedPrints.length>0?C.err:C.t3,fontSize:'1.2rem',fontWeight:700,lineHeight:1}}>{failedPrints.length}</div>
                  <div style={{color:C.t3,fontSize:'0.7rem',marginTop:3,marginBottom:6}}>{filteredPrints.length>0?`${((failedPrints.length/filteredPrints.length)*100).toFixed(1)}% ${t('dash_of_word')} ${filteredPrints.length} ${t('dash_prints_word')}`:'—'}</div>
                  {byPrFail.length>0&&<>
                    <div style={{borderTop:`1px solid ${C.b}`,paddingTop:6,flex:1}}>
                      <div style={{maxHeight:72,overflowY:'auto',display:'flex',flexDirection:'column',gap:4}}>
                        {byPrFail.map((pr,i)=>(
                          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'0 6px',alignItems:'center'}}>
                            <span style={{color:C.t2,fontSize:'0.68rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={pr.name}>{pr.name}</span>
                            <span style={{color:C.err,fontSize:'0.72rem',fontWeight:500,whiteSpace:'nowrap'}}>{pr.n} fallite</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>}
                </div>
              );
            })()}
            {/* Card Consumo Energetico */}
            {(()=>{
              const totalKwh=completedPrints.reduce((s,p)=>{
                const pr=printers.find(x=>x.id===p.printer_id);
                const h=(+p.ore||0)+(+p.min||0)/60;
                return s+h*(pr?.e_kwh||0);
              },0);
              const totalEnCost=totalKwh*(+settings.c_kwh||0.25);
              const byPrE=printers.map(pr=>{
                const prPrints=completedPrints.filter(p=>p.printer_id===pr.id);
                const kwh=prPrints.reduce((s,p)=>{const h=(+p.ore||0)+(+p.min||0)/60;return s+h*(pr.e_kwh||0);},0);
                return{name:pr.nome||pr.marca||'—',kwh};
              }).filter(x=>x.kwh>0).sort((a,b)=>b.kwh-a.kwh);
              return(
                <div style={{background:C.s2,borderRadius:8,padding:'0.75rem',display:'flex',flexDirection:'column'}}>
                  <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>{t('dash_energy_total')}</div>
                  <div style={{color:C.teal,fontSize:'1.2rem',fontWeight:700,lineHeight:1}}>{totalKwh.toFixed(2)} kWh</div>
                  <div style={{color:C.t3,fontSize:'0.7rem',marginTop:3,marginBottom:6}}>{t('dash_medio')} costo: {fmtV(totalEnCost)}</div>
                  {byPrE.length>0&&<>
                    <div style={{borderTop:`1px solid ${C.b}`,paddingTop:6,flex:1}}>
                      <div style={{maxHeight:72,overflowY:'auto',display:'flex',flexDirection:'column',gap:4}}>
                        {byPrE.map((pr,i)=>(
                          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'0 6px',alignItems:'center'}}>
                            <span style={{color:C.t2,fontSize:'0.68rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={pr.name}>{pr.name}</span>
                            <span style={{color:C.teal,fontSize:'0.72rem',fontWeight:500,whiteSpace:'nowrap'}}>{pr.kwh.toFixed(2)} kWh</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>}
                </div>
              );
            })()}
          </div>

            </div>{/* fine colonna sinistra */}

            {/* Colonna destra: Donut charts — larghezza fissa 280px */}
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {(matDistribData.length>0||kgData.length>0)&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'1rem'}}>
              {matDistribData.length>0&&<div>
                <div style={{color:C.t3,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:'0.625rem'}}>{t('dash_mat_distrib')} ({t('dash_from_quotes')})</div>
                <DonutChart data={matDistribData} totalLabel="kg" centerValue={`${totalMatKg.toFixed(1)}kg`}/>
              </div>}
              {kgData.length>0&&<div>
                <div style={{color:C.t3,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:'0.625rem'}}>{t('dash_kg_consumed')} ({t('dash_from_prints')})</div>
                <DonutChart data={kgData} totalLabel="kg" centerValue={`${totalKg.toFixed(1)}kg`}/>
              </div>}
            </div>
          )}
            </div>{/* fine colonna destra */}
          </div>{/* fine grid 2 colonne */}
        </>
      )}
    </div>

    {/* ── Top Materiali Più Usati ── */}
    {(()=>{
      const matUsage={};
      completedPrints.forEach(p=>{
        (p.materials||[]).forEach(({mat_id,peso_g})=>{
          matUsage[mat_id]=(matUsage[mat_id]||0)+(+peso_g||0);
        });
      });
      const sorted=Object.entries(matUsage).sort((a,b)=>b[1]-a[1]).slice(0,8);
      if(sorted.length===0)return null;
      const maxG=sorted[0][1]||1;
      const use2col=sorted.length>4;
      return(
        <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:'1rem',marginBottom:'1rem'}}>
          <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.875rem',display:'flex',alignItems:'center',gap:6}}>
            <Layers size={13}/>{t('dash_top_mats')}
          </div>
          <div style={{display:'grid',gridTemplateColumns:use2col?'1fr 1fr':'1fr',gap:'4px 16px'}}>
            {use2col?(()=>{
              const half=Math.ceil(sorted.length/2);
              const left=sorted.slice(0,half);
              const right=sorted.slice(half);
              const maxLen=Math.max(left.length,right.length);
              const rows=[];
              for(let i=0;i<maxLen;i++){
                const lItem=left[i];const rItem=right[i];
                const renderItem=([mat_id,grams],rank)=>{
                  const mat=mats.find(m=>m.id===mat_id);
                  if(!mat)return<div key={mat_id}/>;
                  const pct=Math.round((grams/(sorted[0][1]||1))*100);
                  const kg=(grams/1000).toFixed(2);
                  return(<div key={mat_id} style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{color:C.t3,fontSize:'0.68rem',minWidth:14,textAlign:'right',fontWeight:600}}>#{rank+1}</span>
                    <div style={{width:8,height:8,borderRadius:'50%',background:mat.colore,flexShrink:0}}/>
                    <span style={{color:C.t,fontSize:'0.78rem',minWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={matNomeL(mat,colorLang)}>{matNomeL(mat,colorLang)}</span>
                    <div style={{flex:1,height:6,background:`${mat.colore}33`,borderRadius:3,overflow:'hidden',position:'relative'}}>
                      <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${pct}%`,background:mat.colore,borderRadius:3,opacity:0.85}}/>
                    </div>
                    <span style={{color:tCm(mat),fontSize:'0.72rem',fontWeight:600,minWidth:44,textAlign:'right'}}>{kg}kg</span>
                  </div>);
                };
                rows.push(<Fragment key={i}>
                  {lItem?renderItem(lItem,i):<div/>}
                  {rItem?renderItem(rItem,i+half):<div/>}
                </Fragment>);
              }
              return rows;
            })():(
              sorted.map(([mat_id,grams],rank)=>{
                const mat=mats.find(m=>m.id===mat_id);
                if(!mat)return null;
                const pct=Math.round((grams/maxG)*100);
                const kg=(grams/1000).toFixed(2);
                return(
                  <div key={mat_id} style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{color:C.t3,fontSize:'0.68rem',minWidth:14,textAlign:'right',fontWeight:600}}>#{rank+1}</span>
                    <div style={{width:8,height:8,borderRadius:'50%',background:mat.colore,flexShrink:0}}/>
                    <span style={{color:C.t,fontSize:'0.78rem',minWidth:130,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={matNomeL(mat,colorLang)}>{matNomeL(mat,colorLang)}</span>
                    <div style={{flex:1,height:6,background:`${mat.colore}33`,borderRadius:3,overflow:'hidden',position:'relative'}}>
                      <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${pct}%`,background:mat.colore,borderRadius:3,opacity:0.85}}/>
                    </div>
                    <span style={{color:tCm(mat),fontSize:'0.72rem',fontWeight:600,minWidth:44,textAlign:'right'}}>{kg}kg</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    })()}

    {/* ── Magazzino (always current) ── */}
    <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:'1rem',marginBottom:'1rem'}}>
      <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.875rem',display:'flex',alignItems:'center',gap:6}}>
        <Package size={13}/>{t('dash_magazzino')}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <div>
          <div style={{color:C.t3,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:'0.625rem'}}>{t('dash_qty_type')}</div>
          {mats.length>0?<DonutChart data={qD} totalLabel="materiali" centerValue={mats.length}/>:<div style={{color:C.t3,textAlign:'center',padding:'1rem',fontSize:'0.85rem'}}>{t('dash_no_mat')}</div>}
        </div>
        <div>
          <div style={{color:C.t3,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:'0.625rem'}}>{t('dash_val_type')}</div>
          {totInv>0?<DonutChart data={vD} totalLabel="inventario" centerValue={`${valuta}${Math.floor(totInv)}`}/>:<div style={{color:C.t3,textAlign:'center',padding:'1rem',fontSize:'0.85rem'}}>{t('dash_no_val')}</div>}
        </div>
      </div>
    </div>

    {/* ── Sezione Bobine (always current) ── */}
    {(()=>{
      /* calcoli aggregati su tutte le bobine di tutti i materiali */
      const allSpools=mats.flatMap(m=>(m.spools||[]).map(sp=>({...sp,_mat:m})));
      const totSpools=allSpools.length;
      if(totSpools===0)return null;
      const activeSpools=allSpools.filter(sp=>sp.stato!=='esaurita');
      const emptySpools=allSpools.filter(sp=>sp.stato==='esaurita')
        .sort((a,b)=>matNome(a._mat).localeCompare(matNome(b._mat)));
      /* quasi esaurite: residuo < 20% del nominale, non esaurite — ordinate per % crescente */
      const lowSpools=activeSpools
        .filter(sp=>sp.peso_nominale>0&&(sp.residuo/sp.peso_nominale)<0.20)
        .sort((a,b)=>(a.residuo/a.peso_nominale)-(b.residuo/b.peso_nominale));
      /* valore stock bobine: residuo (g) × prezzo_kg (€/kg) per bobine con prezzo */
      const spoolStockValue=activeSpools.reduce((s,sp)=>{
        const pk=sp.prezzo_kg||sp._mat.prezzo||0;
        return s+(sp.residuo/1000)*pk;
      },0);
      /* contenitori riutilizzabili disponibili (bobine chiuse o aperte, non esaurite) */
      const reusable=activeSpools.filter(sp=>sp.riutilizzabile).length;
      return(
        <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:'1rem',marginBottom:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.875rem'}}>
            <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.06em',display:'flex',alignItems:'center',gap:6}}>
              <Archive size={13}/>{t('dash_spools_title')}
            </div>
            <button onClick={()=>setTab('inventario')} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:2}}>{t('dash_spools_go')}<ChevronRight size={12}/></button>
          </div>

          {/* 3 blocchi bobine */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:'1rem'}}>

            {/* 1+2 — Aperte / In Stock uniti */}
            <div style={{background:C.s2,borderRadius:8,padding:'0.5rem 0.75rem',display:'flex',flexDirection:'column',justifyContent:'center',minHeight:72}}>
              <div style={{color:C.t3,fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4,textAlign:'center'}}>{totSpools} {t('spool_count').toLowerCase()}</div>
              <div style={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{color:C.ok,fontSize:'1.4rem',fontWeight:700,lineHeight:1}}>{activeSpools.filter(sp=>sp.stato==='aperta').length}</div>
                  <div style={{color:C.t3,fontSize:'0.62rem',marginTop:2}}>{t('dash_spools_active')}</div>
                </div>
                <div style={{width:1,height:32,background:C.b}}/>
                <div style={{textAlign:'center'}}>
                  <div style={{color:C.blue,fontSize:'1.4rem',fontWeight:700,lineHeight:1}}>{activeSpools.filter(sp=>sp.stato==='chiusa').length}</div>
                  <div style={{color:C.t3,fontSize:'0.62rem',marginTop:2}}>{t('dash_spools_stock')}</div>
                </div>
              </div>
              {reusable>0&&<div style={{color:C.teal,fontSize:'0.6rem',textAlign:'center',marginTop:3}}>♻ {reusable} {t('dash_spools_reusable').toLowerCase()}</div>}
            </div>

            {/* 3 — Quasi esaurite + Esaurite in unico box */}
            <div style={{background:C.s2,borderRadius:8,padding:'0.5rem 0.75rem',display:'flex',flexDirection:'column',justifyContent:'center',minHeight:72}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:'0.3rem'}}>
                <span style={{color:C.t2,fontSize:'0.68rem'}}>{t('dash_spools_low')}</span>
                <span style={{color:lowSpools.length>0?C.warn:C.t3,fontWeight:700,fontSize:'1.1rem'}}>{lowSpools.length}</span>
              </div>
              <div style={{height:1,background:C.b}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'0.3rem'}}>
                <span style={{color:C.t2,fontSize:'0.68rem'}}>{t('dash_spools_empty')}</span>
                <span style={{color:emptySpools.length>0?C.err:C.t3,fontWeight:700,fontSize:'1.1rem'}}>{emptySpools.length}</span>
              </div>
            </div>

            {/* 4 — Valore Stock: totale / aperte / chiuse */}
            {(()=>{
              const openSpools=activeSpools.filter(sp=>sp.stato==='aperta');
              const closedSpools=activeSpools.filter(sp=>sp.stato==='chiusa');
              const valOpen=openSpools.reduce((s,sp)=>s+(sp.residuo/1000)*(sp.prezzo_kg||sp._mat.prezzo||0),0);
              const valClosed=closedSpools.reduce((s,sp)=>s+(sp.residuo/1000)*(sp.prezzo_kg||sp._mat.prezzo||0),0);
              return(
                <div style={{background:C.s2,borderRadius:8,padding:'0.5rem 0.75rem',display:'flex',flexDirection:'column',justifyContent:'center',minHeight:72}}>
                  <div style={{color:C.blue,fontWeight:700,fontSize:'1.05rem',textAlign:'center',paddingBottom:'0.25rem'}}>{fmtV(spoolStockValue)}</div>
                  <div style={{height:1,background:C.b}}/>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'0.2rem'}}>
                    <span style={{color:C.t3,fontSize:'0.62rem'}}>{t('dash_spools_value_open')}</span>
                    <span style={{color:C.ok,fontSize:'0.75rem',fontWeight:600}}>{fmtV(valOpen)}</span>
                  </div>
                  <div style={{height:1,background:C.b,margin:'0.1rem 0'}}/>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{color:C.t3,fontSize:'0.62rem'}}>{t('dash_spools_value_closed')}</span>
                    <span style={{color:C.blue,fontSize:'0.75rem',fontWeight:600}}>{fmtV(valClosed)}</span>
                  </div>
                  <div style={{color:C.t2,fontSize:'0.65rem',textAlign:'center',marginTop:3}}>{t('dash_spools_value')}</div>
                </div>
              );
            })()}
          </div>

          {/* Lista bobine quasi esaurite + esaurite in 2 colonne */}
          {(lowSpools.length>0||emptySpools.length>0)&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:'0.25rem'}}>
              {/* Colonna quasi esaurite */}
              {lowSpools.length>0&&(
                <div>
                  <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:5}}>{t('dash_spools_low_list')}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:4}}>
                    {lowSpools.slice(0,5).map((sp,i)=>{
                      const pct=sp.peso_nominale>0?Math.round((sp.residuo/sp.peso_nominale)*100):0;
                      const mat=sp._mat;
                      return(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:8,background:C.s2,borderRadius:6,padding:'0.3rem 0.6rem'}}>
                          <div style={{width:10,height:10,borderRadius:'50%',background:mat.colore,flexShrink:0}}/>
                          <span style={{color:C.t,fontSize:'0.75rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textAlign:'left'}} title={matNomeL(mat,colorLang)}>{matNomeL(mat,colorLang)}</span>
                          <div style={{width:36,height:4,background:C.s3,borderRadius:2,overflow:'hidden',flexShrink:0}}>
                            <div style={{height:'100%',width:`${pct}%`,background:pct<10?C.err:C.warn}}/>
                          </div>
                          <span style={{color:pct<10?C.err:C.warn,fontWeight:700,fontSize:'0.68rem',minWidth:24,textAlign:'right'}}>{pct}%</span>
                        </div>
                      );
                    })}
                    {lowSpools.length>5&&<div style={{color:C.t3,fontSize:'0.68rem',textAlign:'center'}}>+{lowSpools.length-5}...</div>}
                  </div>
                </div>
              )}
              {/* Colonna esaurite */}
              {emptySpools.length>0&&(
                <div>
                  <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:5}}>{t('dash_spools_empty')}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:4}}>
                    {emptySpools.slice(0,5).map((sp,i)=>{
                      const mat=sp._mat;
                      return(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:6,background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:6,padding:'0.3rem 0.5rem'}}>
                          <div style={{width:7,height:7,borderRadius:'50%',background:C.err,flexShrink:0}}/>
                          <span style={{color:C.t,fontSize:'0.75rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textDecoration:'line-through'}} title={matNomeL(mat,colorLang)}>{matNomeL(mat,colorLang)}</span>
                          <span style={{color:C.err,fontSize:'0.68rem',fontWeight:700}}>0g</span>
                        </div>
                      );
                    })}
                    {emptySpools.length>5&&<div style={{color:C.t3,fontSize:'0.68rem',textAlign:'center'}}>+{emptySpools.length-5}...</div>}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Link Gestisci criticità */}
          {alerts.length>0&&(
            <div style={{marginTop:'0.75rem',paddingTop:'0.625rem',borderTop:`1px solid ${C.b}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:C.warn,fontSize:'0.78rem',fontWeight:500,display:'flex',alignItems:'center',gap:5}}>
                <AlertTriangle size={12}/>{alerts.length} {t('dash_critical')}
              </span>
              <button onClick={()=>{setTab('inventario');setTimeout(()=>window.dispatchEvent(new CustomEvent('p3d_show_crit')),150);}}
                style={{background:'none',border:'none',color:C.a,cursor:'pointer',fontSize:'0.78rem',fontFamily:'inherit',fontWeight:600,display:'flex',alignItems:'center',gap:3}}>
                {t('dash_manage')} <ChevronRight size={14}/>
              </button>
            </div>
          )}
        </div>
      );
    })()}

    {/* ── Bottom row: recent quotes ── */}
    <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:8,padding:'1rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
        <div style={{color:C.t2,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.04em',display:'flex',alignItems:'center',gap:5}}>
          <FileText size={12}/>{t('dash_recent_q')}
        </div>
        <button onClick={()=>setTab('preventivi')} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:2}}>{t('dash_all_q')}<ChevronRight size={12}/></button>
      </div>
      {quotes.length===0
        ?<div style={{color:C.t3,fontSize:'0.85rem',textAlign:'center',padding:'1rem'}}>{t('q_none')}</div>
        :quotes.slice(0,5).map(q=>(<div key={q.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.3rem 0.5rem',background:C.s2,borderRadius:5,marginBottom:3}}>
            <div><span style={{color:C.purple,fontWeight:600,fontSize:'0.72rem'}}>{q.numero}</span>{q.cliente&&<span style={{color:C.t,fontSize:'0.8rem',marginLeft:6}}>{q.cliente}</span>}</div>
            <div style={{display:'flex',alignItems:'center',gap:5}}><span style={{color:C.purple,fontWeight:500,fontSize:'0.8rem'}}>{fmtV(q.prezzo)}</span><Badge label={tSt(q.stato,t)||'—'} color={qStaClr(q.stato)}/></div>
          </div>))
      }
    </div>
  </div>);
}

/* ══ CSV IMPORT REPORT MODAL ══ */
function CsvImportReport({report,onConfirm,onClose}){
  const {t}=useT();
  const fmtV=useFmt();
  if(!report)return null;
  const {diff,errors,mats:newMats}=report;
  const hasChanges=diff.created.length>0||diff.updated.length>0||diff.removed.length>0||errors.length>0;
  const Section=({color,bg,border,icon,title,count,children,defaultOpen=true})=>{
    const [open,setOpen]=useState(defaultOpen);
    if(count===0)return null;
    return(
      <div style={{border:`1px solid ${border}`,borderRadius:7,marginBottom:8,overflow:'hidden'}}>
        <button onClick={()=>setOpen(!open)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',padding:'0.45rem 0.75rem',background:bg,border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left'}}>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <span style={{fontSize:'1rem'}}>{icon}</span>
            <span style={{color,fontWeight:600,fontSize:'0.83rem'}}>{title}</span>
            <span style={{background:`${color}25`,color,borderRadius:10,padding:'1px 7px',fontSize:'0.72rem',fontWeight:700}}>{count}</span>
          </div>
          <span style={{color:C.t3,fontSize:'0.75rem'}}>{open?'▲':'▼'}</span>
        </button>
        {open&&<div style={{padding:'0.5rem 0.75rem',borderTop:`1px solid ${border}`,background:C.s1}}>{children}</div>}
      </div>
    );
  };

  return(
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'flex-start',justifyContent:'center',zIndex:200,padding:'1.5rem 1rem',overflowY:'auto'}}>
      <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:'1.25rem',width:'100%',maxWidth:640,marginTop:'1rem',flexShrink:0}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <div>
            <div style={{color:C.t,fontSize:'1rem',fontWeight:600}}>{t('csv_import_title')}</div>
            <div style={{color:C.t3,fontSize:'0.78rem',marginTop:2}}>
              {newMats.length} materiali nel file · verifica le modifiche prima di confermare
            </div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',padding:2,display:'flex'}}><X size={16}/></button>
        </div>

        {/* Summary bar */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:'1rem'}}>
          {[
            {label:'Nuovi',count:diff.created.length,color:C.ok,bg:C.okBg},
            {label:'Modificati',count:diff.updated.length,color:C.blue,bg:C.blueBg},
            {label:'Invariati',count:diff.unchanged.length,color:C.t3,bg:C.s2},
            {label:'Rimossi',count:diff.removed.length,color:C.err,bg:C.errBg},
          ].map(({label,count,color,bg})=>(
            <div key={label} style={{background:bg,borderRadius:7,padding:'0.5rem',textAlign:'center'}}>
              <div style={{color,fontSize:'1.3rem',fontWeight:700,lineHeight:1}}>{count}</div>
              <div style={{color:C.t3,fontSize:'0.7rem',marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{maxHeight:'50vh',overflowY:'auto',marginBottom:'1rem'}}>

          {/* Creati */}
          <Section color={C.ok} bg={C.okBg} border={C.okBr} icon="✨" title="Nuovi materiali" count={diff.created.length}>
            {diff.created.map((m,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'0.3rem 0',borderBottom:`1px solid ${C.b}`,fontSize:'0.8rem'}}>
                <span style={{color:C.t,fontWeight:500,flex:1}}>{m.nome}</span>
                <span style={{color:C.t3}}>{m.tipo}</span>
                <span style={{color:C.t3}}>{m.marca}</span>
                <span style={{color:C.a,fontWeight:500}}>stock: {m.stock}g</span>
              </div>
            ))}
          </Section>

          {/* Modificati */}
          <Section color={C.blue} bg={C.blueBg} border={C.blueBr} icon="✏️" title="Materiali modificati" count={diff.updated.length}>
            {diff.updated.map((m,i)=>(
              <div key={i} style={{marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${C.b}`}}>
                <div style={{color:C.t,fontWeight:500,fontSize:'0.82rem',marginBottom:4}}>{m.nome}</div>
                {m.changes.map((ch,j)=>(
                  <div key={j} style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.75rem',marginBottom:2,paddingLeft:8}}>
                    <span style={{color:C.t3,minWidth:100}}>{ch.label}</span>
                    {ch.field==='colore'
                      ?<><span style={{display:'inline-block',width:12,height:12,borderRadius:3,background:String(ch.from),border:`1px solid ${C.b}`,flexShrink:0}}/><span style={{color:C.err}}>{ch.from}</span><span style={{color:C.t3,margin:'0 4px'}}>→</span><span style={{display:'inline-block',width:12,height:12,borderRadius:3,background:String(ch.to),border:`1px solid ${C.b}`,flexShrink:0}}/><span style={{color:C.ok}}>{ch.to}</span></>
                      :<><span style={{color:C.err,textDecoration:'line-through'}}>{ch.from}</span><span style={{color:C.t3,margin:'0 4px'}}>→</span><span style={{color:C.ok,fontWeight:500}}>{ch.to}</span></>
                    }
                  </div>
                ))}
              </div>
            ))}
          </Section>

          {/* Rimossi */}
          <Section color={C.err} bg={C.errBg} border={C.errBr} icon="🗑️" title="Rimossi dal database (assenti nel CSV)" count={diff.removed.length} defaultOpen={true}>
            <div style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:5,padding:'0.4rem 0.625rem',marginBottom:8,fontSize:'0.75rem',color:C.warn}}>
              ⚠ Questi materiali sono presenti nel database ma non nel CSV. Verranno eliminati se confermi.
            </div>
            {diff.removed.map((m,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'0.3rem 0',borderBottom:`1px solid ${C.b}`,fontSize:'0.8rem'}}>
                <span style={{color:C.err,fontWeight:500,flex:1}}>{m.nome}</span>
                <span style={{color:C.t3}}>{m.tipo}</span>
                <span style={{color:C.t3}}>{m.marca}</span>
                <span style={{color:C.warn}}>stock: {m.stock}g</span>
              </div>
            ))}
          </Section>

          {/* Invariati */}
          <Section color={C.t3} bg={C.s2} border={C.b} icon="✓" title="Invariati" count={diff.unchanged.length} defaultOpen={false}>
            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
              {diff.unchanged.map((m,i)=>(<span key={i} style={{background:C.s3,color:C.t3,borderRadius:4,padding:'2px 7px',fontSize:'0.72rem'}}>{m.nome}</span>))}
            </div>
          </Section>

          {/* Errori */}
          {errors.length>0&&(
            <div style={{border:`1px solid ${C.errBr}`,borderRadius:7,overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',gap:7,padding:'0.45rem 0.75rem',background:C.errBg}}>
                <span style={{fontSize:'1rem'}}>⚠</span>
                <span style={{color:C.err,fontWeight:600,fontSize:'0.83rem'}}>{t('csv_err_rows')}</span>
                <span style={{background:`${C.err}25`,color:C.err,borderRadius:10,padding:'1px 7px',fontSize:'0.72rem',fontWeight:700}}>{errors.length}</span>
              </div>
              <div style={{padding:'0.5rem 0.75rem',background:C.s1}}>
                {errors.map((e,i)=>(<div key={i} style={{color:C.t2,fontSize:'0.78rem',padding:'2px 0'}}>{e}</div>))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!hasChanges&&diff.unchanged.length>0&&(
          <div style={{textAlign:'center',color:C.t3,fontSize:'0.85rem',padding:'0.5rem',marginBottom:'0.75rem'}}>
            Nessuna modifica rilevata — il database è già allineato con il CSV.
          </div>
        )}
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{background:C.s3,border:`1px solid ${C.b}`,color:C.t,borderRadius:6,padding:'0.4rem 0.875rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.85rem'}}>{t('cancel')}</button>
          {hasChanges&&<button onClick={onConfirm} style={{background:C.a,border:'none',color:'#000',borderRadius:6,padding:'0.4rem 0.875rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.85rem',fontWeight:600,display:'inline-flex',alignItems:'center',gap:5}}>
            <Upload size={13}/>Conferma importazione
          </button>}
        </div>
      </div>
    </div>
  );
}


/* Tipi frequenti per il filtro rapido */
const QUICK_TYPES=['PLA','PLA+','PETG','ABS','TPU','ASA','Resin','PA (Nylon)'];

function MatInvView({mats,alerts,settings,setModal,setConfirm,setMats}){
  const {t,lang,colorLang}=useT();
  const fmtV=useFmt();
  const [view,setView]=useState('schede');      /* 'schede' | 'stock' */
  const [srch,setSrch]=useState('');
  const [ftTipo,setFtTipo]=useState('');        /* filtro tipo materiale (multi-select Set) */
  const [ftTipi,setFtTipi]=useState(new Set()); /* multi-select tipi materiale */
  const [ftMarca,setFtMarca]=useState('');      /* filtro marca */
  const [ftOpenSpools,setFtOpenSpools]=useState(false); /* solo mat con bobine aperte */
  const [ftRefill,setFtRefill]=useState(false);          /* solo mat con bobine refill */
  const [ftNoSpools,setFtNoSpools]=useState(false);      /* solo mat senza bobine */
  const [ftExclCrit,setFtExclCrit]=useState(false);      /* solo mat esclusi dai critici */
  const [ftRiord,setFtRiord]=useState(false);             /* solo mat in stato riordinato */
  const [groupBy,setGroupBy]=useState('tipo');  /* 'tipo' | 'marca' (solo vista stock) */
  const [selG,setSelG]=useState(null);
  const [selSub,setSelSub]=useState(null);
  const [showCrit,setShowCrit]=useState(false);
  const [critGroupBy,setCritGroupBy]=useState('tipo'); /* 'tipo'|'marca' per stampa critici */
  const [stockFilter,setStockFilter]=useState('');
  const [sortBy,setSortBy]=useState('tipo');    /* 'tipo'|'nome'|'marca'|'stock'|'val'|'price' */
  const [sortDir,setSortDir]=useState('asc');   /* 'asc'|'desc' */
  const [csvMsg,setCsvMsg]=useState(null);
  const [csvReport,setCsvReport]=useState(null);
  const csvImportRef=useRef();

  const toggleSort=k=>{if(sortBy===k)setSortDir(d=>d==='asc'?'desc':'asc');else{setSortBy(k);setSortDir('asc');}}

  const stockFilterN=(stockFilter!==''&&+stockFilter>0)?+stockFilter:null;
  const sub=groupBy==='tipo'?'marca':'tipo';
  const totInv=mats.reduce((s,m)=>s+(m.stock/1000)*m.prezzo,0);

  /* reset navigazione stock */
  const resetStock=()=>{setSelG(null);setSelSub(null);setShowCrit(false);};
  /* toggle flag riordinato su un materiale */
  const toggleRiordinato=id=>setMats(ms=>ms.map(m=>m.id===id?{...m,riordinato:!m.riordinato}:m));

  /* marche distinte */
  const allMarche=[...new Set(mats.map(m=>m.marca).filter(Boolean))].sort();

  /* filtro base (comune a entrambe le viste) */
  const baseFiltered=mats.filter(m=>{
    if(ftTipi.size>0&&!ftTipi.has(m.materiale||m.tipo))return false;
    if(ftMarca&&m.marca!==ftMarca)return false;
    if(stockFilterN&&m.stock>=stockFilterN)return false;
    if(ftOpenSpools&&!(m.spools||[]).some(s=>s.stato==='aperta'))return false;
    if(ftRefill&&!(m.spools||[]).some(s=>s.tipo_contenitore==='refill'))return false;
    if(ftNoSpools&&(m.spools||[]).length>0)return false;
    if(ftExclCrit&&!m.esclude_critici)return false;
    if(ftRiord&&!m.riordinato)return false;
    if(!srch)return true;
    const q=srch.toLowerCase();
    return[matNomeL(m,colorLang),m.materiale||'',m.tipo||'',m.tipo_mat||'',translateColor(m.nome_colore,colorLang)||'',m.marca||'',m.codice||''].some(v=>v.toLowerCase().includes(q));
  });

  /* toggle tipo nel set multi-select */
  const toggleTipo=tp=>setFtTipi(prev=>{const s=new Set(prev);s.has(tp)?s.delete(tp):s.add(tp);return s;});

  /* CSV */
  const handleCsvExport=()=>dlCsv(mats,`materiali-${new Date().toISOString().slice(0,10)}.csv`);
  const handleCsvImport=e=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{try{const result=parseCsvMats(ev.target.result,mats);if(!result.ok){setCsvMsg({type:'err',text:t('inv_csv_err')+': '+result.errors.join(' ')});return;}setCsvReport(result);}catch(err){setCsvMsg({type:'err',text:t('inv_csv_err')+': '+err.message});}};
    r.readAsText(file);e.target.value='';
  };
  const handleCsvConfirm=()=>{
    if(!csvReport)return;
    setMats(csvReport.mats);
    const{diff}=csvReport;const parts=[];
    if(diff.created.length)parts.push(`${diff.created.length} nuovi`);
    if(diff.updated.length)parts.push(`${diff.updated.length} modificati`);
    if(diff.removed.length)parts.push(`${diff.removed.length} rimossi`);
    setCsvReport(null);setCsvMsg({type:'ok',text:`Importazione completata: ${parts.join(', ')||'nessuna modifica'}.`});
    setTimeout(()=>setCsvMsg(null),5000);
  };

  /* ── Funzione sort materiali ── */
  const sortMats=arr=>{
    const mul=sortDir==='asc'?1:-1;
    return[...arr].sort((a,b)=>{
      switch(sortBy){
        case 'colore':return mul*((a.nome_colore||'').localeCompare(b.nome_colore||'','it')||matNome(a).localeCompare(matNome(b)));
        case 'marca':return mul*((a.marca||'').localeCompare(b.marca||''));
        case 'stock':return mul*(a.stock-b.stock);
        case 'val':return mul*((a.stock/1000*a.prezzo)-(b.stock/1000*b.prezzo));
        case 'price':return mul*(a.prezzo-b.prezzo);
        default:/* tipo */return mul*((a.materiale||a.tipo||'').localeCompare(b.materiale||b.tipo||'')||matNome(a).localeCompare(matNome(b)));
      }
    });
  };

  /* ── Vista Schede (MatCard grid) con raggruppamento critici per tipo ── */
  const SchedeView=()=>{
    const sorted=sortMats(baseFiltered);
    /* separa critici dagli ok — rispetta esclude_critici */
    const critici=sorted.filter(m=>getSt(m)!=='ok'&&!m.esclude_critici);
    const normali=sorted.filter(m=>getSt(m)==='ok'||m.esclude_critici);

    /* raggruppa i critici per tipo materiale */
    const critByTipo={};
    critici.forEach(m=>{
      const key=m.materiale||m.tipo||'—';
      if(!critByTipo[key])critByTipo[key]=[];
      critByTipo[key].push(m);
    });
    const critTipi=Object.keys(critByTipo).sort();

    const MatCard=({m})=>{
      const st=getSt(m);const pct=Math.min(100,(m.stock/(m.soglia*3+1))*100);
      const ncLang=translateColor(m.nome_colore,colorLang);
      const nmDisplay=[m.materiale||m.tipo,m.tipo_mat,ncLang].filter(Boolean).join(' ')||m.nome||'—';
      const txtClr=contrastText(m.colore);
      return(
        <div key={m.id} style={{background:C.s1,border:`1px solid ${st==='ok'?C.b:stBr(st)}`,borderRadius:10,overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <div style={{height:64,background:m.colore,flexShrink:0,position:'relative',display:'flex',alignItems:'center',padding:'0 8px 0 10px',gap:6}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:txtClr,fontSize:'0.82rem',fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textShadow:'0 1px 2px rgba(0,0,0,0.18)'}} title={nmDisplay}>{nmDisplay}</div>
              <div style={{color:txtClr,fontSize:'0.65rem',opacity:0.82,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={[m.marca,m.codice].filter(Boolean).join(' · ')||undefined}>{m.marca}{m.codice?` · ${m.codice}`:''}</div>
            </div>
            <Btn onClick={()=>setModal({type:'mat',data:m})} sm style={{background:'rgba(0,0,0,0.28)',border:'none',color:'#fff',flexShrink:0}}><Edit2 size={11}/></Btn>
            <Btn onClick={()=>setConfirm({type:'mat',id:m.id,nome:nmDisplay})} sm style={{background:'rgba(180,0,0,0.42)',border:'none',color:'#fff',flexShrink:0}}><Trash2 size={11}/></Btn>
          </div>
          <div style={{padding:'0.5rem 0.7rem',flex:1,display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
              <Badge label={m.materiale||m.tipo} color={tCm(m)}/>
              <div style={{textAlign:'right'}}>
                <div style={{color:C.a,fontSize:'0.78rem',fontWeight:500}}>{fmtV(m.prezzo)}/kg</div>
                {m.markup>0&&<div style={{color:C.warn,fontSize:'0.62rem',marginTop:1}}>mk +{m.markup}%</div>}
                {m.fallimento_pct>0&&<div style={{color:C.err,fontSize:'0.62rem',marginTop:1}}>fail +{m.fallimento_pct}%</div>}
              </div>
            </div>
            <div style={{display:'flex',gap:3,marginBottom:4,flexWrap:'wrap'}}>
              {m.diam&&<span style={{color:C.t3,fontSize:'0.65rem'}}>{m.diam}</span>}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:5}}>
              <div style={{flex:1,height:5,background:STOCK_BAR_GRADIENT,borderRadius:3,overflow:'hidden',position:'relative'}}>
                <div style={{position:'absolute',right:0,top:0,bottom:0,width:`${100-pct}%`,background:C.s2,transition:'width 0.3s'}}/>
              </div>
              <span style={{color:st==='err'?C.err:st==='warn'?C.warn:C.ok,fontSize:'0.68rem',minWidth:38,textAlign:'right',fontWeight:500}}>{m.stock}g</span>
            </div>
            {m.note&&<div style={{color:C.t3,fontSize:'0.65rem',marginTop:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={m.note}>{m.note}</div>}
            {/* Spacer: spinge il pulsante bobine sempre in fondo */}
            <div style={{flex:1}}/>
            {showCrit&&<button onClick={e=>{e.stopPropagation();toggleRiordinato(m.id);}}
              style={{marginTop:5,display:'flex',alignItems:'center',gap:4,background:m.riordinato?C.okBg:'transparent',border:`1px solid ${m.riordinato?C.okBr:C.b}`,color:m.riordinato?C.ok:C.t3,borderRadius:4,padding:'2px 8px',cursor:'pointer',fontSize:'0.65rem',fontFamily:'inherit',width:'100%',justifyContent:'center'}}>
              {m.riordinato?'✓ ':''}{t('crit_reordered')}
            </button>}
            {/* Indicatore bobine — sempre in fondo */}
            {(m.spools||[]).length>0&&<button onClick={e=>{e.stopPropagation();setModal({type:'spools',data:m});}}
              style={{marginTop:5,display:'flex',alignItems:'center',gap:4,background:C.s3,border:`1px solid ${C.b}`,color:C.t2,borderRadius:4,padding:'2px 8px',cursor:'pointer',fontSize:'0.65rem',fontFamily:'inherit',width:'100%',justifyContent:'center'}}>
              <Archive size={10}/>{m.spools.length} {t('spool_count')} · {t('spool_manage')}
            </button>}
            {(m.spools||[]).length===0&&<button onClick={e=>{e.stopPropagation();setModal({type:'spools',data:m});}}
              style={{marginTop:5,display:'flex',alignItems:'center',gap:4,background:'transparent',border:`1px dashed ${C.b}`,color:C.t3,borderRadius:4,padding:'2px 8px',cursor:'pointer',fontSize:'0.65rem',fontFamily:'inherit',width:'100%',justifyContent:'center'}}>
              <Plus size={10}/>{t('spool_add')}
            </button>}
          </div>
        </div>
      );
    };

    return(
      <>
        {/* Sezione critici raggruppati per tipo — solo quando pulsante critici attivo */}
        {showCrit&&critici.length>0&&<div style={{marginBottom:'1.25rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:'0.6rem',flexWrap:'wrap'}}>
            <AlertTriangle size={13} color={C.err}/>
            <span style={{color:C.err,fontWeight:600,fontSize:'0.82rem'}}>{t('inv_crit_title')} ({critici.length})</span>
            <button onClick={()=>setShowCrit(false)} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:'0.7rem',fontFamily:'inherit',textDecoration:'underline',marginLeft:4}}>{t('inv_show_all')}</button>
          </div>
          {critTipi.map(tipo=>(
            <div key={tipo} style={{marginBottom:'0.75rem'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:6,marginBottom:'0.4rem',padding:'0.2rem 0.5rem',background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:5}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:tC(tipo),display:'inline-block'}}/>
                <span style={{color:tC(tipo),fontWeight:700,fontSize:'0.78rem'}}>{tipo}</span>
                <span style={{color:C.err,fontSize:'0.72rem'}}>· {critByTipo[tipo].length} {t('inv_critical')}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8}}>
                {critByTipo[tipo].map(m=><MatCard key={m.id} m={m}/>)}
              </div>
            </div>
          ))}
          <div style={{height:1,background:C.b,marginBottom:'1rem'}}/>
        </div>}

        {/* Materiali normali — visibili solo quando NON siamo in modalità critici */}
        {!showCrit&&<>
          {sorted.length===0&&<div style={{color:C.t3,padding:'3rem',textAlign:'center'}}>{mats.length===0?<><div style={{marginBottom:'1rem'}}>{t('mat_none')}</div><Btn onClick={()=>setModal({type:'mat',data:null})} variant="pri">{t('add')}</Btn></>:t('mat_none')}</div>}
          {sorted.length>0&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8}}>
            {sorted.map(m=><MatCard key={m.id} m={m}/>)}
          </div>}
        </>}
      </>
    );
  };

  /* ── Vista Stock (gruppi) ── */
  const StockView=()=>{
    /* materiali filtrati (rispetta tutti i filtri attivi) — deve stare prima di shownBase */
    const filteredForGroups=baseFiltered;

    /* materiali filtrati nella vista stock */
    let shownBase=showCrit?alerts:selG&&selSub?filteredForGroups.filter(m=>m[groupBy]===selG&&m[sub]===selSub):[];
    let shown=[...shownBase].sort((a,b)=>matNome(a).localeCompare(matNome(b)));
    if(stockFilterN)shown=shown.filter(m=>m.stock<stockFilterN);
    if(srch.trim()){const q=srch.toLowerCase();shown=shown.filter(m=>[matNomeL(m,colorLang),m.materiale||'',m.tipo_mat||'',translateColor(m.nome_colore,colorLang)||'',m.marca||'',m.codice||''].some(v=>v.toLowerCase().includes(q)));}

    const allGroups=!selG&&!showCrit
      ?[...new Set(filteredForGroups.map(m=>m[groupBy]))].filter(Boolean).sort().map(g=>{
          const gm=filteredForGroups.filter(m=>m[groupBy]===g);
          const crit=gm.filter(m=>getSt(m)!=='ok').length;
          const totG=gm.reduce((s,m)=>s+m.stock,0);
          const totVal=gm.reduce((s,m)=>s+(m.stock/1000)*m.prezzo,0);
          const nAperte=gm.reduce((s,m)=>s+(m.spools||[]).filter(sp=>sp.stato==='aperta').length,0);
          const tipi=[...new Set(gm.map(m=>m.materiale||m.tipo).filter(Boolean))].sort();
          return{name:g,total:gm.length,crit,totG,totVal,nAperte,tipi};
        })
      :null;
    const groups=allGroups?(stockFilterN?allGroups.filter(g=>g.totG<stockFilterN):allGroups):null;
    /* sotto-gruppi del primo livello selezionato */
    const sGsData=selG&&!showCrit
      ?[...new Set(filteredForGroups.filter(m=>m[groupBy]===selG).map(m=>m[sub]))].filter(Boolean).sort().map(sg=>{
          const sgm=filteredForGroups.filter(m=>m[groupBy]===selG&&m[sub]===sg);
          const crit=sgm.filter(m=>getSt(m)!=='ok').length;
          const totG=sgm.reduce((s,m)=>s+m.stock,0);
          const totVal=sgm.reduce((s,m)=>s+(m.stock/1000)*m.prezzo,0);
          const nAperte=sgm.reduce((s,m)=>s+(m.spools||[]).filter(sp=>sp.stato==='aperta').length,0);
          return{name:sg,total:sgm.length,crit,totG,totVal,nAperte};
        })
      :null;

    /* colore gruppo */
    const gClr=g=>groupBy==='tipo'?tC(g):brandColor(g);

    return(<>
      {/* Livello 1b → sotto-gruppi come card (es. SUNLU → ABS, PLA, PETG) */}
      {sGsData&&!selSub&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(195px,1fr))',gap:10,marginBottom:'1rem'}}>
          {sGsData.map(sg=>(
            <button key={sg.name} onClick={()=>setSelSub(sg.name)}
              style={{background:C.s1,border:`1px solid ${sg.crit>0?C.errBr:C.b}`,borderRadius:8,padding:'0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit',display:'block'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:5}}>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:9,height:9,borderRadius:'50%',background:gClr(sg.name),display:'inline-block',flexShrink:0}}/>
                  <span style={{color:gClr(sg.name),fontWeight:600,fontSize:'0.85rem'}}>{sg.name||'—'}</span>
                </div>
                {sg.crit>0&&<span style={{background:C.errBg,color:C.err,fontSize:'0.65rem',padding:'1px 5px',borderRadius:3,flexShrink:0}}>{sg.crit} crit.</span>}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3px 8px',marginBottom:5}}>
                <div>
                  <div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'.03em'}}>Mat.</div>
                  <div style={{color:C.t,fontSize:'0.8rem',fontWeight:600}}>{sg.total}</div>
                </div>
                <div>
                  <div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'.03em'}}>Stock</div>
                  <div style={{color:C.t2,fontSize:'0.8rem',fontWeight:600}}>{(sg.totG/1000).toFixed(2)} kg</div>
                </div>
                <div>
                  <div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'.03em'}}>Valore</div>
                  <div style={{color:C.ok,fontSize:'0.8rem',fontWeight:600}}>{fmtV(sg.totVal)}</div>
                </div>
                {sg.nAperte>0&&<div>
                  <div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'.03em'}}>Aperte</div>
                  <div style={{color:C.blue,fontSize:'0.8rem',fontWeight:600}}>{sg.nAperte} bob.</div>
                </div>}
              </div>
              <div style={{marginTop:4,height:3,background:C.s2,borderRadius:1,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${Math.min(100,sg.total>0?(sg.total-sg.crit)/sg.total*100:100)}%`,background:gClr(sg.name),borderRadius:1}}/>
              </div>
            </button>
          ))}
          {sGsData.length===0&&<div style={{color:C.t3,padding:'1.5rem',textAlign:'center',gridColumn:'1/-1'}}>{t('mat_none')}</div>}
        </div>
      )}

      {/* Grid gruppi — ordinati A-Z, scorrimento orizzontale = left-to-right */}
      {groups&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:10,marginBottom:'1rem'}}>
        {groups.map(g=>(
          <button key={g.name} onClick={()=>setSelG(g.name)} style={{background:C.s1,border:`1px solid ${g.crit>0?C.errBr:C.b}`,borderRadius:8,padding:'0.875rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit',display:'block'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{width:10,height:10,borderRadius:'50%',background:gClr(g.name),display:'inline-block',flexShrink:0}}/>
                <span style={{color:gClr(g.name),fontWeight:600,fontSize:'0.88rem'}}>{g.name}</span>
              </div>
              {g.crit>0&&<span style={{background:C.errBg,color:C.err,fontSize:'0.68rem',padding:'2px 5px',borderRadius:3,flexShrink:0}}>{g.crit} {t('inv_critical')}</span>}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3px 8px',marginBottom:6}}>
              <div>
                <div style={{color:C.t3,fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'.03em'}}>Materiali</div>
                <div style={{color:C.t,fontSize:'0.82rem',fontWeight:600}}>{g.total}</div>
              </div>
              <div>
                <div style={{color:C.t3,fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'.03em'}}>Stock</div>
                <div style={{color:C.t2,fontSize:'0.82rem',fontWeight:600}}>{(g.totG/1000).toFixed(2)} kg</div>
              </div>
              <div>
                <div style={{color:C.t3,fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'.03em'}}>Valore</div>
                <div style={{color:C.ok,fontSize:'0.82rem',fontWeight:600}}>{fmtV(g.totVal)}</div>
              </div>
              {g.nAperte>0&&<div>
                <div style={{color:C.t3,fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'.03em'}}>Aperte</div>
                <div style={{color:C.blue,fontSize:'0.82rem',fontWeight:600}}>{g.nAperte} bob.</div>
              </div>}
            </div>
            {groupBy==='marca'&&g.tipi.length>0&&(
              <div style={{color:C.t3,fontSize:'0.65rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:6}} title={g.tipi.join(' · ')}>
                {g.tipi.join(' · ')}
              </div>
            )}
            <div style={{marginTop:4,height:4,background:C.s2,borderRadius:2,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${Math.min(100,g.total>0?(g.total-g.crit)/g.total*100:100)}%`,background:gClr(g.name),borderRadius:2}}/>
            </div>
          </button>
        ))}
      </div>}

      {(selG&&selSub||showCrit)&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(max(200px,24%),1fr))',gap:10}}>
        {shown.map(m=>{const st=getSt(m);const pct=Math.min(100,(m.stock/(m.soglia*3+1))*100);const val=(m.stock/1000)*m.prezzo;return(
          <div key={m.id} style={{background:C.s1,border:`1px solid ${st==='ok'?C.b:stBr(st)}`,borderRadius:8,padding:'0.875rem',display:'flex',flexDirection:'column'}}>
            {/* Header con nome e pulsanti scheda/elimina */}
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:'0.5rem'}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:m.colore,border:'1.5px solid rgba(255,255,255,0.15)',flexShrink:0}}/>
              <span style={{color:C.t,fontWeight:500,fontSize:'0.83rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}} title={matNomeL(m,colorLang)}>{matNomeL(m,colorLang)}</span>
              <button onClick={()=>setModal({type:'mat',data:m})} title={t('inv_stk_open_card')}
                style={{background:'rgba(255,255,255,0.07)',border:'none',color:C.t3,borderRadius:4,padding:'2px 5px',cursor:'pointer',display:'flex',alignItems:'center',flexShrink:0}}>
                <Edit2 size={9}/>
              </button>
              <button onClick={()=>setConfirm({type:'mat',id:m.id,nome:matNome(m)})} title={t('del')}
                style={{background:'rgba(200,0,0,0.15)',border:'none',color:C.err,borderRadius:4,padding:'2px 5px',cursor:'pointer',display:'flex',alignItems:'center',flexShrink:0}}>
                <Trash2 size={9}/>
              </button>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:5}}>
              <div><span style={{color:stClr(st),fontSize:'1.1rem',fontWeight:700}}>{m.stock}g</span><span style={{color:C.t3,fontSize:'0.68rem',marginLeft:3}}>min {m.soglia}g</span></div>
              <div style={{textAlign:'right'}}><div style={{color:C.t3,fontSize:'0.65rem'}}>{t('inv_val_short')}</div><div style={{color:C.a,fontWeight:500,fontSize:'0.8rem'}}>{fmtV(val)}</div></div>
            </div>
            <div style={{height:5,background:STOCK_BAR_GRADIENT,borderRadius:3,overflow:'hidden',marginBottom:5,position:'relative'}}>
              <div style={{position:'absolute',right:0,top:0,bottom:0,width:`${100-pct}%`,background:C.s2}}/>
            </div>
            <div style={{color:C.t3,fontSize:'0.65rem',marginBottom:3}}>{m.marca}</div>
            <div style={{color:tCm(m),fontSize:'0.65rem',marginBottom:4}}>{m.materiale||m.tipo}{m.tipo_mat?` ${m.tipo_mat}`:''}</div>
            <div style={{flex:1}}/>
            {/* Bottoni in fondo: Riordinato sopra, poi Bobine + Agg.Tot.Stock */}
            <div style={{display:'flex',flexDirection:'column',gap:3,paddingTop:4,borderTop:`1px solid ${C.b}`}}>
              <button onClick={e=>{e.stopPropagation();toggleRiordinato(m.id);}} title={t('crit_reordered')}
                style={{display:'flex',alignItems:'center',justifyContent:'center',gap:3,background:m.riordinato?C.okBg:'transparent',border:`1px solid ${m.riordinato?C.okBr:C.b}`,color:m.riordinato?C.ok:C.t3,padding:'0.2rem 0.5rem',borderRadius:4,cursor:'pointer',fontSize:'0.68rem',fontFamily:'inherit',width:'100%'}}>
                {m.riordinato?'✓ ':''}{t('crit_reordered')}
              </button>
              <div style={{display:'flex',gap:3}}>
                <button onClick={()=>setModal({type:'spools',data:m})} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:3,background:C.s2,border:`1px solid ${C.b}`,color:C.t2,padding:'0.2rem 0.4rem',borderRadius:4,cursor:'pointer',fontSize:'0.68rem',fontFamily:'inherit'}}>
                  <Archive size={9}/>{t('inv_ft_spools')} ({(m.spools||[]).length})
                </button>
                <button onClick={()=>setModal({type:'stock',data:m})} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:3,background:C.s2,border:`1px solid ${C.b}`,color:C.t2,padding:'0.2rem 0.4rem',borderRadius:4,cursor:'pointer',fontSize:'0.68rem',fontFamily:'inherit'}}>
                  <RefreshCw size={9}/>{t('inv_stk_agg')}
                </button>
              </div>
            </div>
          </div>
        );})}
        {shown.length===0&&<div style={{color:C.t3,gridColumn:'1/-1',padding:'2rem',textAlign:'center'}}>{t('mat_none')}</div>}
      </div>}
    </>);
  };

  /* ── Calcolo conteggio per il badge (fuori dal JSX) ── */
  const stockSub=groupBy==='tipo'?'marca':'tipo';
  let stockShown=showCrit?alerts:selG&&selSub?baseFiltered.filter(m=>m[groupBy]===selG&&m[stockSub]===selSub):baseFiltered;
  if(stockFilterN)stockShown=stockShown.filter(m=>m.stock<stockFilterN);
  if(srch.trim()){const q=srch.toLowerCase();stockShown=stockShown.filter(m=>[matNomeL(m,colorLang),m.materiale||'',m.tipo_mat||'',translateColor(m.nome_colore,colorLang)||'',m.marca||''].some(v=>v.toLowerCase().includes(q)));}
  const stockVal=stockShown.reduce((s,m)=>s+(m.stock/1000)*m.prezzo,0);

  return(<div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
    {/* ── ZONA FISSA (filtri sempre visibili) ── */}
    <div style={{flexShrink:0}}>
    {/* ── HEADER ── */}
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem',flexWrap:'wrap',gap:6}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {view==='stock'&&(selG||showCrit)&&(
          <button onClick={()=>{if(selSub)setSelSub(null);else resetStock();}} style={{background:C.s2,border:`1px solid ${C.b}`,color:C.t2,borderRadius:6,padding:'0.3rem 0.5rem',cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontSize:'0.78rem',fontFamily:'inherit'}}><ChevronLeft size={13}/>{selSub?selG:t('back')}</button>
        )}
        <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,display:'flex',alignItems:'center',gap:6}}>
          {t('nav_inv')}
          {view==='stock'&&selG&&<><ChevronRight size={13} color={C.t3}/><span style={{color:brandColor(selG)||tC(selG),fontSize:'0.95rem'}}>{selG}</span></>}
          {view==='stock'&&selSub&&<><ChevronRight size={13} color={C.t3}/><span style={{color:C.blue,fontSize:'0.95rem'}}>{selSub}</span></>}
          {view==='stock'&&showCrit&&<><ChevronRight size={13} color={C.t3}/><span style={{color:C.err,fontSize:'0.95rem'}}>{t('inv_critical')}</span></>}
        </div>
      </div>
      <div style={{display:'flex',gap:5,flexWrap:'wrap',alignItems:'center'}}>
        {/* Vista toggle */}
        <div style={{display:'flex',background:C.s2,borderRadius:6,padding:2,border:`1px solid ${C.b}`}}>
          {[['schede',t('inv_view_schede')],['stock',t('inv_view_stock')]].map(([k,l])=>(
            <button key={k} onClick={()=>{setView(k);resetStock();setShowCrit(false);}} style={{padding:'3px 10px',borderRadius:4,border:'none',background:view===k?C.s1:'transparent',color:view===k?C.a:C.t3,cursor:'pointer',fontSize:'0.75rem',fontFamily:'inherit',fontWeight:view===k?600:400}}>{l}</button>
          ))}
        </div>
        {/* Raggruppa (solo stock, non in dettaglio) */}
        {view==='stock'&&!selG&&!showCrit&&[['tipo',t('inv_typology')],['marca',t('inv_brand')]].map(([k,l])=>(
          <button key={k} onClick={()=>{setGroupBy(k);resetStock();}} style={{padding:'0.25rem 0.6rem',borderRadius:5,border:`1px solid ${groupBy===k?C.a:C.b}`,background:groupBy===k?C.a2:'transparent',color:groupBy===k?C.a:C.t2,cursor:'pointer',fontSize:'0.75rem',fontFamily:'inherit'}}>{l}</button>
        ))}
        {alerts.length>0&&<button onClick={()=>{setShowCrit(true);setSelG(null);setSelSub(null);}} style={{display:'flex',alignItems:'center',gap:4,background:showCrit?C.errBg:'transparent',border:`1px solid ${C.errBr}`,color:C.err,padding:'0.25rem 0.6rem',borderRadius:5,cursor:'pointer',fontSize:'0.75rem',fontFamily:'inherit'}}><AlertTriangle size={11}/>{alerts.length} {t('inv_critical')}</button>}
        {showCrit&&alerts.length>0&&<div style={{display:'flex',alignItems:'stretch',borderRadius:5,overflow:'hidden',border:`1px solid ${C.errBr}`}}>
          <button onClick={()=>openPdf(buildCriticiHtml(alerts,settings,lang,critGroupBy))}
            style={{display:'flex',alignItems:'center',gap:4,background:C.errBg,border:'none',borderRight:`1px solid ${C.errBr}`,color:C.err,padding:'3px 8px',cursor:'pointer',fontSize:'0.7rem',fontFamily:'inherit',fontWeight:600}}>
            <FileText size={11}/>{t('inv_print_crit')}
          </button>
          {[['tipo',t('inv_typology')],['marca',t('inv_brand')]].map(([k,l])=>(
            <button key={k} onClick={()=>setCritGroupBy(k)}
              style={{background:critGroupBy===k?C.errBg:'transparent',border:'none',borderRight:k==='tipo'?`1px solid ${C.errBr}`:'none',color:critGroupBy===k?C.err:C.t3,padding:'3px 7px',cursor:'pointer',fontSize:'0.67rem',fontFamily:'inherit',fontWeight:critGroupBy===k?700:400}}>
              {l}
            </button>
          ))}
        </div>}
        <Btn onClick={()=>{
          const filterDesc=[...(ftTipi.size>0?[...ftTipi]:[]),ftMarca,ftOpenSpools?t('inv_ft_open'):'',ftRefill?t('inv_ft_refill'):''].filter(Boolean);
          const filters={tipi:filterDesc.join(', ')};
          openPdf(buildMatsListHtml(sortMats(baseFiltered),settings,lang,filters));
        }} variant="sec" sm title={t('inv_print_list')}><FileText size={11}/>{t('inv_print_list')}</Btn>
        <Btn onClick={()=>window.open('https://3dfilamentprofiles.com','_blank')} variant="ok" sm title="3D Filament Profiles DB"><Eye size={11}/>3DFP</Btn>
        <Btn onClick={()=>setModal({type:'mat',data:null})} variant="pri" sm><Plus size={12}/>{t('add')}</Btn>
      </div>
    </div>

    {/* ── FILTRI ── */}
    <div style={{display:'flex',gap:6,marginBottom:'0.75rem',flexWrap:'wrap',alignItems:'center'}}>
      {/* Ricerca */}
      <div style={{position:'relative'}}>
        <Search size={12} style={{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
        <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder={t('search')+'...'} style={{...inp,paddingLeft:'1.6rem',width:180,fontSize:'0.78rem'}}/>
        {srch&&<button onClick={()=>setSrch('')} style={{position:'absolute',right:5,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:C.t3,cursor:'pointer',padding:1,display:'flex'}}><X size={10}/></button>}
      </div>
      {/* Quick types — multi-select */}
      <button onClick={()=>setFtTipi(new Set())}
        style={{padding:'0.2rem 0.55rem',borderRadius:4,border:`1px solid ${ftTipi.size===0?C.a:C.b}`,background:ftTipi.size===0?C.a2:'transparent',color:ftTipi.size===0?C.a:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit'}}>
        {t('inv_all')}
      </button>
      {(settings.quick_types||QUICK_TYPES).map(tp=>(
        <button key={tp} onClick={()=>toggleTipo(tp)}
          style={{padding:'0.2rem 0.55rem',borderRadius:4,border:`1px solid ${ftTipi.has(tp)?tC(tp):C.b}`,background:ftTipi.has(tp)?`${tC(tp)}22`:'transparent',color:ftTipi.has(tp)?tC(tp):C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',fontWeight:ftTipi.has(tp)?600:400}}>
          {tp}
        </button>
      ))}
      {/* Separatore */}
      <span style={{color:C.b,fontSize:'0.7rem'}}>│</span>
      {/* Filtri bobine: Aperte · Senza Bobine · Refill */}
      <button onClick={()=>setFtOpenSpools(v=>!v)}
        style={{padding:'0.2rem 0.55rem',borderRadius:4,border:`1px solid ${ftOpenSpools?C.ok:C.b}`,background:ftOpenSpools?C.okBg:'transparent',color:ftOpenSpools?C.ok:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',display:'flex',alignItems:'center',gap:3,fontWeight:ftOpenSpools?600:400}}>
        <Archive size={10}/>{t('inv_ft_open')}
      </button>
      <button onClick={()=>setFtNoSpools(v=>!v)}
        style={{padding:'0.2rem 0.55rem',borderRadius:4,border:`1px solid ${ftNoSpools?C.err:C.b}`,background:ftNoSpools?C.errBg:'transparent',color:ftNoSpools?C.err:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',display:'flex',alignItems:'center',gap:3,fontWeight:ftNoSpools?600:400}}>
        <Archive size={10}/>{t('inv_ft_no_spools')}
      </button>
      <button onClick={()=>setFtRefill(v=>!v)}
        style={{padding:'0.2rem 0.55rem',borderRadius:4,border:`1px solid ${ftRefill?C.purple:C.b}`,background:ftRefill?C.purpleBg:'transparent',color:ftRefill?C.purple:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',display:'flex',alignItems:'center',gap:3,fontWeight:ftRefill?600:400}}>
        <Archive size={10}/>{t('inv_ft_refill')}
      </button>
      <button onClick={()=>setFtExclCrit(v=>!v)}
        style={{padding:'0.2rem 0.55rem',borderRadius:4,border:`1px solid ${ftExclCrit?C.t2:C.b}`,background:ftExclCrit?C.s3:'transparent',color:ftExclCrit?C.t2:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',display:'flex',alignItems:'center',gap:3,fontWeight:ftExclCrit?600:400}}>
        <Lock size={10}/>{t('inv_ft_excl_crit')}
      </button>
      <button onClick={()=>setFtRiord(v=>!v)}
        style={{padding:'0.2rem 0.55rem',borderRadius:4,border:`1px solid ${ftRiord?C.ok:C.b}`,background:ftRiord?C.okBg:'transparent',color:ftRiord?C.ok:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',display:'flex',alignItems:'center',gap:3,fontWeight:ftRiord?600:400}}>
        <RefreshCw size={10}/>{t('inv_ft_riord')}
      </button>
      {/* Separatore */}
      <span style={{color:C.b,fontSize:'0.7rem'}}>│</span>
      {/* Tendina Materiale */}
      {(()=>{
        const allTipi=[...new Set(mats.map(m=>m.materiale||m.tipo).filter(Boolean))].sort();
        return allTipi.length>0&&(
          <select value={ftTipi.size===1?[...ftTipi][0]:''} onChange={e=>{setFtTipi(e.target.value?new Set([e.target.value]):new Set());}} style={{...inp,fontSize:'0.72rem',padding:'0.2rem 0.5rem',maxWidth:110}}>
            <option value="">{t('inv_typology')}</option>
            {allTipi.map(tp=><option key={tp} value={tp}>{tp}</option>)}
          </select>
        );
      })()}
      {/* Tendina Marca */}
      {allMarche.length>0&&(
        <select value={ftMarca} onChange={e=>setFtMarca(e.target.value)} style={{...inp,fontSize:'0.72rem',padding:'0.2rem 0.5rem',maxWidth:120}}>
          <option value="">{t('inv_brand')}</option>
          {allMarche.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
      )}
      {/* Stock filter */}
      <div style={{display:'flex',alignItems:'center',gap:4}}>
        <span style={{color:C.t3,fontSize:'0.72rem',whiteSpace:'nowrap'}}>&lt;</span>
        <input type="number" value={stockFilter} onChange={e=>setStockFilter(e.target.value)} placeholder="g" min={0} step={1} style={{...inp,width:60,padding:'0.2rem 0.4rem',fontSize:'0.72rem'}}/>
        <span style={{color:C.t3,fontSize:'0.72rem'}}>g</span>
        {stockFilterN&&<button onClick={()=>setStockFilter('')} style={{background:'none',border:'none',color:C.warn,cursor:'pointer',padding:1,display:'flex'}}><X size={11}/></button>}
      </div>
    </div>

    {/* ── FILTRI ATTIVI ── */}
    {(ftTipi.size>0||ftMarca||stockFilterN||ftOpenSpools||ftRefill||ftNoSpools||ftExclCrit||ftRiord)&&(
      <div style={{display:'flex',gap:5,marginBottom:'0.5rem',flexWrap:'wrap',alignItems:'center'}}>
        <span style={{color:C.t3,fontSize:'0.7rem'}}>{t('inv_filters')}</span>
        {[...ftTipi].map(tp=>(
          <span key={tp} style={{background:`${tC(tp)}18`,color:tC(tp),border:`1px solid ${tC(tp)}44`,borderRadius:4,padding:'1px 8px',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:4}}>
            {tp}<button onClick={()=>toggleTipo(tp)} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button>
          </span>
        ))}
        {ftMarca&&<span style={{background:C.blueBg,color:C.blue,border:`1px solid ${C.blueBr}`,borderRadius:4,padding:'1px 8px',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:4}}>{ftMarca}<button onClick={()=>setFtMarca('')} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button></span>}
        {ftOpenSpools&&<span style={{background:C.okBg,color:C.ok,border:`1px solid ${C.okBr}`,borderRadius:4,padding:'1px 8px',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:4}}><Archive size={9}/>{t('inv_ft_open')}<button onClick={()=>setFtOpenSpools(false)} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button></span>}
        {ftRefill&&<span style={{background:C.purpleBg,color:C.purple,border:`1px solid ${C.purpleBr}`,borderRadius:4,padding:'1px 8px',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:4}}><Archive size={9}/>{t('inv_ft_refill')}<button onClick={()=>setFtRefill(false)} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button></span>}
        {ftNoSpools&&<span style={{background:C.errBg,color:C.err,border:`1px solid ${C.errBr}`,borderRadius:4,padding:'1px 8px',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:4}}><Archive size={9}/>{t('inv_ft_no_spools')}<button onClick={()=>setFtNoSpools(false)} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button></span>}
        {ftExclCrit&&<span style={{background:C.s3,color:C.t2,border:`1px solid ${C.b}`,borderRadius:4,padding:'1px 8px',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:4}}><Lock size={9}/>{t('inv_ft_excl_crit')}<button onClick={()=>setFtExclCrit(false)} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button></span>}
        {ftRiord&&<span style={{background:C.okBg,color:C.ok,border:`1px solid ${C.okBr}`,borderRadius:4,padding:'1px 8px',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:4}}><RefreshCw size={9}/>{t('inv_ft_riord')}<button onClick={()=>setFtRiord(false)} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button></span>}
        {stockFilterN&&<span style={{background:C.warnBg,color:C.warn,border:`1px solid ${C.warnBr}`,borderRadius:4,padding:'1px 8px',fontSize:'0.72rem',display:'flex',alignItems:'center',gap:4}}>stock &lt; {stockFilterN}g<button onClick={()=>setStockFilter('')} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button></span>}
        <button onClick={()=>{setFtTipi(new Set());setFtMarca('');setStockFilter('');setFtOpenSpools(false);setFtRefill(false);setFtNoSpools(false);setFtExclCrit(false);setFtRiord(false);}} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:'0.7rem',fontFamily:'inherit',padding:'1px 4px',textDecoration:'underline'}}>{t('inv_remove_filters')}</button>
      </div>
    )}

    {/* ── ORDINAMENTO (solo vista schede) ── */}
    {view==='schede'&&<div style={{display:'flex',gap:4,marginBottom:'0.5rem',flexWrap:'wrap',alignItems:'center'}}>
      <span style={{color:C.t3,fontSize:'0.7rem',marginRight:2}}>{t('inv_sort')}:</span>
      {[['tipo',t('inv_sort_tipo')],['colore',t('inv_sort_colore')],['marca',t('inv_sort_marca')],['stock',t('inv_sort_stock')],['val',t('inv_sort_val')],['price',t('inv_sort_price')]].map(([k,l])=>(
        <button key={k} onClick={()=>toggleSort(k)}
          style={{padding:'0.15rem 0.5rem',borderRadius:4,border:`1px solid ${sortBy===k?C.a:C.b}`,background:sortBy===k?C.a2:'transparent',color:sortBy===k?C.a:C.t3,cursor:'pointer',fontSize:'0.68rem',fontFamily:'inherit',display:'flex',alignItems:'center',gap:3}}>
          {l}{sortBy===k&&<span style={{fontSize:'0.6rem'}}>{sortDir==='asc'?'▲':'▼'}</span>}
        </button>
      ))}
    </div>}

    {/* CSV msg */}
    {csvMsg&&<div style={{background:csvMsg.type==='ok'?C.okBg:C.errBg,border:`1px solid ${csvMsg.type==='ok'?C.okBr:C.errBr}`,borderRadius:6,padding:'0.4rem 0.75rem',marginBottom:'0.5rem',fontSize:'0.8rem',color:csvMsg.type==='ok'?C.ok:C.err,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span>{csvMsg.text}</span><button onClick={()=>setCsvMsg(null)} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',display:'flex'}}><X size={12}/></button>
    </div>}

    {/* Conta risultati */}
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'0.625rem'}}>
      {view==='stock'?(
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{background:C.a2,border:`1px solid ${C.a3}`,borderRadius:7,padding:'0.3rem 0.875rem',display:'flex',alignItems:'center',gap:6}}>
            <span style={{color:C.a,fontWeight:700,fontSize:'1.1rem'}}>{stockShown.length}</span>
            <span style={{color:C.t2,fontSize:'0.78rem'}}>{t('nav_mat').toLowerCase()}</span>
          </div>
          {(selG||showCrit)&&<span style={{color:C.t3,fontSize:'0.72rem'}}>· val. {fmtV(stockVal)}</span>}
          {!(selG||showCrit)&&<span style={{color:C.t3,fontSize:'0.72rem'}}>· tot. inv. {fmtV(totInv)}</span>}
        </div>
      ):(
        /* Vista Schede — badge uguale alla vista Stock */
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{background:C.a2,border:`1px solid ${C.a3}`,borderRadius:7,padding:'0.3rem 0.875rem',display:'flex',alignItems:'center',gap:6}}>
            <span style={{color:C.a,fontWeight:700,fontSize:'1.1rem'}}>{baseFiltered.length}</span>
            <span style={{color:C.t2,fontSize:'0.78rem'}}>{t('nav_mat').toLowerCase()}</span>
          </div>
          <span style={{color:C.t3,fontSize:'0.72rem'}}>· {t('inv_total_val')}: {fmtV(totInv)}</span>
        </div>
      )}
    </div>
    </div>{/* fine zona fissa */}

    {/* ── CONTENUTO SCROLLABILE ── */}
    <div style={{flex:1,overflowY:'auto',paddingTop:'0.25rem'}}>
      {view==='schede'?<SchedeView/>:<StockView/>}
      {csvReport&&<CsvImportReport report={csvReport} onConfirm={handleCsvConfirm} onClose={()=>setCsvReport(null)}/>}
    </div>
  </div>);
}

function PrinterView({printers,setModal,setConfirm,settings}){
  const {t}=useT();
  const fmtV=useFmt();
  return(<div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
      <div style={{color:C.t,fontSize:'1.25rem',fontWeight:500}}>{t('nav_pr')}</div>
      <Btn onClick={()=>setModal({type:'printer',data:null})} variant="pri"><Plus size={13}/>{t('add')}</Btn>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(275px,1fr))',gap:10}}>
      {printers.map(p=>{
        const nome=prNome(p);
        return(<div key={p.id} style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:8,padding:'1rem',display:'flex',flexDirection:'column',gap:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              {(p.marca||p.modello)?(<>
                <div style={{color:C.t3,fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>{p.marca}</div>
                <div style={{color:C.t,fontWeight:600,fontSize:'1rem'}}>{p.modello||nome}</div>
              </>):(
                <div style={{color:C.t,fontWeight:600,fontSize:'0.95rem'}}>{nome}</div>
              )}
            </div>
            <div style={{display:'flex',gap:4}}>
              <Btn onClick={()=>setModal({type:'printer',data:p})} sm><Edit2 size={12}/></Btn>
              <Btn onClick={()=>setConfirm({type:'printer',id:p.id,nome})} sm variant="dan"><Trash2 size={12}/></Btn>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div style={{background:C.s2,borderRadius:6,padding:'0.5rem 0.75rem'}}>
              <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase'}}>{t('pr_consumption')}</div>
              <div style={{color:C.blue,fontWeight:600,fontSize:'1.05rem',marginTop:1}}>{p.e_kwh} kW</div>
            </div>
            <div style={{background:C.s2,borderRadius:6,padding:'0.5rem 0.75rem'}}>
              <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase'}}>{t('pr_amort')}</div>
              <div style={{color:C.warn,fontWeight:600,fontSize:'1.05rem',marginTop:1}}>{fmtV(p.a_h)}/h</div>
            </div>
          </div>
          <div style={{padding:'0.5rem 0.75rem',background:C.s2,borderRadius:6}}>
            <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',marginBottom:2}}>{t('pr_hourly')}</div>
            <div style={{color:C.a,fontWeight:500,fontSize:'0.9rem'}}>{fmtV(p.e_kwh*settings.c_kwh+p.a_h)}/h</div>
          </div>
          {p.note&&<div style={{color:C.t3,fontSize:'0.72rem',borderTop:`1px solid ${C.b}`,paddingTop:6}}>{p.note}</div>}
        </div>);
      })}
      {printers.length===0&&<div style={{color:C.t3,textAlign:'center',padding:'3rem',gridColumn:'1/-1'}}>
        {t('pr_none')}<br/><br/><Btn onClick={()=>setModal({type:'printer',data:null})} variant="pri">{t('add')}</Btn>
      </div>}
    </div>
  </div>);
}

function PrintView({prints,mats,printers,quotes,settings,onAddPrint,onEditPrint,setModal,setConfirm,isMobile}){
  const {t,lang,colorLang}=useT();
  const fmtV=useFmt();
  const [srchP,setSrchP]=useState('');
  const [filterStato,setFilterStato]=useState('');
  const [selId,setSelId]=useState(null);   // print selezionata nel pannello destro
  const [isNew,setIsNew]=useState(false);  // true = form nuova stampa
  const [collapsedGroups,setCollapsedGroups]=useState({});  // {qid: true/false}

  const toggleGroup=qid=>setCollapsedGroups(p=>{const cur=p[qid]===undefined?true:!!p[qid];return{...p,[qid]:!cur};});

  const tot=prints.reduce((s,p)=>s+(p.costo||0),0);
  const counts={attesa:prints.filter(p=>p.stato==='In attesa').length,corso:prints.filter(p=>p.stato==='In corso').length,fallite:prints.filter(p=>p.stato==='Fallita').length,completate:prints.filter(p=>p.stato==='Completata').length};

  /* Stampa selezionata nel pannello destro */
  const selPrint=prints.find(p=>p.id===selId)||null;

  /* Filtra e cerca */
  const shown=prints.filter(p=>{
    if(filterStato&&p.stato!==filterStato)return false;
    if(!srchP)return true;
    const q=srchP.toLowerCase();
    const lQ=p.quote_id?quotes.find(x=>x.id===p.quote_id):null;
    const matNames=(p.materials||[]).map(({mat_id})=>{const m=mats.find(x=>x.id===mat_id);return m?matNomeL(m,colorLang):'';}).join(' ');
    return[p.nome||'',p.cliente||'',lQ?.numero||'',lQ?.cliente||'',lQ?.nome_progetto||'',matNames].some(v=>v.toLowerCase().includes(q));
  });

  /* group by quote */
  const byQuote={};
  shown.forEach(p=>{
    const key=p.quote_id||'__none__';
    if(!byQuote[key])byQuote[key]=[];
    byQuote[key].push(p);
  });
  const groups=Object.entries(byQuote).sort(([a],[b])=>{
    if(a==='__none__')return 1;if(b==='__none__')return -1;
    const qa=quotes.find(q=>q.id===a);const qb=quotes.find(q=>q.id===b);
    return(qb?.data||'').localeCompare(qa?.data||'');
  });

  const openNew=()=>{setSelId(null);setIsNew(true);};
  const openEdit=p=>{setIsNew(false);setSelId(p.id);};
  const closeDetail=()=>{setSelId(null);setIsNew(false);};

  const handleSaveNew=f=>{onAddPrint(f);closeDetail();};
  const handleSaveEdit=f=>{if(selPrint)onEditPrint({...selPrint,...f});closeDetail();};

  /* Flag filtri */
  const FLAG_STATI=[
    {k:'',label:t('all'),color:C.t2},{k:'In attesa',label:t('print_flag_attesa'),color:C.warn,n:counts.attesa},
    {k:'In corso',label:t('print_flag_corso'),color:C.blue,n:counts.corso},
    {k:'Fallita',label:t('print_flag_fallite'),color:C.err,n:counts.fallite},
    {k:'Completata',label:t('print_flag_completate'),color:C.ok,n:counts.completate},
  ];

  /* Card stampa nella lista */
  const ListCard=({p})=>{
    const sc=p.stato==='Completata'?C.ok:p.stato==='Fallita'?C.err:p.stato==='In corso'?C.blue:C.warn;
    const isSel=p.id===selId;
    const firstMat=p.materials&&p.materials.length>0?mats.find(m=>m.id===p.materials[0].mat_id):null;
    const matColor=firstMat?.colore||null;
    const printer=p.printer_id?printers.find(x=>x.id===p.printer_id):null;
    const printerName=printer?prNome(printer):null;
    return(
      <div onClick={()=>openEdit(p)} style={{
        background:isSel?C.a2:C.s1,
        border:`1px solid ${isSel?C.a:p.stato==='In corso'?C.blueBr:C.b}`,
        borderLeft:`3px solid ${matColor||sc}`,
        borderRadius:7,padding:'0.45rem 0.65rem',cursor:'pointer',marginBottom:4,transition:'background 0.1s'
      }}>
        {/* Nome modello — centrato */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6,marginBottom:3}}>
          <span style={{color:C.t,fontWeight:500,fontSize:'0.82rem',flex:1,textAlign:'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={p.nome}>{p.nome}</span>
          <Badge label={tSt(p.stato,t)} color={sc}/>
        </div>
        {/* Materiali — sfondo pieno del colore materiale */}
        <div style={{display:'flex',gap:3,flexWrap:'wrap',marginBottom:3}}>
          {(p.materials||[]).slice(0,3).map(({mat_id,peso_g},i)=>{
            const mat=mats.find(m=>m.id===mat_id);if(!mat)return null;
            const txtC=contrastText(mat.colore);
            return(<span key={i} style={{display:'inline-flex',alignItems:'center',gap:3,background:mat.colore,border:`1px solid ${mat.colore}`,borderRadius:3,padding:'1px 6px',fontSize:'0.67rem',color:txtC,fontWeight:500}}>
              {matNomeL(mat,colorLang)} {peso_g}g
            </span>);
          })}
        </div>
        {/* Footer: data · stampante · durata | costo */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:4}}>
          <div style={{display:'flex',alignItems:'center',gap:4,minWidth:0,flexWrap:'wrap'}}>
            <span style={{color:C.t3,fontSize:'0.67rem',flexShrink:0}}>{p.data}</span>
            {printerName&&<span style={{color:C.blue,fontSize:'0.65rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flexShrink:1}} title={printerName}>· {printerName}</span>}
            <span style={{color:C.t3,fontSize:'0.67rem',flexShrink:0}}>· {p.ore}h{p.min>0?` ${p.min}m`:''}</span>
          </div>
          <span style={{color:C.a,fontWeight:600,fontSize:'0.8rem',flexShrink:0}}>{fmtV(p.costo)}</span>
        </div>
      </div>
    );
  };

  const showDetail=isNew||!!selPrint;

  /* Su mobile mostra solo un pannello alla volta */
  const showList=!isMobile||!showDetail;

  return(
    <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>

      {/* ── PANNELLO LISTA ── */}
      {showList&&<div style={{width:showDetail&&!isMobile?'38%':'100%',minWidth:240,maxWidth:showDetail&&!isMobile?480:900,borderRight:showDetail&&!isMobile?`1px solid ${C.b}`:'none',display:'flex',flexDirection:'column',overflow:'hidden',transition:'width 0.2s'}}>
        {/* Header */}
        <div style={{padding:'0.75rem 1rem',borderBottom:`1px solid ${C.b}`,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexShrink:0}}>
          <span style={{color:C.t,fontWeight:500,fontSize:'1rem'}}>{t('nav_prints')}</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {!showDetail&&prints.length>0&&<span style={{color:C.t3,fontSize:'0.72rem'}}>{t('print_select_hint')}</span>}
            <Btn onClick={openNew} variant="pri" sm><Plus size={12}/>{t('print_new')}</Btn>
          </div>
        </div>
        {/* Cerca */}
        <div style={{padding:'0.5rem 0.75rem',borderBottom:`1px solid ${C.b}`,flexShrink:0}}>
          <div style={{position:'relative',marginBottom:6}}>
            <Search size={12} style={{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
            <input value={srchP} onChange={e=>setSrchP(e.target.value)} placeholder={t('print_search_ph')} style={{...inp,paddingLeft:'1.6rem',fontSize:'0.78rem'}}/>
          </div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {FLAG_STATI.map(f=>(
              <button key={f.k} onClick={()=>setFilterStato(f.k)}
                style={{fontSize:'0.68rem',padding:'2px 7px',borderRadius:4,border:`1px solid ${filterStato===f.k?f.color:C.b}`,background:filterStato===f.k?`${f.color}18`:'transparent',color:filterStato===f.k?f.color:C.t3,cursor:'pointer',fontFamily:'inherit'}}>
                {f.label}{f.n!==undefined?` ${f.n}`:''}
              </button>
            ))}
          </div>
        </div>
        {/* Lista */}
        <div style={{flex:1,overflowY:'auto',padding:'0.5rem 0.75rem'}}>
          {shown.length===0&&<div style={{color:C.t3,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{prints.length===0?t('print_none'):t('mat_none')}</div>}
          {(()=>{
            /* Calcola larghezze colonne in base al testo più lungo tra tutti i gruppi */
            const CH_NUM=8.5; /* px per char a 0.72rem monospace + padding badge */
            const CH_PRJ=6.5; /* px per char a 0.68rem */
            const maxNumW=Math.max(70,...groups.map(([qid])=>{const q=qid!=='__none__'?quotes.find(x=>x.id===qid):null;return q?(q.numero||'').length*CH_NUM+16:0;}));
            const maxPrjW=Math.max(0,...groups.map(([qid])=>{const q=qid!=='__none__'?quotes.find(x=>x.id===qid):null;return q&&q.nome_progetto?(q.nome_progetto.length+2)*CH_PRJ+8:0;}));
            const prjW=Math.min(maxPrjW,140); /* cap a 140px */
            return groups.map(([qid,ps])=>{
            const q=qid!=='__none__'?quotes.find(x=>x.id===qid):null;
            const isCollapsed=collapsedGroups[qid]===undefined?true:!!collapsedGroups[qid];
            /* Barra titolo collassabile */
            const groupHeader=(
              <div style={{display:'flex',alignItems:'center',gap:0,padding:'0.28rem 0.45rem',marginBottom:isCollapsed?4:3,background:q?C.s2:'transparent',borderRadius:5,border:q?`1px solid ${C.b}`:'none',minWidth:0}}>
                <button onClick={()=>toggleGroup(qid)}
                  style={{background:'none',border:'none',color:C.t3,cursor:'pointer',padding:'0 4px 0 0',display:'flex',alignItems:'center',flexShrink:0}}>
                  {isCollapsed?<ChevronRight size={13}/>:<span style={{display:'inline-block',transform:'rotate(90deg)',lineHeight:1}}><ChevronRight size={13}/></span>}
                </button>
                {q?(
                  <div style={{flex:1,display:'flex',alignItems:'center',gap:0,minWidth:0,overflow:'hidden'}}>
                    <FileText size={10} color={C.purple} style={{flexShrink:0,marginRight:4}}/>
                    {/* Numero: larghezza fissa = max tra tutti i gruppi */}
                    <span style={{color:C.purple,fontSize:'0.72rem',fontWeight:600,fontFamily:'monospace',flexShrink:0,width:maxNumW,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={q.numero}>{q.numero}</span>
                    {/* Progetto: larghezza fissa = max tra tutti i progetti (cappata), con distanza dal numero */}
                    {prjW>0&&<span style={{color:C.teal,fontSize:'0.68rem',flexShrink:0,width:prjW,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingLeft:10}} title={q.nome_progetto||undefined}>{q.nome_progetto?`📁 ${q.nome_progetto}`:''}</span>}
                    {/* Cliente: spazio rimanente */}
                    <span style={{color:C.t2,fontSize:'0.7rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingLeft:prjW>0?10:0}} title={q.cliente||undefined}>{q.cliente||''}</span>
                    <span style={{color:C.t3,fontSize:'0.65rem',flexShrink:0,paddingLeft:6,whiteSpace:'nowrap'}}>({ps.length})</span>
                    {(()=>{const rcptLocked=!!(q.ricevuta?.emessa&&!q.ricevuta?.annullata);return(
                    <button onClick={e=>{e.stopPropagation();if(!rcptLocked)setModal({type:'quote_edit',data:q});}}
                      title={rcptLocked?(lang==='en'?'Locked: receipt issued':'Bloccato: ricevuta emessa'):q.numero}
                      style={{background:'none',border:'none',color:rcptLocked?C.t3:C.purple,cursor:rcptLocked?'not-allowed':'pointer',padding:'0 0 0 2px',display:'flex',alignItems:'center',flexShrink:0,opacity:rcptLocked?0.4:1}}>
                      {rcptLocked?<Lock size={11}/>:<ChevronRight size={13}/>}
                    </button>);})()}
                  </div>
                ):(
                  <>
                    <span style={{color:C.t3,fontSize:'0.7rem',flex:1}}>{t('print_grouped_none')}</span>
                    <span style={{color:C.t3,fontSize:'0.65rem'}}>({ps.length})</span>
                  </>
                )}
              </div>
            );
            return(
              <div key={qid} style={{marginBottom:'0.35rem'}}>
                {groupHeader}
                {!isCollapsed&&<div style={{paddingLeft:q?10:0}}>
                  {ps.map(p=><ListCard key={p.id} p={p}/>)}
                </div>}
              </div>
            );
          });})()}
          {/* Totale */}
          {prints.length>0&&<div style={{background:C.s2,borderRadius:6,padding:'0.5rem 0.75rem',display:'flex',justifyContent:'space-between',marginTop:4}}>
            <span style={{color:C.t3,fontSize:'0.75rem'}}>{t('print_total')} · {prints.length}</span>
            <span style={{color:C.a,fontWeight:700,fontSize:'0.88rem'}}>{fmtV(tot)}</span>
          </div>}
        </div>
      </div>}

      {/* ── PANNELLO DETTAGLIO / FORM ── */}
      {showDetail&&(
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0}}>
          {/* Header pannello */}
          <div style={{padding:'0.6rem 1rem',borderBottom:`1px solid ${C.b}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,background:C.s1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
              {isMobile&&<button onClick={closeDetail} style={{background:'none',border:'none',color:C.a,cursor:'pointer',fontSize:'0.82rem',fontFamily:'inherit',padding:0,display:'flex',alignItems:'center',gap:4,flexShrink:0}}><ChevronLeft size={14}/>{t('nav_prints')}</button>}
              {!isMobile&&<span style={{color:C.t,fontWeight:500,fontSize:'0.9rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{isNew?t('print_new'):`${t('edit_print_title')} — ${selPrint?.nome||''}`}</span>}
              {isMobile&&<span style={{color:C.t,fontWeight:500,fontSize:'0.9rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{isNew?t('print_new'):selPrint?.nome||''}</span>}
            </div>
            <div style={{display:'flex',gap:6}}>
              {selPrint&&(()=>{const lQ=selPrint.quote_id?quotes.find(x=>x.id===selPrint.quote_id):null;const pLocked=!!(lQ?.ricevuta?.emessa&&!lQ?.ricevuta?.annullata);return(<Btn onClick={()=>!pLocked&&setConfirm({type:'print',id:selPrint.id,nome:selPrint.nome})} sm variant="dan" disabled={pLocked} title={pLocked?(lang==='en'?'Locked: receipt issued':'Bloccato: ricevuta emessa'):undefined}><Trash2 size={12}/></Btn>);})()}
              <Btn onClick={closeDetail} sm><X size={12}/>{t('close')}</Btn>
            </div>
          </div>
          {/* Form inline */}
          <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
            <PrintForm
              key={isNew?'new':selId}
              mats={mats} printers={printers} settings={settings}
              quotes={quotes} prints={prints}
              init={isNew?undefined:selPrint}
              isEdit={!isNew}
              onSave={isNew?handleSaveNew:handleSaveEdit}
              onClose={closeDetail}
            />
          </div>
        </div>
      )}

      {/* Stato vuoto pannello destro — hint inline nell'header lista */}
    </div>
  );
}

function RicevutaView({quote,quotes,settings,clients,mats,printers,rcptNums,setRcptNums,onUpdateQuote,onBack,lang}){
  const {t}=useT();
  const fmtV=useFmt();
  const [tab,setTab]=useState(quote?._openList?'list':'receipt');
  const [listYear,setListYear]=useState(String(new Date().getFullYear()));
  const [srchRcpt,setSrchRcpt]=useState('');
  const [confirmEmit,setConfirmEmit]=useState(false);
  const [cancelMode,setCancelMode]=useState(false);
  const [cancelReason,setCancelReason]=useState('');
  const [cancelErr,setCancelErr]=useState('');
  const importRcptRef=useRef();
  const q=quote;
  const isInt=!!q.uso_interno;
  const regime=settings.regime||'occasionale';
  const hasClient=!!q.cliente&&!q.uso_interno;
  const [rcv,setRcv]=useState(()=>q.ricevuta?{...q.ricevuta,righe_extra:q.ricevuta.righe_extra||[]}:newRicevuta());
  const s=(k,v)=>setRcv(p=>({...p,[k]:v}));
  const saveRcv=(newRcv,newArchivio=undefined)=>{
    const updated={...q,ricevuta:newRcv};
    if(newArchivio!==undefined)updated.ricevute_archivio=newArchivio;
    setRcv(newRcv);onUpdateQuote(updated);
  };
  const addRow=()=>s('righe_extra',[...(rcv.righe_extra||[]),{testo:'',costo:0}]);
  const updRow=(i,k,v)=>s('righe_extra',(rcv.righe_extra||[]).map((r,j)=>j===i?{...r,[k]:v}:r));
  const delRow=i=>s('righe_extra',(rcv.righe_extra||[]).filter((_,j)=>j!==i));
  const lordo=+(q.prezzo||0);
  const extraSum=(rcv.righe_extra||[]).reduce((acc,r)=>acc+(+r.costo||0),0);
  const base=lordo+extraSum;
  const ritenuta=regime==='occasionale'&&(q.ritenuta??settings.ritenuta??false);
  const ritenuta_amt=ritenuta?base*0.20:0;
  const needsStamp=base>77.47;
  const netto=base-ritenuta_amt+(needsStamp?2:0);
  const handleEmit=()=>{
    const year=rcptYear();let numero=rcv.numero;let newNums=rcptNums;
    if(!numero){const r=consumeRcptNum(rcptNums,year);numero=r.numero;newNums=r.newNums;}
    const emitted={...rcv,numero,data_emissione:new Date().toISOString().slice(0,10),emessa:true,annullata:false,
      regime,nota_legale:regime==='forfettario'?settings.nota_forfettario:regime==='occasionale'?settings.nota_occasionale:'',
      ritenuta_flag:ritenuta};
    setRcptNums(newNums);saveRcv(emitted);setConfirmEmit(false);
  };
  const handleCancel=()=>{
    if(!cancelReason.trim()){setCancelErr(t('rcpt_cancel_reason_err'));return;}
    saveRcv({...rcv,annullata:true,motivazione_annullamento:cancelReason.trim()});
    setCancelMode(false);setCancelReason('');setCancelErr('');
  };
  const handleReissue=()=>{
    /* Archivia la ricevuta annullata prima di crearne una nuova */
    const archivio=[...(q.ricevute_archivio||[])];
    if(rcv.annullata&&rcv.numero)archivio.push({...rcv});
    const fresh=newRicevuta(rcv.numero);
    fresh.oggetto=rcv.oggetto||q.note||'';fresh.periodo=rcv.periodo||'';fresh.righe_extra=[];
    saveRcv(fresh,archivio);
  };
  const exportRcv=(xq,rv)=>{
    const payload={
      _p3d_rcevuta:'v1',
      ricevuta:rv,
      quote_snapshot:{
        id:xq.id,numero:xq.numero,cliente:xq.cliente,email:xq.email,
        prezzo:xq.prezzo,costo_prod:xq.costo_prod,imponibile:xq.imponibile,
        data:xq.data,note:xq.note,modelli:xq.modelli,
        metodi_pagamento:xq.metodi_pagamento,uso_interno:xq.uso_interno,
      }
    };
    dlJson(payload,`ricevuta-${rv.numero}-${xq.numero}.json`);
  };
  const importRcv=e=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{
      try{
        const raw=JSON.parse(ev.target.result);
        if(!raw._p3d_rcevuta||!raw.ricevuta||!raw.quote_snapshot){alert(t('rcpt_import_err'));return;}
        const rv=raw.ricevuta;
        const snap=raw.quote_snapshot;
        if(!rv.emessa&&!rv.annullata){alert(t('rcpt_import_err'));return;}
        const targetQ=quotes.find(x=>x.numero===snap.numero)||quotes.find(x=>x.id===snap.id);
        if(!targetQ){alert(t('rcpt_import_no_quote')+` (${snap.numero})`);return;}
        const existingActive=targetQ.ricevuta?.numero===rv.numero&&!targetQ.ricevuta?.annullata;
        const inArchivio=(targetQ.ricevute_archivio||[]).some(a=>a.numero===rv.numero&&!a.annullata);
        if(existingActive||inArchivio){alert(t('rcpt_import_dup'));return;}
        let updQ={...targetQ,ricevute_archivio:targetQ.ricevute_archivio||[]};
        if(rv.annullata){
          updQ.ricevute_archivio=[...updQ.ricevute_archivio,rv];
        }else{
          if(updQ.ricevuta?.numero)updQ.ricevute_archivio=[...updQ.ricevute_archivio,updQ.ricevuta];
          updQ.ricevuta=rv;
        }
        onUpdateQuote(updQ);
        alert(t('rcpt_import_ok'));
      }catch{alert(t('rcpt_import_err'));}
    };
    r.readAsText(file);e.target.value='';
  };
  const openPdfR=(sintetica,bozza)=>{
    try{
      const html=buildRicevutaHtml(q,{...rcv,righe_extra:rcv.righe_extra||[]},settings,lang,sintetica,bozza,clients,mats,printers);
      openPdf(html);
    }catch(e){
      console.error('buildRicevutaHtml error:',e);
      alert('Errore nella generazione del PDF: '+e.message);
    }
  };
  const isLocked=rcv.emessa&&!rcv.annullata;
  const canEmit=rcv.pagato&&!rcv.emessa&&!rcv.annullata&&hasClient&&!isInt&&regime!=='ordinario';
  useEffect(()=>{if(!rcv.emessa&&!rcv.oggetto&&q.note)s('oggetto',q.note);},[]);
  const allYearsRcpt=[...new Set([
    ...quotes.filter(x=>x.ricevuta?.numero).map(x=>x.ricevuta.numero.split('-').pop()),
    ...quotes.flatMap(x=>(x.ricevute_archivio||[]).filter(r=>r.numero).map(r=>r.numero.split('-').pop()))
  ])].sort((a,b)=>b-a);
  if(!allYearsRcpt.includes(String(new Date().getFullYear())))allYearsRcpt.unshift(String(new Date().getFullYear()));
  return(<div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
    <div style={{borderBottom:`1px solid ${C.b}`,padding:'0.5rem 1rem',display:'flex',alignItems:'center',gap:10,flexShrink:0,background:C.s1}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.a,cursor:'pointer',fontSize:'0.8rem',fontFamily:'inherit',fontWeight:600,display:'flex',alignItems:'center',gap:4}}>
        <ChevronLeft size={15}/>{t('rcpt_back')}
      </button>
      <span style={{color:C.b,fontSize:'0.9rem'}}>│</span>
      <span style={{color:C.t,fontWeight:600,fontSize:'0.9rem'}}>{t('rcpt_title')} — {q.numero}</span>
      {rcv.emessa&&!rcv.annullata&&<span style={{background:C.okBg,color:C.ok,border:`1px solid ${C.okBr}`,borderRadius:4,padding:'1px 8px',fontSize:'0.7rem',fontWeight:700}}>✓ {rcv.numero}</span>}
      {rcv.annullata&&<span style={{background:C.errBg,color:C.err,border:`1px solid ${C.errBr}`,borderRadius:4,padding:'1px 8px',fontSize:'0.7rem',fontWeight:700}}>⛔ {t('rcpt_cancelled')}</span>}
    </div>
    <div style={{display:'flex',borderBottom:`1px solid ${C.b}`,flexShrink:0}}>
      {[['receipt',t('rcpt_tab_receipt')],['list',t('rcpt_tab_list')]].map(([k,l])=>(
        <button key={k} onClick={()=>setTab(k)} style={{padding:'0.5rem 1.25rem',background:tab===k?C.a2:'transparent',border:'none',borderBottom:`2px solid ${tab===k?C.a:'transparent'}`,color:tab===k?C.a:C.t2,cursor:'pointer',fontSize:'0.82rem',fontFamily:'inherit',fontWeight:tab===k?600:400}}>{l}</button>
      ))}
    </div>
    <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
    {tab==='receipt'&&(()=>{
      if(isInt)return(<div style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:8,padding:'1rem',color:C.warn}}>{t('rcpt_internal')}</div>);
      if(!hasClient)return(<div style={{background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:8,padding:'1rem',color:C.err}}>{t('rcpt_no_client')}</div>);
      if(regime==='ordinario')return(<div style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:8,padding:'1rem',color:C.warn}}>{t('rcpt_ordinary_warn')}</div>);
      return(<div style={{display:'flex',flexDirection:'column',gap:'0.875rem',maxWidth:900}}>
        {rcv.emessa&&!rcv.annullata&&<div style={{background:C.okBg,border:`1px solid ${C.okBr}`,borderRadius:8,padding:'0.75rem 1rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:6}}>
          <div><div style={{color:C.ok,fontWeight:700,fontSize:'0.9rem'}}>{rcv.numero}</div><div style={{color:C.t3,fontSize:'0.72rem'}}>{t('rcpt_emitted')}: {rcv.data_emissione?.split('-').reverse().join('/')}</div></div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <Btn onClick={()=>openPdfR(false,false)} variant="ok" sm><FileText size={11}/>{t('rcpt_detail')}</Btn>
            <Btn onClick={()=>openPdfR(true,false)} variant="ok" sm><FileText size={11}/>{t('rcpt_synth')}</Btn>
          </div>
        </div>}
        {rcv.annullata&&<div style={{background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:8,padding:'0.75rem 1rem'}}>
          <div style={{color:C.err,fontWeight:700,marginBottom:4}}>⛔ {t('rcpt_cancelled')} — {rcv.numero}</div>
          {rcv.motivazione_annullamento&&<div style={{color:C.t2,fontSize:'0.8rem',marginBottom:8}}>{rcv.motivazione_annullamento}</div>}
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <Btn onClick={()=>openPdfR(false,false)} variant="dan" sm><FileText size={11}/>{t('rcpt_detail')}</Btn>
            <Btn onClick={handleReissue} variant="pri" sm><RefreshCw size={11}/>{t('rcpt_reissue')}</Btn>
          </div>
        </div>}
        <div style={{background:C.s2,borderRadius:8,padding:'0.875rem'}}>
          <div style={{color:C.t2,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:6}}>{t('rcpt_object')}</div>
          <textarea value={rcv.oggetto} onChange={e=>!isLocked&&s('oggetto',e.target.value)} disabled={isLocked} rows={3} style={{...ta,resize:'vertical'}} placeholder={q.note||'Descrizione della prestazione...'}/>
          <div style={{color:C.t2,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'.05em',margin:'8px 0 4px'}}>{t('rcpt_period')}</div>
          <Inp v={rcv.periodo} set={v=>!isLocked&&s('periodo',v)} ph={t('rcpt_period_ph')} disabled={isLocked}/>
        </div>
        <div style={{background:C.s2,borderRadius:8,padding:'0.875rem'}}>
          <div style={{color:C.t2,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:6}}>{t('rcpt_extra_rows')}</div>
          {(rcv.righe_extra||[]).map((r,i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:6,marginBottom:6,alignItems:'center'}}>
              <Inp v={r.testo} set={v=>!isLocked&&updRow(i,'testo',v)} ph={t('rcpt_row_text')} disabled={isLocked}/>
              <span style={{color:C.t3,fontSize:'0.8rem',whiteSpace:'nowrap'}}>{settings.valuta||'€'}</span>
              <InpNum v={r.costo} set={v=>!isLocked&&updRow(i,'costo',v)} style={{width:80,textAlign:'right'}} disabled={isLocked}/>
              {!isLocked&&<button onClick={()=>delRow(i)} style={{background:'none',border:'none',color:C.err,cursor:'pointer',padding:4,display:'flex'}}><X size={13}/></button>}
              {isLocked&&<span/>}
            </div>
          ))}
          {!isLocked&&<Btn onClick={addRow} variant="sec" sm><Plus size={12}/>{t('rcpt_add_row')}</Btn>}
        </div>
        <div style={{background:C.s2,borderRadius:8,padding:'0.875rem'}}>
          <div style={{color:C.t2,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>{t('rcpt_amounts')}</div>
          {[[t('rcpt_gross'),fmtV(lordo),C.t,false],
            ...(rcv.righe_extra||[]).filter(r=>r.testo||r.costo).map(r=>[r.testo||'—',`${+r.costo>=0?'+':''}${fmtV(+r.costo)}`,+r.costo>=0?C.ok:C.err,true]),
            ...(ritenuta_amt>0?[[t('rcpt_withholding'),`\u2212${fmtV(ritenuta_amt)}`,C.err,false]]:[]),
            ...(needsStamp?[[t('rcpt_stamp'),`+${fmtV(2)}`,C.t3,false]]:[]),
          ].map(([l,v,clr,sub],i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'3px 0',borderBottom:`1px solid ${C.b}`,fontSize:sub?'0.75rem':'0.85rem'}}>
              <span style={{color:sub?C.t3:C.t2}}>{l}</span><span style={{color:clr,fontWeight:sub?400:500}}>{v}</span>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',marginTop:6,paddingTop:4,borderTop:`2px solid ${C.t}`}}>
            <span style={{color:C.t,fontWeight:700,fontSize:'0.95rem'}}>{t('rcpt_net')}</span>
            <span style={{color:C.a,fontWeight:700,fontSize:'1.1rem'}}>{fmtV(netto)}</span>
          </div>
          {needsStamp&&<div style={{color:C.t3,fontSize:'0.68rem',marginTop:4}}>&#9888; {t('rcpt_stamp_note')}</div>}
        </div>
        {!rcv.emessa&&!rcv.annullata&&<div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <Btn onClick={()=>openPdfR(false,true)} variant="sec" sm><Eye size={11}/>{t('rcpt_draft_detail')}</Btn>
          <Btn onClick={()=>openPdfR(true,true)} variant="sec" sm><Eye size={11}/>{t('rcpt_draft_synth')}</Btn>
        </div>}
        {!rcv.emessa&&!rcv.annullata&&<div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.875rem'}}>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginBottom:rcv.pagato?8:0}}>
            <input type="checkbox" checked={!!rcv.pagato} onChange={e=>saveRcv({...rcv,pagato:e.target.checked})} style={{cursor:'pointer',accentColor:C.a,width:16,height:16}}/>
            <span style={{color:C.t,fontWeight:700,fontSize:'0.95rem',letterSpacing:'.03em'}}>{t('rcpt_paid')}</span>
          </label>
          {rcv.pagato&&<div style={{fontSize:'0.72rem',color:C.t3,marginBottom:10}}>{t('rcpt_paid_hint')}</div>}
          {canEmit&&<Btn onClick={()=>setConfirmEmit(true)} variant="pri"><FileText size={13}/>{t('rcpt_emit')}</Btn>}
        </div>}
        {confirmEmit&&<div style={{background:C.a2,border:`2px solid ${C.a}`,borderRadius:8,padding:'1rem'}}>
          <div style={{color:C.t,fontWeight:700,marginBottom:6}}>{t('rcpt_emit_confirm_title')}</div>
          <div style={{color:C.t2,fontSize:'0.82rem',marginBottom:12}}>{t('rcpt_emit_confirm')}</div>
          <div style={{display:'flex',gap:8}}><Btn onClick={handleEmit} variant="pri"><FileText size={13}/>{t('rcpt_emit_ok')}</Btn><Btn onClick={()=>setConfirmEmit(false)} variant="sec">{t('cancel')}</Btn></div>
        </div>}
        {isLocked&&!cancelMode&&<Btn onClick={()=>setCancelMode(true)} variant="dan" sm><X size={12}/>{t('rcpt_cancel_receipt')}</Btn>}
        {cancelMode&&<div style={{background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:8,padding:'1rem'}}>
          <div style={{color:C.err,fontWeight:700,marginBottom:6}}>{t('rcpt_cancel_title')}</div>
          <div style={{color:C.t2,fontSize:'0.8rem',marginBottom:6}}>{t('rcpt_cancel_reason')}</div>
          <Ta v={cancelReason} set={v=>{setCancelReason(v);setCancelErr('');}} rows={3}/>
          {cancelErr&&<div style={{color:C.err,fontSize:'0.75rem',marginTop:4}}>{cancelErr}</div>}
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <Btn onClick={handleCancel} variant="dan"><X size={12}/>{t('rcpt_cancel_ok')}</Btn>
            <Btn onClick={()=>{setCancelMode(false);setCancelReason('');setCancelErr('');}} variant="sec">{t('cancel')}</Btn>
          </div>
        </div>}
      </div>);
    })()}
    {tab==='list'&&(<div style={{maxWidth:900}}>
      <input ref={importRcptRef} type="file" accept=".json" onChange={importRcv} style={{display:'none'}}/>
      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:'0.5rem',flexWrap:'wrap'}}>
        <span style={{color:C.t2,fontSize:'0.8rem'}}>{t('rcpt_list_year')}:</span>
        <div style={{display:'flex',gap:4}}>
          {allYearsRcpt.map(y=>(
            <button key={y} onClick={()=>setListYear(y)} style={{padding:'0.25rem 0.6rem',borderRadius:4,border:`1px solid ${listYear===y?C.a:C.b}`,background:listYear===y?C.a2:'transparent',color:listYear===y?C.a:C.t2,cursor:'pointer',fontSize:'0.78rem',fontFamily:'inherit'}}>{y}</button>
          ))}
        </div>
        <Btn onClick={()=>openPdf(buildRicevutaListaHtml(quotes,listYear,settings,lang))} variant="sec" sm><FileText size={11}/>{t('rcpt_list_print')}</Btn>
        <Btn onClick={()=>importRcptRef.current.click()} variant="blue" sm><Upload size={11}/>{t('rcpt_import')}</Btn>
      </div>
      <div style={{position:'relative',marginBottom:'0.75rem'}}>
        <Search size={12} style={{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
        <input value={srchRcpt} onChange={e=>setSrchRcpt(e.target.value)} placeholder={t('search')+'...'} style={{...inp,paddingLeft:'1.6rem',fontSize:'0.78rem',width:'100%'}}/>
      </div>
      {(()=>{
        const allRcpts=[];
        quotes.forEach(x=>{
          if(x.ricevuta?.numero&&x.ricevuta.numero.endsWith(`-${listYear}`))
            allRcpts.push({quote:x,rcv:x.ricevuta,isArchived:false});
          (x.ricevute_archivio||[]).forEach(rv=>{
            if(rv.numero&&rv.numero.endsWith(`-${listYear}`))
              allRcpts.push({quote:x,rcv:rv,isArchived:true});
          });
        });
        allRcpts.sort((a,b)=>(b.rcv.numero||'').localeCompare(a.rcv.numero||''));
        const filteredRcpts=srchRcpt.trim()?allRcpts.filter(({quote:x,rcv:rv})=>{const q=srchRcpt.toLowerCase();return[rv.numero||'',x.cliente||'',x.numero||'',rv.oggetto||''].some(v=>v.toLowerCase().includes(q));}):allRcpts;
        if(filteredRcpts.length===0)return <div style={{color:C.t3,textAlign:'center',padding:'2rem'}}>{t('rcpt_list_empty')}</div>;
        return filteredRcpts.map(({quote:x,rcv:rv,isArchived},idx)=>{
          const isAnn=rv.annullata;
          const cliName=x.cliente||'—';
          return(<div key={`${x.id}-${rv.numero}-${idx}`} style={{display:'flex',alignItems:'center',gap:8,background:isAnn?C.errBg:C.s2,border:`1px solid ${isAnn?C.errBr:C.b}`,borderRadius:7,padding:'0.5rem 0.75rem',marginBottom:6,flexWrap:'wrap'}}>
            <span style={{fontWeight:700,color:isAnn?C.err:C.t,minWidth:120,textDecoration:isAnn?'line-through':''}}>{rv.numero}</span>
            <span style={{color:C.t3,fontSize:'0.75rem'}}>{rv.data_emissione?.split('-').reverse().join('/')||'—'}</span>
            <span style={{color:C.t2,fontSize:'0.78rem',flex:1}}>{cliName}</span>
            <span style={{color:C.a,fontSize:'0.78rem',fontWeight:600}}>{x.prezzo?`${settings.valuta||'€'} ${(+x.prezzo).toFixed(2)}`:'—'}</span>
            {isAnn&&<span style={{color:C.err,fontSize:'0.68rem',fontWeight:700}}>&#x26D4; {t('rcpt_cancelled')}</span>}
            {isArchived&&<span style={{color:C.t3,fontSize:'0.65rem',fontStyle:'italic'}}>storico</span>}
            <div style={{display:'flex',gap:4,flexShrink:0}}>
              <Btn onClick={()=>openPdf(buildRicevutaHtml(x,{...rv,righe_extra:rv.righe_extra||[]},settings,lang,false,false,clients,mats,printers))} variant={isAnn?'dan':'blue'} sm><FileText size={10}/>{t('rcpt_detail')}</Btn>
              <Btn onClick={()=>openPdf(buildRicevutaHtml(x,{...rv,righe_extra:rv.righe_extra||[]},settings,lang,true,false,clients,mats,printers))} variant={isAnn?'dan':'sec'} sm><FileText size={10}/>{t('rcpt_synth')}</Btn>
              {(rv.emessa||rv.annullata)&&<Btn onClick={()=>exportRcv(x,rv)} variant="blue" sm title={t('rcpt_export')}><Download size={10}/></Btn>}
            </div>
          </div>);
        });
      })()}
    </div>)}
    </div>
  </div>);
}

function QuoteView({quotes,mats,printers,settings,usedNums,clients,prints,onAddQuote,onEditQuote,setModal,setConfirm,setUsedNums,onUpdatePrices,onFreeze,onDuplicate,isMobile,rcptNums,setRcptNums,onUpdateQuote}){
  const {t,lang,colorLang}=useT();
  const fmtV=useFmt();
  const [srchQ,setSrchQ]=useState('');
  const [filterStato,setFilterStato]=useState('');
  const [selId,setSelId]=useState(null);
  const [selRcptQ,setSelRcptQ]=useState(null);/* quote per cui apro RicevutaView */
  const importRef=useRef();

  const clientQuotes=quotes.filter(q=>!q.uso_interno);
  const internalQuotes=quotes.filter(q=>q.uso_interno);
  const totAll=clientQuotes.reduce((s,q)=>s+(q.prezzo||0),0);

  const selQ=quotes.find(q=>q.id===selId)||null;

  /* Filtro ricerca + stato */
  const filteredAll=quotes.filter(q=>{
    if(filterStato){
      if(filterStato==='interno'&&!q.uso_interno)return false;
      if(filterStato!=='interno'&&q.stato!==filterStato)return false;
    }
    if(!srchQ)return true;
    const s=srchQ.toLowerCase();
    return[q.numero||'',q.cliente||'',q.nome_progetto||'',q.azienda||'',q.email||''].some(v=>v.toLowerCase().includes(s));
  });

  const importQuotes=e=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        /* normalizza: bundle v1 oppure array legacy */
        const rawArr=Array.isArray(data)?data:[data];
        const bundles=rawArr.map(item=>
          item._p3d_bundle==='v1'
            ?{quote:item.quote,linkedPrints:item.prints||[]}
            :{quote:item,linkedPrints:[]}
        );
        /* filtra: scarta se numero è già attivo nei preventivi correnti */
        const activeNums=new Set(quotes.map(q=>q.numero));
        const toImport=bundles.filter(({quote:q})=>q?.numero&&!activeNums.has(q.numero));
        if(!toImport.length){alert(t('q_import_none'));e.target.value='';return;}

        /* calcola quante stampe verranno ripristinate */
        const existingPrintIds=new Set(prints.map(p=>p.id));
        let totalPrints=0;
        const payload=toImport.map(({quote:q,linkedPrints})=>{
          /* mantieni ID originale se non in uso, altrimenti genera nuovo (e aggiorna quote_id nelle stampe) */
          const wasDeleted=usedNums.includes(q.numero)&&!activeNums.has(q.numero);
          /* usa ID originale — non generiamo uid() così le stampe rimangono collegate */
          const importedQ={...migrateQuote(q)};/* id originale preservato */
          /* stampe: ripristina solo quelle non già presenti */
          const newPrints=linkedPrints
            .filter(p=>!existingPrintIds.has(p.id))
            .map(p=>({...p,quote_id:importedQ.id}));/* assicura quote_id corretto */
          totalPrints+=newPrints.length;
          return{quote:importedQ,newPrints,wasDeleted};
        });

        window._importedData={
          quotes:payload.map(p=>p.quote),
          prints:payload.flatMap(p=>p.newPrints),
          removedNums:payload.filter(p=>p.wasDeleted).map(p=>p.quote.numero),
        };
        window.dispatchEvent(new CustomEvent('p3d_import_quotes'));

        const qCount=payload.length;
        const pCount=totalPrints;
        const restoredMsg=pCount>0?` · ${pCount} ${t('q_import_prints_restored')}`:'';
        alert(`✓ ${qCount} ${t('q_import_restored')}${restoredMsg}.`);
      }catch{alert('Errore: file non valido.');}
      e.target.value='';
    };
    r.readAsText(file);
  };

  const FLAG_STATI=[
    {k:'',label:t('all'),color:C.t2},
    {k:'In attesa',label:t('q_flag_attesa'),color:C.warn,n:quotes.filter(q=>q.stato==='In attesa').length},
    {k:'Confermato',label:t('q_flag_confermati'),color:C.blue,n:quotes.filter(q=>q.stato==='Confermato').length},
    {k:'Completato',label:t('q_flag_completati'),color:C.ok,n:quotes.filter(q=>q.stato==='Completato').length},
    {k:'Annullato',label:t('q_flag_annullati'),color:C.t3,n:quotes.filter(q=>q.stato==='Annullato').length},
    {k:'interno',label:t('q_int_badge'),color:C.warn,n:internalQuotes.length},
  ];

  /* Card lista preventivo */
  const ListCard=({q,compact=false,colNumW=88,colPrjW=100})=>{
    const isSel=q.id===selId;
    const isInt=!!q.uso_interno;
    const qs=q.stato||'In attesa';
    const changes=detectChanges(q,mats,printers,settings.c_kwh,settings.valuta||"€");
    const hasC=changes.length>0&&!q.congelato;
    const showRcptBtn=qs==='Completato'&&!isInt;
    return(
      <div onClick={()=>setSelId(q.id)}
        style={{background:isSel?C.a2:C.s1,border:`1px solid ${isSel?C.a:hasC?C.warnBr:isInt?C.warnBr:C.b}`,borderRadius:7,padding:'0.55rem 0.75rem',cursor:'pointer',marginBottom:4}}>
        {/* Riga 1: grid colonne fisse in modalità piena, flex-wrap in compact */}
        {compact?(
          <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:2,flexWrap:'wrap',rowGap:2}}>
            <span style={{color:isInt?C.warn:C.purple,fontWeight:700,fontSize:'0.75rem',fontFamily:'monospace',background:isInt?C.warnBg:C.purpleBg,padding:'1px 6px',borderRadius:3,flexShrink:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={q.numero}>{q.numero}</span>
            {q.nome_progetto&&<span style={{color:C.teal,fontSize:'0.68rem',flexShrink:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingLeft:5}} title={q.nome_progetto}>{`📁 ${q.nome_progetto}`}</span>}
            <span style={{paddingLeft:5,flexShrink:0}}><Badge label={tSt(qs,t)} color={qStaClr(qs)}/></span>
            {isInt&&<span style={{color:C.warn,fontSize:'0.65rem',marginLeft:3,flexShrink:0}}>🏭</span>}
            {hasC&&<span style={{color:C.warn,fontSize:'0.65rem',marginLeft:3,flexShrink:0}}>⚠</span>}
            {q.congelato&&<span style={{marginLeft:3,flexShrink:0}}><Lock size={9} color={C.blue}/></span>}
            <span style={{flex:1}}/>
            {showRcptBtn&&<button onClick={e=>{e.stopPropagation();setSelRcptQ(q);}} style={{background:C.okBg,color:C.ok,border:`1px solid ${C.okBr}`,borderRadius:4,padding:'1px 7px',fontSize:'0.6rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit',display:'inline-flex',alignItems:'center',gap:3,whiteSpace:'nowrap',flexShrink:0,marginLeft:4}}><FileText size={8}/>{t('rcpt_go')}</button>}
          </div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:`${colNumW}px ${colPrjW>0?colPrjW+'px':''} auto 1fr auto`,alignItems:'center',gap:0,marginBottom:2,overflow:'hidden'}}>
            <span style={{color:isInt?C.warn:C.purple,fontWeight:700,fontSize:'0.75rem',fontFamily:'monospace',background:isInt?C.warnBg:C.purpleBg,padding:'1px 6px',borderRadius:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={q.numero}>{q.numero}</span>
            {colPrjW>0&&<span style={{color:C.teal,fontSize:'0.68rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingLeft:5}} title={q.nome_progetto||undefined}>{q.nome_progetto?`📁 ${q.nome_progetto}`:''}</span>}
            <span style={{paddingLeft:5,display:'flex',alignItems:'center',gap:3}}>
              <Badge label={tSt(qs,t)} color={qStaClr(qs)}/>
              {isInt&&<span style={{color:C.warn,fontSize:'0.65rem'}}>🏭</span>}
              {hasC&&<span style={{color:C.warn,fontSize:'0.65rem'}}>⚠</span>}
              {q.congelato&&<Lock size={9} color={C.blue}/>}
            </span>
            <span/>
            {showRcptBtn?<button onClick={e=>{e.stopPropagation();setSelRcptQ(q);}} style={{background:C.okBg,color:C.ok,border:`1px solid ${C.okBr}`,borderRadius:4,padding:'1px 7px',fontSize:'0.6rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit',display:'inline-flex',alignItems:'center',gap:3,whiteSpace:'nowrap',justifySelf:'end'}}><FileText size={8}/>{t('rcpt_go')}</button>:<span/>}
          </div>
        )}
        {/* Riga 2: cliente · data | prezzo */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{color:C.t3,fontSize:'0.7rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:8}} title={q.cliente||undefined}>{q.cliente||'—'}{q.data?` · ${q.data}`:''}</span>
          <span style={{color:isInt?C.warn:C.purple,fontWeight:600,fontSize:'0.82rem',flexShrink:0}}>{fmtV(isInt?q.costo_prod:q.prezzo)}</span>
        </div>
      </div>
    );
  };

  /* Pannello dettaglio preventivo selezionato */
  const DetailPanel=({q})=>{
    const isInt=!!q.uso_interno;
    const changes=detectChanges(q,mats,printers,settings.c_kwh,settings.valuta||"€");
    const hasC=changes.length>0&&!q.congelato;
    const rcptLocked=!!(q.ricevuta?.emessa&&!q.ricevuta?.annullata);
    return(<div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'0.75rem 1rem',borderBottom:`1px solid ${C.b}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,background:C.s1,flexWrap:'wrap',gap:6}}>
        <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap',minWidth:0}}>
          {isMobile&&<button onClick={()=>setSelId(null)} style={{background:'none',border:'none',color:C.a,cursor:'pointer',fontSize:'0.82rem',fontFamily:'inherit',padding:0,display:'flex',alignItems:'center',gap:4,flexShrink:0}}><ChevronLeft size={14}/>{t('nav_quotes')}</button>}
          <span style={{color:isInt?C.warn:C.purple,fontWeight:700,fontSize:'0.9rem',fontFamily:'monospace'}}>{q.numero}</span>
          {q.nome_progetto&&<span style={{color:C.teal,fontWeight:500}}>📁 {q.nome_progetto}</span>}
          <Badge label={tSt(q.stato,t)} color={qStaClr(q.stato)}/>
          {isInt&&<span style={{color:C.warn,fontSize:'0.75rem',background:C.warnBg,padding:'2px 7px',borderRadius:4}}>🏭 {t('q_int_badge')}</span>}
          {q.congelato&&<span style={{color:C.blue,fontSize:'0.72rem',display:'inline-flex',alignItems:'center',gap:3}}><Lock size={10}/>{t('q_frozen')}</span>}
          {rcptLocked&&<span style={{color:C.ok,fontSize:'0.72rem',display:'inline-flex',alignItems:'center',gap:3,background:C.okBg,padding:'1px 7px',borderRadius:4,border:`1px solid ${C.okBr}`}}><Lock size={10}/>{q.ricevuta.numero}</span>}
        </div>
        <div style={{display:'flex',gap:5,flexShrink:0}}>
          <Btn onClick={()=>!rcptLocked&&setModal({type:'quote_edit',data:q})} sm variant="blue" disabled={rcptLocked} title={rcptLocked?(lang==='en'?'Locked: receipt issued':'Bloccato: ricevuta emessa'):undefined}><Edit2 size={11}/>{t('edit')}</Btn>
          <Btn onClick={()=>setConfirm({type:'quote',id:q.id,nome:q.numero})} sm variant="dan"><Trash2 size={11}/></Btn>
          <Btn onClick={()=>setSelId(null)} sm><X size={11}/></Btn>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
        {/* Info generali */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
          <div style={{background:C.s2,borderRadius:6,padding:'0.6rem 0.75rem'}}>
            <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',marginBottom:2}}>{t('q_customer')}</div>
            <div style={{color:C.t,fontWeight:500}}>{q.cliente||'—'}</div>
          </div>
          <div style={{background:C.s2,borderRadius:6,padding:'0.6rem 0.75rem'}}>
            <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',marginBottom:2}}>{t('date_label')}</div>
            <div style={{color:C.t}}>{q.data||'—'}</div>
          </div>
        </div>
        {/* Modelli */}
        <div style={{marginBottom:12}}>
          <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',marginBottom:6}}>{t('q_models')}</div>
          {(q.modelli||[]).map((mod,i)=>(
            <div key={i} style={{background:C.s2,borderRadius:6,padding:'0.5rem 0.75rem',marginBottom:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <span style={{color:C.t,fontSize:'0.82rem',fontWeight:500}}>{mod.nome_modello||`M${i+1}`}</span>
                <div style={{color:C.t3,fontSize:'0.68rem',marginTop:1}}>
                  {(mod.materials||[]).map(({mat_id,peso_g})=>{const m=mats.find(x=>x.id===mat_id);return m?`${matNomeL(m,colorLang)} ${peso_g}g`:null;}).filter(Boolean).join(' · ')}
                  {mod.ore?` · ${mod.ore}h${mod.min>0?` ${mod.min}m`:''}`:''}{mod.m_op>0?` · ${fmtV(mod.m_op)} man.`:''}
                </div>
              </div>
              <Badge label={tSt(mod.stato,t)} color={qStaClr(mod.stato)}/>
            </div>
          ))}
        </div>
        {/* Costi */}
        {!isInt&&<div style={{background:C.a2,border:`1px solid ${C.a3}`,borderRadius:7,padding:'0.75rem',marginBottom:12}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:8}}>
            {[[t('cb_prod'),q.costo_prod,C.t],[t('q_taxable'),q.imponibile,C.t2],[t('cb_tot'),q.prezzo,C.purple]].map(([l,v,c])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',marginBottom:1}}>{l}</div>
                <div style={{color:c,fontWeight:600,fontSize:'0.88rem'}}>{fmtV(v)}</div>
              </div>
            ))}
          </div>
          {(q.metodi_pagamento||[]).length>0&&<div style={{color:C.t3,fontSize:'0.7rem'}}>{t('q_payment_methods')}: {(q.metodi_pagamento||[]).map(m=>m.nome).join(', ')}</div>}
        </div>}
        {isInt&&<div style={{background:'rgba(245,158,11,0.08)',border:`1px solid ${C.warnBr}`,borderRadius:7,padding:'0.75rem',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{color:C.t3,fontSize:'0.8rem'}}>{t('int_cost_label')}</span>
          <span style={{color:C.warn,fontWeight:700,fontSize:'1.1rem'}}>{fmtV(q.costo_prod)}</span>
        </div>}
        {/* Avviso variazioni */}
        {hasC&&<div style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:7,padding:'0.75rem',marginBottom:12}}>
          <div style={{color:C.warn,fontWeight:500,fontSize:'0.8rem',marginBottom:6}}>{t('q_changes_title')}</div>
          {changes.slice(0,3).map((ch,i)=><div key={i} style={{color:C.t2,fontSize:'0.72rem',marginBottom:2}}>• {ch}</div>)}
          <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
            <Btn onClick={()=>onUpdatePrices(q.id)} sm variant="ok"><RefreshCw size={11}/>{t('q_update')}</Btn>
            <Btn onClick={()=>onFreeze(q.id)} sm variant="blue"><Lock size={11}/>{t('q_freeze')}</Btn>
            <Btn onClick={()=>onDuplicate(q.id)} sm><Copy size={11}/>{t('q_dup')}</Btn>
          </div>
        </div>}
        {/* Note */}
        {q.note&&<div style={{background:C.s2,borderRadius:6,padding:'0.6rem 0.75rem',fontSize:'0.8rem',color:C.t2,marginBottom:12}}>{q.note}</div>}
        {/* PDF + Export */}
        {!isInt&&<div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <Btn onClick={()=>openPdf(buildPdfHtml(q,mats,printers,settings,false,lang,false))} variant="blue" sm><Eye size={11}/>{t('pdf_btn_int')}</Btn>
          <Btn onClick={()=>openPdf(buildPdfHtml(q,mats,printers,settings,false,lang,true))} variant="warn" sm><Eye size={11}/>{t('pdf_btn_cli')}</Btn>
          {q.stato==='Completato'&&<Btn onClick={()=>setSelRcptQ(q)} variant="ok" sm><FileText size={11}/>{t('rcpt_go')}</Btn>}
          <Btn onClick={()=>dlJson({_p3d_bundle:'v1',quote:q,prints:prints.filter(p=>p.quote_id===q.id)},`preventivo-${q.numero}-${q.data||'nd'}.json`)} variant="blue" sm><Download size={11}/>{t('q_export_single')}</Btn>
        </div>}
        {isInt&&<div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <Btn onClick={()=>dlJson({_p3d_bundle:'v1',quote:q,prints:prints.filter(p=>p.quote_id===q.id)},`interno-${q.numero}-${q.data||'nd'}.json`)} variant="blue" sm><Download size={11}/>{t('q_export_single')}</Btn>
        </div>}
      </div>
    </div>);
  };

  /* Se siamo in modalità ricevuta, mostra RicevutaView nel pannello 900px */
  if(selRcptQ){
    const liveQ={...(quotes.find(x=>x.id===selRcptQ.id)||selRcptQ),_openList:selRcptQ._openList};
    return(
      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>
        <div style={{width:'100%',maxWidth:900,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <RicevutaView
            quote={liveQ} quotes={quotes} settings={settings} clients={clients}
            mats={mats} printers={printers}
            rcptNums={rcptNums} setRcptNums={setRcptNums}
            onUpdateQuote={onUpdateQuote}
            onBack={()=>setSelRcptQ(null)}
            lang={lang}/>
        </div>
      </div>
    );
  }

  return(
    <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>

      {/* ── PANNELLO LISTA ── */}
      <div style={{width:selQ&&!isMobile?'38%':'100%',minWidth:240,maxWidth:selQ&&!isMobile?480:900,borderRight:selQ&&!isMobile?`1px solid ${C.b}`:'none',display:isMobile&&selQ?'none':'flex',flexDirection:'column',overflow:'hidden',transition:'width 0.2s'}}>
        {/* Header */}
        <div style={{padding:'0.75rem 1rem',borderBottom:`1px solid ${C.b}`,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexShrink:0}}>
          <span style={{color:C.t,fontWeight:500,fontSize:'1rem'}}>{t('nav_quotes')}</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {!selQ&&quotes.length>0&&<span style={{color:C.t3,fontSize:'0.72rem'}}>{t('quote_select_hint')}</span>}
            {quotes.some(q=>q.ricevuta?.numero)&&<Btn onClick={()=>{const anyQ=quotes.find(q=>q.ricevuta?.numero)||quotes[0];setSelRcptQ({...anyQ,_openList:true});}} variant="ok" sm><FileText size={11}/>{lang==='en'?'Receipt List':'Lista Ricevute'}</Btn>}
            <Btn onClick={()=>importRef.current.click()} variant="blue" sm><Upload size={11}/>{t('q_import')}</Btn>
            <input ref={importRef} type="file" accept=".json" onChange={importQuotes} style={{display:'none'}}/>
            <Btn onClick={()=>setModal({type:'quote'})} variant="pri" sm><Plus size={12}/>{t('q_new')}</Btn>
          </div>
        </div>
        {/* Cerca + filtri */}
        <div style={{padding:'0.5rem 0.75rem',borderBottom:`1px solid ${C.b}`,flexShrink:0}}>
          <div style={{position:'relative',marginBottom:6}}>
            <Search size={12} style={{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
            <input value={srchQ} onChange={e=>setSrchQ(e.target.value)} placeholder={t('q_search_ph')} style={{...inp,paddingLeft:'1.6rem',fontSize:'0.78rem'}}/>
          </div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {FLAG_STATI.map(f=>(
              <button key={f.k} onClick={()=>setFilterStato(f.k)}
                style={{fontSize:'0.68rem',padding:'2px 7px',borderRadius:4,border:`1px solid ${filterStato===f.k?f.color:C.b}`,background:filterStato===f.k?`${f.color}18`:'transparent',color:filterStato===f.k?f.color:C.t3,cursor:'pointer',fontFamily:'inherit'}}>
                {f.label}{f.n!==undefined?` ${f.n}`:''}
              </button>
            ))}
          </div>
        </div>
        {/* Lista */}
        <div style={{flex:1,overflowY:'auto',padding:'0.5rem 0.75rem'}}>
          {filteredAll.length===0&&<div style={{color:C.t3,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{quotes.length===0?t('q_none'):t('mat_none')}</div>}
          {(()=>{
            const CH_NUM=8.5,CH_PRJ=6.5;
            const qNumW=Math.max(70,...filteredAll.map(q=>(q.numero||'').length*CH_NUM+16));
            const qPrjRaw=Math.max(0,...filteredAll.map(q=>q.nome_progetto?(q.nome_progetto.length+2)*CH_PRJ+8:0));
            const qPrjW=Math.min(qPrjRaw,140);
            return filteredAll.map(q=><ListCard key={q.id} q={q} compact={!!(selQ&&!isMobile)} colNumW={qNumW} colPrjW={qPrjW}/>);
          })()}
          {quotes.length>0&&<div style={{background:C.s2,borderRadius:6,padding:'0.4rem 0.75rem',display:'flex',justifyContent:'space-between',marginTop:4}}>
            <span style={{color:C.t3,fontSize:'0.72rem'}}>{t('q_total')} · {quotes.length}</span>
            <span style={{color:C.purple,fontWeight:700,fontSize:'0.85rem'}}>{fmtV(totAll)}</span>
          </div>}
        </div>
      </div>

      {/* ── PANNELLO DETTAGLIO ── */}
      {selQ&&(
        <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <DetailPanel q={selQ}/>
        </div>
      )}

      {/* Stato vuoto dettaglio — hint inline nell'header lista */}
      {/* Modal form per nuovo/modifica preventivo (QuoteForm è troppo complesso per inline) */}
    </div>
  );
}

function ClientView({clients,setModal,setConfirm}){
  const {t}=useT();
  const [srch,setSrch]=useState('');
  const [sortBy,setSortBy]=useState('nome');

  const SORT_OPTS=[
    ['nome',t('rb_sort_nome')],
    ['azienda',t('rb_sort_azienda')],
    ['email',t('rb_sort_email')],
  ];

  const sortFn=(a,b)=>{
    if(sortBy==='nome')return([a.nome,a.cognome].filter(Boolean).join(' ')).localeCompare([b.nome,b.cognome].filter(Boolean).join(' '),'it');
    if(sortBy==='azienda')return(a.azienda||'zzz').localeCompare(b.azienda||'zzz','it');
    if(sortBy==='email')return(a.email||'').localeCompare(b.email||'');
    return 0;
  };

  const shown=clients
    .filter(c=>{
      const q=srch.toLowerCase();
      return!q||[c.nome,c.cognome||'',c.azienda||'',c.email||''].some(v=>v.toLowerCase().includes(q));
    })
    .sort(sortFn);

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      {/* ── BARRA FISSA ── */}
      <div style={{flexShrink:0,paddingBottom:'0.75rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
          <div style={{color:C.t,fontSize:'1.25rem',fontWeight:500}}>{t('rb_title')} <span style={{color:C.t3,fontSize:'0.8rem',fontWeight:400}}>({clients.length})</span></div>
          <Btn onClick={()=>setModal({type:'client',data:null})} variant="pri"><Plus size={13}/>{t('add')}</Btn>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          {/* Ricerca */}
          <div style={{position:'relative',flex:'1 1 200px'}}>
            <Search size={13} style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
            <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder={t('rb_search_ph')}
              style={{...inp,paddingLeft:'1.75rem',width:'100%'}}/>
            {srch&&<button onClick={()=>setSrch('')} style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:C.t3,cursor:'pointer',padding:0,display:'flex'}}><X size={11}/></button>}
          </div>
          {/* Sort */}
          <div style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>
            <span style={{color:C.t3,fontSize:'0.72rem'}}>{t('rb_sort')}:</span>
            {SORT_OPTS.map(([k,l])=>(
              <button key={k} onClick={()=>setSortBy(k)}
                style={{padding:'0.2rem 0.55rem',borderRadius:4,border:`1px solid ${sortBy===k?C.a:C.b}`,background:sortBy===k?C.a2:'transparent',color:sortBy===k?C.a:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit'}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── AREA SCROLLABILE ── */}
      <div style={{flex:1,overflowY:'auto'}}>
        {shown.length===0&&(
          <div style={{color:C.t3,padding:'3rem',textAlign:'center'}}>
            <Users size={36} style={{margin:'0 auto 0.75rem',display:'block',opacity:.3}}/>
            {clients.length===0
              ?<><div>{t('rb_none')}</div><div style={{marginTop:'1rem'}}><Btn onClick={()=>setModal({type:'client',data:null})} variant="pri">{t('rb_add_first')}</Btn></div></>
              :<div>{t('rb_no_results')}</div>}
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:6}}>
          {shown.map(c=>{
            const nome=[c.nome,c.cognome].filter(Boolean).join(' ');
            return(
              <div key={c.id} style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.75rem 1rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                {/* Avatar iniziali */}
                <div style={{width:38,height:38,borderRadius:'50%',background:C.a2,border:`1px solid ${C.a3}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{color:C.a,fontWeight:700,fontSize:'0.88rem'}}>{nome?nome.charAt(0).toUpperCase():'?'}</span>
                </div>
                {/* Dati principali */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap'}}>
                    <span style={{color:C.t,fontWeight:600,fontSize:'0.95rem'}}>{nome||'—'}</span>
                    {c.azienda&&<span style={{color:C.blue,fontSize:'0.8rem'}}>{c.azienda}</span>}
                  </div>
                  <div style={{display:'flex',gap:12,marginTop:2,flexWrap:'wrap'}}>
                    {c.email&&<span style={{color:C.t2,fontSize:'0.78rem'}}>{c.email}</span>}
                    {c.telefono&&<span style={{color:C.t2,fontSize:'0.78rem'}}>{c.telefono}</span>}
                    {(c.piva||c.cf)&&<span style={{color:C.t3,fontSize:'0.72rem'}}>{c.piva?`P.IVA ${c.piva}`:''}{c.piva&&c.cf?' · ':''}{c.cf?`CF ${c.cf}`:''}</span>}
                  </div>
                  {c.note&&<div style={{color:C.t3,fontSize:'0.72rem',marginTop:2,fontStyle:'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={c.note}>{c.note}</div>}
                </div>
                {/* Azioni */}
                <div style={{display:'flex',gap:4,flexShrink:0}}>
                  <Btn onClick={()=>setModal({type:'client',data:c})} sm><Edit2 size={12}/></Btn>
                  <Btn onClick={()=>setConfirm({type:'client',id:c.id,nome})} sm variant="dan"><Trash2 size={12}/></Btn>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══ DEF_MAT EDITORS — top-level per evitare il bug del cursore ══
   Definiti FUORI da SettingsPanel: se fossero dentro un if() verrebbero
   ricostruiti come nuovi tipi React ad ogni render → unmount/remount
   del campo input → cursore sparisce dopo ogni tasto. */
function DefMatListEditor({label,items,settingsKey,newVal,setNewVal,placeholder,setSettings,sorted}){
  const {t}=useT();
  const [srch,setSrch]=useState('');
  const filtered=srch.trim()?items.filter(v=>v.toLowerCase().includes(srch.trim().toLowerCase())):items;
  const addItem=()=>{
    const v=newVal.trim();
    if(!v||items.includes(v))return;
    setSettings(p=>{
      const next=[...(p[settingsKey]||[]),v];
      return{...p,[settingsKey]:sorted?next.sort((a,b)=>a.localeCompare(b)):next};
    });
    setNewVal('');
  };
  return(
    <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.75rem',marginBottom:'0.75rem'}}>
      <div style={{color:C.t,fontSize:'0.85rem',fontWeight:500,marginBottom:8}}>{label}</div>
      {/* Ricerca rapida */}
      {items.length>5&&<div style={{position:'relative',marginBottom:8}}>
        <Search size={11} style={{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
        <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder={t('filter_placeholder')} style={{...inp,paddingLeft:'1.5rem',fontSize:'0.75rem',padding:'0.25rem 0.5rem 0.25rem 1.5rem'}}/>
        {srch&&<button onClick={()=>setSrch('')} style={{position:'absolute',right:5,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:C.t3,cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button>}
      </div>}
      <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:8,maxHeight:120,overflowY:'auto'}}>
        {filtered.map((item,i)=>{
          const realIdx=items.indexOf(item);
          return(
            <div key={i} style={{display:'flex',alignItems:'center',gap:3,background:C.s3,border:`1px solid ${C.b}`,borderRadius:5,padding:'3px 8px 3px 10px'}}>
              <span style={{color:C.t2,fontSize:'0.78rem'}}>{item||'—'}</span>
              {items.length>1&&<button onClick={()=>setSettings(p=>({...p,[settingsKey]:(p[settingsKey]||[]).filter((_,j)=>j!==realIdx)}))} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',padding:1,display:'flex'}}><X size={10}/></button>}
            </div>
          );
        })}
        {filtered.length===0&&srch&&<span style={{color:C.t3,fontSize:'0.72rem'}}>{t('no_results')}</span>}
      </div>
      <div style={{display:'flex',gap:6}}>
        <input value={newVal} onChange={e=>setNewVal(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter')addItem();}}
          placeholder={placeholder} style={{...inp,flex:1}}/>
        <Btn onClick={addItem} variant="pri" disabled={!newVal.trim()||items.includes(newVal.trim())}><Plus size={13}/>{t('add')}</Btn>
      </div>
    </div>
  );
}
function DefMatColorEditor({coloriMap,setSettings}){
  const {t,lang}=useT();
  const [srchC,setSrchC]=useState('');
  const [newIT,setNewIT]=useState('');
  const [newEN,setNewEN]=useState('');
  /* Sort sicuro — usa localeCompare senza locale esplicito come fallback */
  const cmpIT=(a,b)=>{try{return a.it.localeCompare(b.it,'it');}catch{return a.it<b.it?-1:a.it>b.it?1:0;}};
  const cmpEN=(a,b)=>{try{return a.en.localeCompare(b.en,'en');}catch{return a.en<b.en?-1:a.en>b.en?1:0;}};
  const sortColors=arr=>[...arr].sort(lang==='en'?cmpEN:cmpIT);
  const filteredColors=sortColors(srchC.trim()
    ?coloriMap.filter(p=>p.it.toLowerCase().includes(srchC.toLowerCase())||p.en.toLowerCase().includes(srchC.toLowerCase()))
    :coloriMap);
  /* Auto-completamento incrociato dal dizionario */
  const handleIT=v=>{
    setNewIT(v);
    if(v!==v.trim())return; /* utente sta ancora scrivendo — non interrompere */
    const found=COLOR_BILINGUAL.find(c=>c.it.toLowerCase()===v.toLowerCase()||c.en.toLowerCase()===v.toLowerCase());
    if(found){setNewIT(found.it);setNewEN(found.en);}
  };
  const handleEN=v=>{
    setNewEN(v);
    if(v!==v.trim())return; /* utente sta ancora scrivendo — non interrompere */
    const found=COLOR_BILINGUAL.find(c=>c.en.toLowerCase()===v.toLowerCase()||c.it.toLowerCase()===v.toLowerCase());
    if(found){setNewIT(found.it);setNewEN(found.en);}
  };
  const addColor=()=>{
    const it=newIT.trim();const en=newEN.trim()||it;if(!it)return;
    const newPair={it,en};
    if(coloriMap.find(c=>c.en.toLowerCase()===en.toLowerCase()||c.it.toLowerCase()===it.toLowerCase()))return;
    setSettings(p=>{const nm=[...(p.nomi_colore_map||BASE_NOMI_COLORE_MAP),newPair].sort(cmpIT);return{...p,nomi_colore_map:nm,nomi_colore:nm.map(c=>c.en)};});
    setNewIT('');setNewEN('');
  };
  const removeColor=i=>{
    const realPair=filteredColors[i];
    setSettings(p=>{const nm=(p.nomi_colore_map||BASE_NOMI_COLORE_MAP).filter(c=>!(c.it===realPair.it&&c.en===realPair.en));return{...p,nomi_colore_map:nm,nomi_colore:nm.map(c=>c.en)};});
  };
  return(
    <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.75rem',marginBottom:'0.75rem'}}>
      <div style={{color:C.t,fontSize:'0.85rem',fontWeight:500,marginBottom:4}}>{t('def_mat_colors')}</div>
      <div style={{color:C.t3,fontSize:'0.7rem',marginBottom:8}}>{lang==='it'?'Colonna IT → EN. Digita in un campo: se il colore è nel dizionario, l\'altro si compila automaticamente; altrimenti inserisci entrambi manualmente.':'IT → EN columns. Type in either field: if the color is in the dictionary the other auto-fills; otherwise fill both manually.'}</div>
      {/* Filtro ricerca colori */}
      <div style={{position:'relative',marginBottom:8}}>
        <Search size={11} style={{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
        <input value={srchC} onChange={e=>setSrchC(e.target.value)} placeholder={t('search_color_ph')} style={{...inp,paddingLeft:'1.5rem',fontSize:'0.75rem',padding:'0.25rem 0.5rem 0.25rem 1.5rem'}}/>
        {srchC&&<button onClick={()=>setSrchC('')} style={{position:'absolute',right:5,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:C.t3,cursor:'pointer',padding:0,display:'flex'}}><X size={9}/></button>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:4,marginBottom:4}}>
        <span style={{color:C.t3,fontSize:'0.68rem',textTransform:'uppercase'}}>IT</span>
        <span style={{color:C.t3,fontSize:'0.68rem',textTransform:'uppercase'}}>EN</span>
        <span/>
      </div>
      <div style={{maxHeight:200,overflowY:'auto',marginBottom:8}}>
        {filteredColors.map((pair,i)=>(
          <div key={`${pair.it}-${pair.en}`} style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:4,marginBottom:3,alignItems:'center'}}>
            <span style={{color:C.t2,fontSize:'0.78rem',background:C.s3,borderRadius:4,padding:'3px 8px'}}>{pair.it}</span>
            <span style={{color:C.t2,fontSize:'0.78rem',background:C.s3,borderRadius:4,padding:'3px 8px'}}>{pair.en}</span>
            {coloriMap.length>1&&<button onClick={()=>removeColor(i)} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',padding:1,display:'flex'}}><X size={10}/></button>}
          </div>
        ))}
        {filteredColors.length===0&&srchC&&<div style={{color:C.t3,fontSize:'0.72rem',padding:'0.5rem'}}>{t('no_results_for')} "{srchC}"</div>}
      </div>
      {/* Aggiunta colore: due campi IT + EN allineati alle colonne */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:6,alignItems:'center'}}>
        <input value={newIT} onChange={e=>handleIT(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&addColor()}
          placeholder={lang==='it'?'Nome IT (es. Verde lime)':'IT name (e.g. Lime Green)'}
          style={{...inp,fontSize:'0.8rem'}}/>
        <input value={newEN} onChange={e=>handleEN(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&addColor()}
          placeholder={lang==='it'?'Nome EN (es. Lime Green)':'EN name (e.g. Verde lime)'}
          style={{...inp,fontSize:'0.8rem'}}/>
        <Btn onClick={addColor} variant="pri" disabled={!newIT.trim()}><Plus size={13}/>{t('add')}</Btn>
      </div>
    </div>
  );
}

function SettingsPanel({settingsSub,settings,setSettings,mats,setMats,prints,setPrints,quotes,setQuotes,printers,setPrinters,clients,setClients,usedNums,setUsedNums,setReport,sessionFileName,setModal,setConfirm}){
  const {t,lang,setLang}=useT();
  const fmtV=useFmt();
  const importAllRef=useRef();const importMatRef=useRef();const importCsvMatRef=useRef();const importCsvDualRef=useRef();const logoRef=useRef();
  const [newSx,setNewSx]=useState({nome:'',prezzo:0});
  const [newCr,setNewCr]=useState({nome:'',servizio:'',prezzo:0});
  const [newMp,setNewMp]=useState({nome:'',descrizione:''});
  const [resetStep,setResetStep]=useState(0);/* 0=idle 1=prima conferma 2=seconda conferma */
  /* stati per def_mat — devono stare qui (regola hooks) */
  const [newMat2,setNewMat2]=useState('');
  const [newTipoMat,setNewTipoMat]=useState('');
  const [newMarca,setNewMarca]=useState('');
  const [newColore2,setNewColore2]=useState(''); // eslint-disable-line (mantenuto per compatibilità futura)
  const ss=(k,v)=>setSettings(p=>({...p,[k]:v}));
  /* helper con functional update sicuro (usa sempre lo stato più recente) */
  const ssArr=(key,i,patch)=>setSettings(p=>({...p,[key]:(p[key]||[]).map((x,j)=>j===i?{...x,...patch}:x)}));
  const ssDel=(key,i)=>setSettings(p=>({...p,[key]:(p[key]||[]).filter((_,j)=>j!==i)}));
  const ssAdd=(key,item)=>setSettings(p=>({...p,[key]:[...(p[key]||[]),item]}));
  /* conferma eliminazione inline per liste impostazioni */
  const [pendingDel,setPendingDel]=useState(null); /* {key,i,nome} */
  const askDel=(key,i,nome)=>setPendingDel({key,i,nome});
  const confirmDel=()=>{if(pendingDel){ssDel(pendingDel.key,pendingDel.i);}setPendingDel(null);};
  const exportAll=()=>dlJson({mats,prints,quotes,printers,settings,usedNums,clients,_version:DATA_VERSION},`print3d-backup-${new Date().toISOString().slice(0,10)}.json`);
  /* Stock Completo = materiali + bobine (tutto il dato materiale) */
  const exportStock=()=>dlJson(mats,`stock-completo-${new Date().toISOString().slice(0,10)}.json`);
  const exportMatCsv=()=>dlCsv(mats,`materiali-${new Date().toISOString().slice(0,10)}.csv`);
  /* Export doppio: materiali + bobine */
  const exportMatCsvDual=()=>dlCsvDual(mats,new Date().toISOString().slice(0,10));
  /* Import doppio: materiali + bobine */
  const importDualCsv=e=>{
    const files=Array.from(e.target.files||[]);
    if(!files.length){e.target.value='';return;}
    const readFile=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.onerror=rej;r.readAsText(f);});
    const detectType=text=>{
      const firstLine=(text.trim().split(/\r?\n/)[0]||'').toLowerCase();
      if(firstLine.includes('materiale_id')||firstLine.includes('id_bobina'))return'spools';
      if(firstLine.includes('nome')&&firstLine.includes('materiale')&&firstLine.includes('stock'))return'mats';
      return'unknown';
    };
    Promise.all(files.map(async f=>{const text=await readFile(f);return{text,type:detectType(text),name:f.name};})).then(results=>{
      const matFile=results.find(r=>r.type==='mats');
      const spoolFile=results.find(r=>r.type==='spools');
      const notes=[];const errs=[];
      if(!matFile){setReport({title:t('imp_err'),notes:[t('csv_dual_err_nomat')],type:'err'});e.target.value='';return;}
      /* parse materiali */
      const matResult=parseCsvMats(matFile.text,mats);
      if(!matResult.ok){setReport({title:t('imp_err'),notes:[t('inv_csv_err'),...matResult.errors],type:'err'});e.target.value='';return;}
      let newMats=[...matResult.mats];
      /* report materiali */
      const d=matResult.diff;
      if(d.created.length)notes.push(`✨ Nuovi: ${d.created.length} — ${d.created.map(m=>m.nome).slice(0,4).join(', ')}${d.created.length>4?'…':''}`);
      if(d.updated.length)notes.push(`✏️ Modificati: ${d.updated.length}`);
      if(d.unchanged.length)notes.push(`✓ Invariati: ${d.unchanged.length}`);
      if(d.removed.length)notes.push(`🗑️ Rimossi: ${d.removed.length}`);
      matResult.errors.forEach(er=>errs.push(`⚠ ${er}`));
      /* parse bobine */
      let spoolCount=0;
      if(spoolFile){
        const spResult=parseCsvSpools(spoolFile.text,newMats);
        spResult.errors.forEach(er=>errs.push(er));
        if(spResult.ok&&Object.keys(spResult.spoolsMap).length>0){
          newMats=newMats.map(m=>{
            const importedSpools=spResult.spoolsMap[m.id];
            if(!importedSpools)return m;
            spoolCount+=importedSpools.length;
            /* ricalcola stock e prezzo dalla lista bobine importate */
            const newStock=calcStockFromSpools(importedSpools);
            const newPrezzo=calcPrezzoMedio(importedSpools,m.prezzo_manuale||m.prezzo,m.prezzo_storico_archiviato_kg,m.qty_storica_g);
            return{...m,spools:importedSpools,stock:newStock||m.stock,prezzo:newPrezzo||m.prezzo};
          });
          notes.push(`🪛 ${t('csv_dual_spools_imported')}: ${spoolCount}`);
        }
      }else{
        notes.push(`⚠ ${t('csv_dual_warn_missing')}`);
      }
      setMats(newMats);
      const hasWarn=d.removed.length>0||errs.length>0||!spoolFile;
      setReport({title:t('csv_dual_ok'),notes:[...notes,...errs],type:hasWarn?'warn':'ok'});
    }).catch(err=>setReport({title:t('imp_err'),notes:[err.message],type:'err'}));
    e.target.value='';
  };
  const importAll=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{const raw=JSON.parse(ev.target.result);if(!raw.mats&&!raw.prints&&!raw.quotes){setReport({title:t('imp_unknown'),notes:[t('imp_invalid')],type:'err'});return;}const mg=migrateBackup(raw);setMats(mg.mats);setPrints(mg.prints);setQuotes(mg.quotes);setPrinters(mg.printers);setSettings({...mg.settings,logo:settings.logo});setUsedNums(mg.usedNums);if(mg.clients)setClients(mg.clients);if(mg.rcptNums)setRcptNums(mg.rcptNums);setReport({title:t('imp_ok'),notes:[`${mg.mats.length} mat. · ${mg.prints.length} stampe · ${mg.quotes.length} prev.`,...mg.notes],type:mg.sourceVersion!==DATA_VERSION?'warn':'ok'});}catch(err){setReport({title:t('imp_err'),notes:[t('imp_invalid'),`${err.message}`],type:'err'});}};r.readAsText(file);e.target.value='';};
  const importMatsCsv=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{const result=parseCsvMats(ev.target.result,mats);if(!result.ok){setReport({title:t('imp_err'),notes:[t('inv_csv_err'),...result.errors],type:'err'});return;}setMats(result.mats);const{diff,errors}=result;const notes=[];if(diff.created.length)notes.push(`✨ Nuovi: ${diff.created.length} — ${diff.created.map(m=>m.nome).slice(0,5).join(', ')}${diff.created.length>5?'…':''}`);if(diff.updated.length)notes.push(`✏️ Modificati: ${diff.updated.length} — ${diff.updated.map(m=>m.nome).slice(0,5).join(', ')}${diff.updated.length>5?'…':''}`);if(diff.removed.length)notes.push(`🗑️ Rimossi: ${diff.removed.length} — ${diff.removed.map(m=>m.nome).slice(0,5).join(', ')}${diff.removed.length>5?'…':''}`);if(diff.unchanged.length)notes.push(`✓ Invariati: ${diff.unchanged.length} materiali`);errors.forEach(e=>notes.push(`⚠ ${e}`));setReport({title:`CSV importato — ${result.mats.length} materiali`,notes:notes.length?notes:['Nessuna modifica rilevata.'],type:diff.removed.length>0?'warn':'ok'});}catch(err){setReport({title:t('imp_err'),notes:[err.message],type:'err'});}};r.readAsText(file);e.target.value='';};
  const importMats=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{const raw=JSON.parse(ev.target.result);const{mats:nm,notes,ok}=migrateMatsOnly(raw);if(!ok){setReport({title:t('imp_err'),notes,type:'err'});return;}setMats(nm);setReport({title:`${nm.length} materiali importati`,notes,type:'ok'});}catch(err){setReport({title:t('imp_err'),notes:[err.message],type:'err'});}};r.readAsText(file);e.target.value='';};
  const importLogo=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>ss('logo',ev.target.result);r.readAsDataURL(file);e.target.value='';};


  if(settingsSub==='azienda') return(<div>
    <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('sub_azienda')}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
      <div style={{gridColumn:'1/-1'}}><F label={t('set_rs')} span2><Inp v={settings.ragione_sociale||''} set={v=>ss('ragione_sociale',v)}/></F></div>
      <F label={t('rb_field_name')}><Inp v={settings.nome_referente||''} set={v=>ss('nome_referente',v)} ph="Mario"/></F>
      <F label={t('rb_field_surname')}><Inp v={settings.cognome_referente||''} set={v=>ss('cognome_referente',v)} ph="Rossi"/></F>
      <F label={t('set_address')} span2><Inp v={settings.indirizzo||''} set={v=>ss('indirizzo',v)} ph="Via Roma, 1"/></F>
      <F label={t('set_city')}><Inp v={settings.citta||''} set={v=>ss('citta',v)} ph="Milano"/></F>
      <F label={t('set_province')}><Inp v={settings.provincia||''} set={v=>ss('provincia',v)} ph="MI"/></F>
      <F label="CAP"><Inp v={settings.cap||''} set={v=>ss('cap',v)} ph="20100"/></F>
      <div/>
      <F label={t('rb_piva')}><Inp v={settings.piva||''} set={v=>ss('piva',v)} ph="IT12345678901"/></F>
      <F label={t('rb_cf')}><Inp v={settings.cf_azienda||''} set={v=>ss('cf_azienda',v)} ph="RSSMRA80..."/></F>
      <div style={{gridColumn:'1/-1'}}>
        <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6}}>{t('set_logo')}</div>
        {settings.logo&&<div style={{marginBottom:8,background:C.s2,borderRadius:6,padding:8,display:'inline-block'}}><img src={settings.logo} alt="Logo" style={{maxHeight:60,maxWidth:200,display:'block'}}/></div>}
        <div style={{display:'flex',gap:6}}><Btn onClick={()=>logoRef.current.click()} variant="blue"><Upload size={13}/>{settings.logo?t('set_logo_change'):t('set_logo_upload')}</Btn>{settings.logo&&<Btn onClick={()=>ss('logo',null)} variant="dan" sm><X size={12}/></Btn>}</div>
        <input ref={logoRef} type="file" accept="image/*" onChange={importLogo} style={{display:'none'}}/>
      </div>
    </div>
  </div>);

  if(settingsSub==='regime') return(<div>
    <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('sub_regime')}</div>
    <div style={{display:'flex',gap:8,marginBottom:'0.875rem',flexWrap:'wrap'}}>
      {REGIMI.map(r=>(<button key={r} onClick={()=>{ss('regime',r);if(r!=='ordinario')ss('iva',0);else ss('iva',22);}} style={{padding:'0.4rem 0.875rem',borderRadius:6,border:`1px solid ${settings.regime===r?C.a:C.b}`,background:settings.regime===r?C.a2:'transparent',color:settings.regime===r?C.a:C.t2,cursor:'pointer',fontSize:'0.85rem',fontFamily:'inherit'}}>{r==='ordinario'?t('set_regime_ord'):r==='forfettario'?t('set_regime_forf'):t('set_regime_occ')}</button>))}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginBottom:'0.75rem'}}>
      <F label={t('set_iva')}><Inp type="number" v={settings.regime==='ordinario'?+settings.iva:0} set={v=>settings.regime==='ordinario'&&ss('iva',+v)} min={0} step={1}/>{settings.regime!=='ordinario'&&<div style={{color:C.t3,fontSize:'0.7rem',marginTop:2}}>IVA 0% per questo regime</div>}</F>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,padding:'0.25rem 0'}}>
        <div style={{color:C.t2,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>Ritenuta d'acconto</div>
        <div style={{display:'flex',justifyContent:'center'}}>
          {settings.regime==='occasionale'
            ?<Chk v={settings.ritenuta} set={v=>ss('ritenuta',v)} label={t('set_ritenuta_apply')}/>
            :<div style={{color:C.t3,fontSize:'0.75rem',textAlign:'center'}}>{t('set_ritenuta_only')}</div>}
        </div>
      </div>
    </div>
    {settings.regime==='forfettario'&&<F label={t('set_forf_label')}>
      <Ta v={settings.nota_forfettario||NOTE_FORFETTARIO} set={v=>ss('nota_forfettario',v)} rows={5}/>
      <button onClick={()=>ss('nota_forfettario',NOTE_FORFETTARIO)} style={{marginTop:4,background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:'0.68rem',fontFamily:'inherit',textDecoration:'underline',padding:0}}>{lang==='it'?'↺ Ripristina testo predefinito':'↺ Reset to default'}</button>
    </F>}
    {settings.regime==='occasionale'&&<F label={t('set_occ_label')}>
      <Ta v={settings.nota_occasionale||NOTE_OCCASIONALE} set={v=>ss('nota_occasionale',v)} rows={6}/>
      <button onClick={()=>ss('nota_occasionale',NOTE_OCCASIONALE)} style={{marginTop:4,background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:'0.68rem',fontFamily:'inherit',textDecoration:'underline',padding:0}}>{lang==='it'?'↺ Ripristina testo predefinito':'↺ Reset to default'}</button>
    </F>}
  </div>);

  if(settingsSub==='costi') return(<div>
    <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('sub_costi')}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.5rem',marginBottom:'0.75rem'}}>
      <F label={t('set_energy')}><Inp type="number" v={settings.c_kwh} set={v=>ss('c_kwh',v)} min={0} step={0.01}/></F>
      <F label={t('set_labor_def')}><Inp type="number" v={settings.m_op_default} set={v=>ss('m_op_default',v)} min={0} step={0.5}/></F>
      <F label={t('set_markup_def')}><Inp type="number" v={settings.markup_globale||30} set={v=>ss('markup_globale',v)} min={0}/></F>
      <F label={t('set_currency')}>
        <div style={{display:'flex',gap:4}}>
          {['€','$','£','¥'].map(sym=>(
            <button key={sym} onClick={()=>ss('valuta',sym)}
              style={{flex:1,padding:'0.35rem',borderRadius:6,border:`1px solid ${(settings.valuta||'€')===sym?C.a:C.b}`,background:(settings.valuta||'€')===sym?C.a2:'transparent',color:(settings.valuta||'€')===sym?C.a:C.t2,cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',fontWeight:600}}>
              {sym}
            </button>
          ))}
        </div>
      </F>
    </div>
    
    <div style={{background:C.s2,borderRadius:6,padding:'0.875rem',marginTop:'0.5rem'}}>
      <div style={{color:C.t,fontSize:'0.82rem',fontWeight:500,marginBottom:8}}>{t('set_formula')}</div>
      <div style={{background:C.s3,borderRadius:5,padding:'0.625rem 0.875rem',marginBottom:'0.75rem'}}>
        <code style={{color:C.a,fontSize:'0.77rem',lineHeight:1.8,display:'block'}}>
          Costo materiali = Σ ( P_g × W_g × (1 + mat_mk%) × (1 + fail%) )
        </code>
        <code style={{color:C.t2,fontSize:'0.77rem',lineHeight:1.8,display:'block'}}>
          Costo totale = Costo materiali + T_h×E_kw×C_kwh + T_h×A_h + M_op + Corriere
        </code>
      </div>
      <div style={{color:C.t2,fontSize:'0.75rem',fontWeight:500,marginBottom:6}}>{t('set_formula_legend')}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',color:C.t3,fontSize:'0.72rem',lineHeight:1.7}}>
        <div>• {t('set_formula_pg')}</div>
        <div>• {t('set_formula_wg')}</div>
        <div>• {t('set_formula_mk')}</div>
        <div style={{color:C.err}}>• {t('set_formula_fail')}</div>
        <div>• {t('set_formula_th')}</div>
        <div>• {t('set_formula_ekw')}</div>
        <div>• {t('set_formula_ckwh')}</div>
        <div>• {t('set_formula_ah')}</div>
        <div>• {t('set_formula_mop')}</div>
      </div>
    </div>
  </div>);

  if(settingsSub==='def_mat'){
    const matsList=settings.materiali||BASE_MATERIALI;
    const tipiMatList=settings.tipi_mat||BASE_TIPI_MAT;
    const produttoriList=[...(settings.produttori||BASE_PRODUTTORI)].sort((a,b)=>a.localeCompare(b));
    const coloriMap=settings.nomi_colore_map||BASE_NOMI_COLORE_MAP;
    const quickTypes=settings.quick_types||QUICK_TYPES;
    return(<div>
      <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'0.5rem'}}>{t('sub_def_mat')}</div>
      <div style={{background:C.blueBg,border:`1px solid ${C.blueBr}`,borderRadius:6,padding:'0.5rem 0.75rem',fontSize:'0.78rem',color:C.blue,marginBottom:'1rem'}}>{t('def_mat_note')}</div>
      <DefMatListEditor label={t('def_mat_materials')} items={matsList} settingsKey="materiali" newVal={newMat2} setNewVal={setNewMat2} placeholder={t('def_mat_add_mat')} setSettings={setSettings}/>
      <DefMatListEditor label={t('def_mat_types')} items={tipiMatList} settingsKey="tipi_mat" newVal={newTipoMat} setNewVal={setNewTipoMat} placeholder={t('def_mat_add_type')} setSettings={setSettings}/>
      <DefMatListEditor label={t('def_mat_brands')} items={produttoriList} settingsKey="produttori" newVal={newMarca} setNewVal={setNewMarca} placeholder={t('def_mat_add_brand')} setSettings={setSettings} sorted/>
      <DefMatColorEditor coloriMap={coloriMap} setSettings={setSettings}/>

      {/* ── Editor Quick Types ── */}
      <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.75rem',marginTop:'1rem'}}>
        <div style={{color:C.t,fontSize:'0.85rem',fontWeight:500,marginBottom:3}}>{t('def_mat_quick')}</div>
        <div style={{color:C.t3,fontSize:'0.72rem',marginBottom:'0.625rem'}}>{t('def_mat_quick_hint')}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:'0.625rem'}}>
          {quickTypes.map((tp,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:3,background:C.s3,border:`1px solid ${tC(tp)}44`,borderRadius:5,padding:'2px 6px 2px 8px'}}>
              <span style={{color:tC(tp),fontSize:'0.78rem',fontWeight:600}}>{tp}</span>
              <button onClick={()=>setSettings(s=>({...s,quick_types:quickTypes.filter((_,j)=>j!==i)}))}
                style={{background:'none',border:'none',color:C.t3,cursor:'pointer',padding:1,display:'flex',lineHeight:1}}>
                <X size={10}/>
              </button>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <select onChange={e=>{
            const v=e.target.value;
            if(v&&!quickTypes.includes(v))setSettings(s=>({...s,quick_types:[...(s.quick_types||QUICK_TYPES),v]}));
            e.target.value='';
          }} style={{...inp,fontSize:'0.78rem',padding:'0.25rem 0.5rem',flex:1}}>
            <option value="">{t('def_mat_quick_add')}</option>
            {(settings.materiali||BASE_MATERIALI).filter(m=>!quickTypes.includes(m)).map(m=>(
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <Btn onClick={()=>setSettings(s=>({...s,quick_types:[...QUICK_TYPES]}))} variant="sec" sm>{t('inv_all')}</Btn>
        </div>
      </div>
    </div>);
  }

  if(settingsSub==='servizi') return(<div>
    <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('sub_servizi')}</div>
    {/* Conferma eliminazione inline */}
    {pendingDel&&<div style={{background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:8,padding:'0.75rem',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
      <span style={{color:C.err,fontSize:'0.82rem'}}>{t('confirm_del')}: <strong>{pendingDel.nome}</strong>?</span>
      <div style={{display:'flex',gap:6}}><Btn onClick={()=>setPendingDel(null)}>{t('cancel')}</Btn><Btn onClick={confirmDel} variant="dan"><Trash2 size={12}/>{t('del')}</Btn></div>
    </div>}
    {(settings.servizi_extra||[]).map((sx,i)=>(
      <div key={sx.id||i} style={{display:'flex',gap:6,alignItems:'center',background:C.s2,borderRadius:6,padding:'0.3rem 0.5rem',marginBottom:5}}>
        <Inp v={sx.nome} set={v=>ssArr('servizi_extra',i,{nome:v})} style={{flex:1,padding:'0.25rem 0.5rem',fontSize:'0.82rem'}}/>
        <Inp type="number" v={sx.prezzo} set={v=>ssArr('servizi_extra',i,{prezzo:+v})} style={{width:70,padding:'0.25rem 0.5rem',fontSize:'0.82rem'}} min={0} step={0.5}/>
        <span style={{color:C.t3,fontSize:'0.72rem'}}>{settings.valuta||'€'}</span>
        <button onClick={()=>askDel('servizi_extra',i,sx.nome)} style={{background:'none',border:'none',color:C.err,cursor:'pointer',padding:2,display:'flex',flexShrink:0}}><Trash2 size={13}/></button>
      </div>
    ))}
    <div style={{display:'flex',gap:6,marginTop:8}}>
      <Inp v={newSx.nome} set={v=>setNewSx(p=>({...p,nome:v}))} ph={t('set_add_service')} style={{flex:1}}/>
      <Inp type="number" v={newSx.prezzo} set={v=>setNewSx(p=>({...p,prezzo:+v}))} style={{width:80}} min={0} step={0.5}/>
      <span style={{color:C.t3,fontSize:'0.72rem',alignSelf:'center'}}>{settings.valuta||'€'}</span>
      <Btn onClick={()=>{if(newSx.nome.trim()){ssAdd('servizi_extra',{id:'sx'+uid(),nome:newSx.nome.trim(),prezzo:+newSx.prezzo});setNewSx({nome:'',prezzo:0});}}} variant="pri" disabled={!newSx.nome.trim()}><Plus size={13}/>{t('add')}</Btn>
    </div>
  </div>);

  if(settingsSub==='corrieri') return(<div>
    <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('sub_corrieri')}</div>
    {/* Conferma eliminazione inline */}
    {pendingDel&&<div style={{background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:8,padding:'0.75rem',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
      <span style={{color:C.err,fontSize:'0.82rem'}}>{t('confirm_del')}: <strong>{pendingDel.nome}</strong>?</span>
      <div style={{display:'flex',gap:6}}><Btn onClick={()=>setPendingDel(null)}>{t('cancel')}</Btn><Btn onClick={confirmDel} variant="dan"><Trash2 size={12}/>{t('del')}</Btn></div>
    </div>}
    {(settings.corrieri||[]).map((cr,i)=>(
      <div key={cr.id||i} style={{display:'flex',gap:6,alignItems:'center',background:C.s2,borderRadius:6,padding:'0.3rem 0.5rem',marginBottom:5}}>
        <Inp v={cr.nome} set={v=>ssArr('corrieri',i,{nome:v})} style={{flex:1.5,padding:'0.25rem 0.5rem',fontSize:'0.82rem'}} ph={t('set_cr_carrier_name')}/>
        <Inp v={cr.servizio||''} set={v=>ssArr('corrieri',i,{servizio:v})} style={{flex:1,padding:'0.25rem 0.5rem',fontSize:'0.82rem'}} ph={t('set_cr_service_ph')}/>
        <Inp type="number" v={cr.prezzo} set={v=>ssArr('corrieri',i,{prezzo:+v})} style={{width:70,padding:'0.25rem 0.5rem',fontSize:'0.82rem'}} min={0} step={0.5}/>
        <span style={{color:C.t3,fontSize:'0.72rem'}}>{settings.valuta||'€'}</span>
        <button onClick={()=>askDel('corrieri',i,cr.nome)} style={{background:'none',border:'none',color:C.err,cursor:'pointer',padding:2,display:'flex',flexShrink:0}}><Trash2 size={13}/></button>
      </div>
    ))}
    <div style={{display:'flex',gap:6,marginTop:8}}>
      <Inp v={newCr.nome} set={v=>setNewCr(p=>({...p,nome:v}))} ph={t('set_add_corriere')} style={{flex:1.5}}/>
      <Inp v={newCr.servizio||''} set={v=>setNewCr(p=>({...p,servizio:v}))} ph={t('set_cr_service')} style={{flex:1}}/>
      <Inp type="number" v={newCr.prezzo} set={v=>setNewCr(p=>({...p,prezzo:+v}))} style={{width:80}} min={0} step={0.5}/>
      <span style={{color:C.t3,fontSize:'0.72rem',alignSelf:'center'}}>{settings.valuta||'€'}</span>
      <Btn onClick={()=>{if(newCr.nome.trim()){ssAdd('corrieri',{id:'cr'+uid(),nome:newCr.nome.trim(),servizio:newCr.servizio.trim(),prezzo:+newCr.prezzo});setNewCr({nome:'',servizio:'',prezzo:0});}}} variant="pri" disabled={!newCr.nome.trim()}><Plus size={13}/>{t('add')}</Btn>
    </div>
  </div>);

  if(settingsSub==='pagamenti') return(<div>
    <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('sub_pagamenti')}</div>
    {/* Conferma eliminazione inline */}
    {pendingDel&&<div style={{background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:8,padding:'0.75rem',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
      <span style={{color:C.err,fontSize:'0.82rem'}}>{t('confirm_del')}: <strong>{pendingDel.nome}</strong>?</span>
      <div style={{display:'flex',gap:6}}><Btn onClick={()=>setPendingDel(null)}>{t('cancel')}</Btn><Btn onClick={confirmDel} variant="dan"><Trash2 size={12}/>{t('del')}</Btn></div>
    </div>}
    <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:'1rem'}}>
      {(settings.metodi_pagamento||[]).map((mp,i)=>(
        <div key={mp.id||i} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.75rem'}}>
          <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:6}}>
            <Inp v={mp.nome} set={v=>ssArr('metodi_pagamento',i,{nome:v})} style={{fontWeight:500,fontSize:'0.85rem'}}/>
            <button onClick={()=>askDel('metodi_pagamento',i,mp.nome)} style={{background:'none',border:'none',color:C.err,cursor:'pointer',padding:2,display:'flex',flexShrink:0}}><Trash2 size={13}/></button>
          </div>
          <Ta v={mp.descrizione||''} set={v=>ssArr('metodi_pagamento',i,{descrizione:v})} ph={t('set_pay_instructions')} rows={3}/>
        </div>
      ))}
    </div>
    <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.75rem'}}>
      <div style={{color:C.t2,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8}}>{t('set_pay_add_method')}</div>
      <F label={t('set_pay_name')}><Inp v={newMp.nome} set={v=>setNewMp(p=>({...p,nome:v}))} ph={t('set_pay_name_ph')}/></F>
      <F label={t('set_pay_desc')}><Ta v={newMp.descrizione} set={v=>setNewMp(p=>({...p,descrizione:v}))} ph={t('set_pay_desc_ph')} rows={3}/></F>
      <div style={{marginTop:8}}><Btn onClick={()=>{if(newMp.nome.trim()){ssAdd('metodi_pagamento',{id:'mp'+uid(),nome:newMp.nome.trim(),descrizione:newMp.descrizione});setNewMp({nome:'',descrizione:''});}}} variant="pri" disabled={!newMp.nome.trim()}><Plus size={13}/>{t('set_pay_add')}</Btn></div>
    </div>
  </div>);

  if(settingsSub==='lang') return(
    <div>
      <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('sub_lang')}</div>
      <div style={{color:C.t2,fontSize:'0.85rem',marginBottom:'1.25rem'}}>{t('set_lang_label')}</div>
      <div style={{display:'flex',gap:12}}>
        {[['it','IT',t('set_lang_it')],['en','EN',t('set_lang_en')]].map(([code,flag,label])=>(
          <button key={code} onClick={()=>setLang(code)} style={{padding:'0.875rem 1.5rem',borderRadius:10,border:`2px solid ${lang===code?C.a:C.b}`,background:lang===code?C.a2:C.s2,color:lang===code?C.a:C.t2,cursor:'pointer',fontSize:'0.9rem',fontFamily:'inherit',fontWeight:lang===code?700:400,display:'flex',flexDirection:'column',alignItems:'center',gap:6,minWidth:110}}>
            <span style={{fontSize:'2rem'}}>{flag}</span>
            <span>{label}</span>
            {lang===code&&<span style={{fontSize:'0.7rem',color:C.a,opacity:0.8}}>✓ attiva</span>}
          </button>
        ))}
      </div>
      <div style={{marginTop:'1rem',background:C.s2,borderRadius:6,padding:'0.75rem',color:C.t3,fontSize:'0.8rem'}}>
        {t('set_lang_current')}
      </div>
      <div style={{marginTop:'1.25rem',background:C.s2,borderRadius:8,padding:'0.875rem'}}>
        <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer'}}>
          <input type="checkbox" checked={!!settings.colori_en} onChange={e=>setSettings(p=>({...p,colori_en:e.target.checked}))}
            style={{width:17,height:17,marginTop:1,accentColor:C.a,cursor:'pointer',flexShrink:0}}/>
          <div>
            <div style={{color:C.t,fontSize:'0.88rem',fontWeight:500,marginBottom:3}}>{t('set_color_lang_en')}</div>
            <div style={{color:C.t3,fontSize:'0.75rem',lineHeight:1.4}}>{t('set_color_lang_en_hint')}</div>
          </div>
        </label>
      </div>
    </div>
  );


  if(settingsSub==='aspetto'){
    const tema=settings.tema||{preset:TEMA_DEFAULT,custom:null};
    const isCustom=tema.preset==='custom';
    const activePreset=TEMA_PRESETS.find(p=>p.id===tema.preset)||TEMA_PRESETS[0];
    const customColors=tema.custom||{...activePreset};
    const setPreset=id=>setSettings(p=>({...p,tema:{preset:id,custom:null}}));
    const setCustomSlot=(slot,val)=>{
      const base=tema.custom||{...activePreset};
      setSettings(p=>({...p,tema:{preset:'custom',custom:{...base,[slot]:val}}}));
    };
    const swatchStyle=(color,slot)=>({
      width:36,height:28,borderRadius:4,cursor:'pointer',border:`1px solid ${C.b}`,
      background:'none',padding:2,display:'inline-block',
    });
    const SLOTS_GROUPS=[
      {label:t('tema_bg'),keys:['bg','s1','s2','s3'],labels:['Sfondo','Pannelli','Schede','Input']},
      {label:t('tema_borders'),keys:['b'],labels:['Bordi']},
      {label:t('tema_text1'),keys:['t','t2','t3'],labels:['Primario','Secondario','Hint']},
      {label:t('tema_accent'),keys:['a','ok','warn','err'],labels:['Accento','Successo','Avviso','Errore']},
    ];
    return(
      <div>
        <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('tema_title')}</div>
        {/* Preset scuri */}
        <div style={{color:C.t3,fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:6}}>{t('tema_dark')}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:'1rem'}}>
          {TEMA_PRESETS.filter(p=>p.dark).map(p=>{
            const active=!isCustom&&tema.preset===p.id;
            return(
              <button key={p.id} onClick={()=>setPreset(p.id)}
                style={{background:p.s1,border:`2px solid ${active?p.a:p.b}`,borderRadius:8,padding:'0.6rem 0.75rem',cursor:'pointer',textAlign:'left',transition:'border-color .15s'}}>
                <div style={{display:'flex',gap:5,marginBottom:5}}>
                  {[p.bg,p.a,p.ok,p.err].map((c,i)=><span key={i} style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:c,border:`1px solid ${p.b}`}}/>)}
                </div>
                <div style={{color:p.t,fontSize:'0.78rem',fontWeight:active?600:400}}>{p.nome}</div>
                {active&&<div style={{color:p.a,fontSize:'0.62rem',marginTop:2}}>✓ attivo</div>}
              </button>
            );
          })}
        </div>
        {/* Preset chiari */}
        <div style={{color:C.t3,fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:6}}>{t('tema_light')}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:'1.25rem'}}>
          {TEMA_PRESETS.filter(p=>!p.dark).map(p=>{
            const active=!isCustom&&tema.preset===p.id;
            return(
              <button key={p.id} onClick={()=>setPreset(p.id)}
                style={{background:p.s1,border:`2px solid ${active?p.a:p.b}`,borderRadius:8,padding:'0.6rem 0.75rem',cursor:'pointer',textAlign:'left',transition:'border-color .15s'}}>
                <div style={{display:'flex',gap:5,marginBottom:5}}>
                  {[p.bg,p.a,p.ok,p.err].map((c,i)=><span key={i} style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:c,border:`1px solid ${p.b}`}}/>)}
                </div>
                <div style={{color:p.t,fontSize:'0.78rem',fontWeight:active?600:400}}>{p.nome}</div>
                {active&&<div style={{color:p.a,fontSize:'0.62rem',marginTop:2}}>✓ attivo</div>}
              </button>
            );
          })}
        </div>
        {/* Personalizzato */}
        <div style={{background:C.s2,borderRadius:8,padding:'0.875rem',border:`1px solid ${isCustom?C.a:C.b}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={{color:C.t,fontSize:'0.88rem',fontWeight:500}}>{t('tema_custom')}</div>
            {isCustom&&<button onClick={()=>setPreset(activePreset.id)}
              style={{background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',textDecoration:'underline'}}>
              {t('tema_reset')}
            </button>}
          </div>
          <div style={{color:C.t3,fontSize:'0.72rem',marginBottom:10}}>{t('tema_custom_hint')}</div>
          {SLOTS_GROUPS.map(group=>(
            <div key={group.label} style={{marginBottom:10}}>
              <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:4}}>{group.label}</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {group.keys.map((slot,si)=>{
                  const curVal=isCustom?(customColors[slot]||activePreset[slot]):activePreset[slot];
                  return(
                    <div key={slot} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                      <input type="color" value={curVal}
                        onChange={e=>setCustomSlot(slot,e.target.value)}
                        style={{width:36,height:28,borderRadius:4,cursor:'pointer',border:`1px solid ${C.b}`,padding:2,background:'none'}}
                        title={group.labels[si]}/>
                      <span style={{color:C.t3,fontSize:'0.6rem'}}>{group.labels[si]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if(settingsSub==='io'){
    const mem=calcMemUsage();
    const memClr=mem.pct>80?C.err:mem.pct>60?C.warn:C.ok;
    const doReset=()=>{
      setMats([]);setPrints([]);setQuotes([]);setClients([]);
      setUsedNums([]);setRcptNums([]);
      setSettings(DS());
      setReport(null);
      /* scolleghiamo il file di sessione — l'utente dovrà crearne uno nuovo */
      window.dispatchEvent(new CustomEvent('p3d_reset_session'));
      setResetStep(0);
    };
    return(<div>
    <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('sub_io')}</div>

    {/* ── Memory monitor ── */}
    <div style={{background:C.s2,border:`1px solid ${mem.warning?C.errBr:C.b}`,borderRadius:8,padding:'0.875rem',marginBottom:'1rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div style={{color:C.t,fontSize:'0.85rem',fontWeight:500}}>{t('mem_title')}</div>
        <span style={{color:memClr,fontWeight:700,fontSize:'0.85rem'}}>{mem.pct}%</span>
      </div>
      <div style={{height:8,background:C.s3,borderRadius:4,overflow:'hidden',marginBottom:8}}>
        <div style={{height:'100%',width:`${mem.pct}%`,background:memClr,borderRadius:4,transition:'width 0.4s'}}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:mem.warning?8:0}}>
        {[['mem_used_label',`${mem.usedMB} MB`,memClr],['mem_free_label',`${(mem.limitMB-mem.usedMB).toFixed(2)} MB`,C.ok],['mem_limit_label',`${mem.limitMB} MB`,C.t3]].map(([lKey,v,cl])=>(
          <div key={lKey} style={{background:C.s3,borderRadius:5,padding:'0.35rem 0.5rem',textAlign:'center'}}>
            <div style={{color:cl,fontWeight:600,fontSize:'0.85rem'}}>{v}</div>
            <div style={{color:C.t3,fontSize:'0.67rem',marginTop:1}}>{t(lKey)}</div>
          </div>
        ))}
      </div>
      {mem.warning&&<div style={{color:C.err,fontSize:'0.78rem',background:C.errBg,borderRadius:5,padding:'0.35rem 0.625rem'}}>{t('mem_warn')}</div>}
      {!mem.warning&&<div style={{color:C.t3,fontSize:'0.75rem'}}>{t('mem_ok')} · {mem.usedKB} KB {t('mem_used_note')}</div>}
    </div>

    {/* ── Session file (FSA) ── */}
    {FSA_SUPPORTED && <div style={{background:C.s2, border:`1px solid ${C.b}`, borderRadius:8, padding:'0.875rem', marginBottom:'1rem'}}>
      <div style={{color:C.t, fontSize:'0.85rem', fontWeight:500, marginBottom:6}}>{t('sess_link')}</div>
      <div style={{color:C.t3, fontSize:'0.75rem', marginBottom:10, lineHeight:1.5}}>
        {t('sess_link_hint')}
      </div>
      <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
        <button onClick={()=>window.dispatchEvent(new CustomEvent('p3d_open_file'))} style={{background:C.a2, border:`1px solid ${C.a3}`, color:C.a, borderRadius:6, padding:'0.4rem 0.875rem', cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem', fontWeight:500, display:'inline-flex', alignItems:'center', gap:6}}>
          <Upload size={13}/>{t('sess_pick_open')}
        </button>
        <button onClick={()=>window.dispatchEvent(new CustomEvent('p3d_pick_file'))} style={{background:'transparent', border:`1px solid ${C.b}`, color:C.t2, borderRadius:6, padding:'0.4rem 0.875rem', cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem', fontWeight:400, display:'inline-flex', alignItems:'center', gap:6}}>
          <Plus size={13}/>{t('sess_pick_new')}
        </button>
        <span style={{color:C.t3, fontSize:'0.78rem', display:'flex', alignItems:'center', gap:4, background:C.s1, padding:'4px 8px', borderRadius:5, border:`1px solid ${C.b}`}}>
          {sessionFileName ? (
            <><span style={{color:C.ok}}>●</span><span style={{color:C.t2, fontWeight:600, fontFamily:'monospace'}}>{sessionFileName}</span></>
          ) : (
            <><span style={{color:C.t3}}>○</span>{t('sess_not_linked')}</>
          )}
        </span>
      </div>
      <div style={{color:C.t3, fontSize:'0.72rem', marginTop:8}}>{t('sess_auto')}</div>
    </div>}

    {/* ── Gruppo 1: Backup completo applicazione ── */}
    <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.875rem',marginBottom:8}}>
      <div style={{color:C.t2,fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8,display:'flex',alignItems:'center',gap:5}}>
        <Download size={11} color={C.ok}/>{t('set_grp_backup')}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
        <button onClick={exportAll}
          style={{background:C.okBg,border:`1px solid ${C.okBr}`,borderRadius:7,padding:'0.6rem 0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}><Download size={12} color={C.ok}/><span style={{color:C.t,fontWeight:500,fontSize:'0.82rem'}}>{t('set_exp_all')}</span></div>
          <div style={{color:C.t3,fontSize:'0.68rem'}}>{t('set_exp_all_d')}</div>
        </button>
        <button onClick={()=>importAllRef.current.click()}
          style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:7,padding:'0.6rem 0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}><Upload size={12} color={C.warn}/><span style={{color:C.t,fontWeight:500,fontSize:'0.82rem'}}>{t('set_imp_all')}</span></div>
          <div style={{color:C.t3,fontSize:'0.68rem'}}>{t('set_imp_all_d')}</div>
        </button>
      </div>
    </div>

    {/* ── Gruppo 2: Stock Completo (materiali + bobine) JSON ── */}
    <div style={{background:C.s2,border:`1px solid ${C.blueBr}`,borderRadius:8,padding:'0.875rem',marginBottom:8}}>
      <div style={{color:C.blue,fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4,display:'flex',alignItems:'center',gap:5}}>
        <Archive size={11}/>{t('set_grp_json')}
      </div>
      <div style={{color:C.t3,fontSize:'0.68rem',marginBottom:8,lineHeight:1.4}}>{t('set_grp_json_d')}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
        <button onClick={exportStock}
          style={{background:C.blueBg,border:`1px solid ${C.blueBr}`,borderRadius:7,padding:'0.6rem 0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}><Download size={12} color={C.blue}/><span style={{color:C.t,fontWeight:500,fontSize:'0.82rem'}}>{t('set_exp_stock')}</span></div>
          <div style={{color:C.t3,fontSize:'0.68rem'}}>{t('set_exp_stock_d')}</div>
        </button>
        <button onClick={()=>importMatRef.current.click()}
          style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:7,padding:'0.6rem 0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}><Upload size={12} color={C.warn}/><span style={{color:C.t,fontWeight:500,fontSize:'0.82rem'}}>{t('set_imp_stock')}</span></div>
          <div style={{color:C.t3,fontSize:'0.68rem'}}>{t('set_imp_stock_d')}</div>
        </button>
      </div>
    </div>

    {/* ── Gruppo 3: CSV Materiali + Bobine ── */}
    <div style={{background:C.s2,border:`1px solid ${C.tealBr}`,borderRadius:8,padding:'0.875rem',marginBottom:8}}>
      <div style={{color:C.teal,fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4,display:'flex',alignItems:'center',gap:5}}>
        <Archive size={11}/>{t('set_grp_csv')}
      </div>
      <div style={{color:C.t3,fontSize:'0.68rem',marginBottom:8,lineHeight:1.4}}>{t('csv_dual_hint')}</div>
      {/* Riga 1: Esporta CSV materiali+bobine + Importa CSV dual — stessa larghezza */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:6}}>
        <button onClick={exportMatCsvDual}
          style={{background:C.tealBg,border:`1px solid ${C.tealBr}`,borderRadius:7,padding:'0.6rem 0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}><Download size={12} color={C.teal}/><span style={{color:C.t,fontWeight:500,fontSize:'0.82rem'}}>{t('set_exp_csv_dual')}</span></div>
          <div style={{color:C.t3,fontSize:'0.68rem'}}>{t('set_exp_csv_dual_d')}</div>
        </button>
        <button onClick={()=>importCsvDualRef.current.click()}
          style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,borderRadius:7,padding:'0.6rem 0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}><Upload size={12} color={C.warn}/><span style={{color:C.t,fontWeight:500,fontSize:'0.82rem'}}>{t('set_imp_csv_dual')}</span></div>
          <div style={{color:C.t3,fontSize:'0.68rem'}}>{t('set_imp_csv_dual_d')}</div>
        </button>
      </div>
      {/* Riga 2: Esporta solo materiali CSV + Importa solo materiali CSV — stessa larghezza */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
        <button onClick={exportMatCsv}
          style={{background:'transparent',border:`1px solid ${C.b}`,borderRadius:6,padding:'0.35rem 0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:5,color:C.t3,fontSize:'0.72rem'}}>
          <Download size={11}/>{t('set_exp_csv_mat')}
        </button>
        <button onClick={()=>importCsvMatRef.current.click()}
          style={{background:'transparent',border:`1px solid ${C.b}`,borderRadius:6,padding:'0.35rem 0.75rem',textAlign:'left',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:5,color:C.t3,fontSize:'0.72rem'}}>
          <Upload size={11}/>{t('set_imp_csv_mat')}
        </button>
      </div>
    </div>

    {/* ── Reset completo ── */}
    <div style={{background:C.errBg,border:`1px solid ${C.errBr}`,borderRadius:8,padding:'0.875rem',marginTop:'1rem'}}>
      <div style={{color:C.err,fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
        <Trash2 size={11}/>{t('set_reset_title')}
      </div>
      <div style={{color:C.t3,fontSize:'0.72rem',lineHeight:1.5,marginBottom:10}}>{t('set_reset_desc')}</div>
      {resetStep===0&&(
        <button onClick={()=>setResetStep(1)}
          style={{background:'transparent',border:`1px solid ${C.errBr}`,color:C.err,borderRadius:6,padding:'0.4rem 0.875rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.82rem',fontWeight:500,display:'inline-flex',alignItems:'center',gap:6}}>
          <Trash2 size={13}/>{t('set_reset_btn')}
        </button>
      )}
      {resetStep===1&&(
        <div style={{background:C.errBg,borderRadius:6,padding:'0.625rem',border:`1px solid ${C.errBr}`}}>
          <div style={{color:C.err,fontSize:'0.8rem',fontWeight:500,marginBottom:8}}>⚠ {t('set_reset_confirm1')}</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setResetStep(2)}
              style={{background:C.err,color:'#fff',border:'none',borderRadius:6,padding:'0.35rem 0.875rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.82rem',fontWeight:600}}>
              {t('set_reset_confirm2').split(':')[0]}
            </button>
            <button onClick={()=>setResetStep(0)}
              style={{background:'transparent',border:`1px solid ${C.b}`,color:C.t2,borderRadius:6,padding:'0.35rem 0.75rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.82rem'}}>
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
      {resetStep===2&&(
        <div style={{background:C.errBg,borderRadius:6,padding:'0.625rem',border:`2px solid ${C.err}`}}>
          <div style={{color:C.err,fontSize:'0.82rem',fontWeight:700,marginBottom:8}}>🔴 {t('set_reset_confirm2')}</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={doReset}
              style={{background:C.err,color:'#fff',border:'none',borderRadius:6,padding:'0.4rem 1rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.85rem',fontWeight:700}}>
              ✓ {t('set_reset_btn')}
            </button>
            <button onClick={()=>setResetStep(0)}
              style={{background:'transparent',border:`1px solid ${C.b}`,color:C.t2,borderRadius:6,padding:'0.35rem 0.75rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.82rem'}}>
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>

    <input ref={importAllRef} type="file" accept=".json" onChange={importAll} style={{display:'none'}}/>
    <input ref={importMatRef} type="file" accept=".json" onChange={importMats} style={{display:'none'}}/>
    <input ref={importCsvMatRef} type="file" accept=".csv,text/csv" onChange={importMatsCsv} style={{display:'none'}}/>
    <input ref={importCsvDualRef} type="file" accept=".csv,text/csv" multiple onChange={importDualCsv} style={{display:'none'}}/>

    <div style={{background:C.s2,borderRadius:8,padding:'0.75rem 1rem',fontSize:'0.75rem',color:C.t3,marginTop:'1rem'}}><strong style={{color:C.t2}}>Print3D Manager {APP_VERSION}</strong> (formato dati v{DATA_VERSION}) · {t('set_footer')}</div>
  </div>);}

  if(settingsSub==='stampanti') return(<div>
    <div style={{color:C.t,fontSize:'1.1rem',fontWeight:500,marginBottom:'1rem'}}>{t('nav_pr')}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(275px,1fr))',gap:10}}>
      {printers.map(p=>{
        const nome=prNome(p);
        return(<div key={p.id} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'1rem',display:'flex',flexDirection:'column',gap:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              {(p.marca||p.modello)?(<>
                <div style={{color:C.t3,fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>{p.marca}</div>
                <div style={{color:C.t,fontWeight:600,fontSize:'1rem'}}>{p.modello||nome}</div>
              </>):(
                <div style={{color:C.t,fontWeight:600,fontSize:'0.95rem'}}>{nome}</div>
              )}
            </div>
            <div style={{display:'flex',gap:4}}>
              <Btn onClick={()=>setModal({type:'printer',data:p})} sm><Edit2 size={12}/></Btn>
              <Btn onClick={()=>setConfirm({type:'printer',id:p.id,nome})} sm variant="dan"><Trash2 size={12}/></Btn>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div style={{background:C.s3,borderRadius:6,padding:'0.5rem 0.75rem'}}>
              <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase'}}>{t('pr_consumption')}</div>
              <div style={{color:C.blue,fontWeight:600,fontSize:'1.05rem',marginTop:1}}>{p.e_kwh} kW</div>
            </div>
            <div style={{background:C.s3,borderRadius:6,padding:'0.5rem 0.75rem'}}>
              <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase'}}>{t('pr_amort')}</div>
              <div style={{color:C.warn,fontWeight:600,fontSize:'1.05rem',marginTop:1}}>{fmtV(p.a_h)}/h</div>
            </div>
          </div>
          <div style={{padding:'0.5rem 0.75rem',background:C.s3,borderRadius:6}}>
            <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',marginBottom:2}}>{t('pr_hourly')}</div>
            <div style={{color:C.a,fontWeight:500,fontSize:'0.9rem'}}>{fmtV(p.e_kwh*settings.c_kwh+p.a_h)}/h</div>
          </div>
          {p.note&&<div style={{color:C.t3,fontSize:'0.72rem',borderTop:`1px solid ${C.b}`,paddingTop:6}}>{p.note}</div>}
        </div>);
      })}
      {printers.length===0&&<div style={{color:C.t3,gridColumn:'1/-1',padding:'2rem',textAlign:'center'}}>
        {t('pr_none')}<br/><br/><Btn onClick={()=>setModal({type:'printer',data:null})} variant="pri">{t('add')}</Btn>
      </div>}
    </div>
    <div style={{marginTop:'1rem'}}>
      <Btn onClick={()=>setModal({type:'printer',data:null})} variant="pri"><Plus size={13}/>{t('add')}</Btn>
    </div>
  </div>);

  if(settingsSub==='about') return(<div style={{maxWidth:560,margin:'0 auto'}}>
    {/* ── Header ── */}
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'1.5rem 1rem 1rem',textAlign:'center'}}>
      <img src={SMF_LOGO} alt="SimonMakerForge" style={{width:100,height:100,borderRadius:'50%',background:'#111',padding:10,marginBottom:'0.875rem',objectFit:'contain'}}/>
      <div style={{color:C.t,fontSize:'1.5rem',fontWeight:700,letterSpacing:'0.02em',lineHeight:1.1}}>SimonMakerForge</div>
      <div style={{color:C.t3,fontSize:'0.78rem',fontWeight:400,marginTop:4}}>by Simone Soldani</div>
    </div>

    {/* ── Descrizione ── */}
    {/* ── Bio ── */}
    <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.875rem 1rem',marginBottom:'1rem'}}>
      <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.6rem'}}>
        {lang==='it'?'Chi sono':'About me'}
      </div>
      {(lang==='it'?[
        "Sono un ingegnere elettronico italiano con una profonda passione per la tecnologia, i computer e i progetti DIY.",
        "Mi piace creare cose nuove, migliorare quelle esistenti e dare nuova vita a parti vecchie o di scarto.",
        "Recentemente ho scoperto il mondo della stampa 3D e ho iniziato a lavorare con una BambuLab P1S con AMS. Di recente ho aggiunto la stampante laser H2C alla mia attrezzatura.",
        "Progettare, prototipare e vedere le mie idee prendere vita mi entusiasma, e spero che i miei progetti possano ispirare, aiutare o portare divertimento e utilità agli altri.",
        "Oltre alla mia famiglia, mia moglie Sabrina e i miei figli Leonardo e Alessio ho una gatta \"Piuma\" e avevo una barboncina \"Edy\" che ci ha recentemente lasciato dopo 15 anni.",
      ]:[
        "I am an Italian electronics engineer with a deep passion for technology, computers and DIY projects.",
        "I enjoy creating new things, improving existing ones and giving new life to old or discarded parts.",
        "I recently discovered the world of 3D printing and started working with a BambuLab P1S with AMS. I have also recently added an H2C to my setup.",
        "Designing, prototyping and seeing my ideas come to life is what drives me, and I hope my projects can inspire, help or bring joy and usefulness to others.",
        "Besides my family — my wife Sabrina and my sons Leonardo and Alessio — I have a cat \"Piuma\", and I had a poodle \"Edy\" who recently left us after 15 wonderful years.",
      ]).map((para,i)=>(
        <p key={i} style={{color:C.t2,fontSize:'0.82rem',lineHeight:1.7,margin:'0 0 0.5rem 0'}}>{para}</p>
      ))}
    </div>

    {/* ── Il Progetto ── */}
    <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:8,padding:'0.875rem 1rem',marginBottom:'1rem'}}>
      <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.6rem'}}>
        {lang==='it'?'Il progetto':'The project'}
      </div>
      <p style={{color:C.t2,fontSize:'0.82rem',lineHeight:1.7,margin:0}}>
        {lang==='it'
          ?"Print3D Manager nasce dall'esperienza diretta nella gestione di una piccola attività di stampa 3D. Un tool pratico, pensato da un maker per i makers: materiali, stampanti, preventivi e analisi in un unico posto. Completamente gratuito, senza pubblicità, senza raccolta dati."
          :"Print3D Manager was born from direct experience managing a small 3D printing business. A practical tool, made by a maker for makers: materials, printers, quotes and analytics all in one place. Completely free, no ads, no data collection."}
      </p>
    </div>

    {/* ── Donazioni ── */}
    <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:8,padding:'1rem',marginBottom:'1rem'}}>
      <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.06em',textAlign:'center',marginBottom:'0.75rem'}}>
        {lang==='it'?'Supporta il progetto · 100% facoltativo':'Support the project · 100% optional'}
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
        <button onClick={()=>window.open('https://buymeacoffee.com/simonmakerforge','_blank')}
          style={{display:'flex',alignItems:'center',gap:8,background:'#FFDD00',border:'none',borderRadius:8,padding:'0.55rem 1.25rem',cursor:'pointer',fontWeight:700,fontSize:'0.88rem',color:'#000',fontFamily:'inherit',boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>
          ☕ Buy Me a Coffee
        </button>
        <button onClick={()=>window.open('https://paypal.me/SimoneSoldani?locale.x=it_IT&country.x=IT','_blank')}
          style={{display:'flex',alignItems:'center',gap:8,background:'#003087',border:'none',borderRadius:8,padding:'0.55rem 1.25rem',cursor:'pointer',fontWeight:700,fontSize:'0.88rem',color:'#fff',fontFamily:'inherit',boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>
          💙 PayPal
        </button>
      </div>
      <div style={{color:C.t3,fontSize:'0.68rem',textAlign:'center',marginTop:'0.625rem'}}>
        {lang==='it'?'Grazie per usare Print3D Manager! 🙏':'Thank you for using Print3D Manager! 🙏'}
      </div>
    </div>

    {/* ── Social ── */}
    <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:8,padding:'1rem',marginBottom:'1rem'}}>
      <div style={{color:C.t3,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.06em',textAlign:'center',marginBottom:'0.75rem'}}>
        {lang==='it'?'Seguimi sui social':'Follow me'}
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
        {[
          {label:'MakerWorld',url:'https://makerworld.com/@SimonMakerForge',bg:'#1a1a2e',clr:'#e0e0ff'},
          {label:'YouTube',url:'https://www.youtube.com/@smf19739',bg:'#FF0000',clr:'#fff'},
          {label:'Facebook',url:'https://www.facebook.com/share/16yKQw3T54/',bg:'#1877F2',clr:'#fff'},
          {label:'Instagram',url:'https://www.instagram.com/simonmakerforge?igsh=MWRldTh0bGlmY2EzeQ==',bg:'#E1306C',clr:'#fff'},
          {label:'Pinterest',url:'https://it.pinterest.com/simonmakerforge/',bg:'#E60023',clr:'#fff'},
        ].map(({label,url,bg,clr})=>(
          <button key={label} onClick={()=>window.open(url,'_blank')}
            style={{background:bg,border:'none',borderRadius:6,padding:'0.4rem 0.875rem',cursor:'pointer',color:clr,fontWeight:600,fontSize:'0.8rem',fontFamily:'inherit',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}>
            {label}
          </button>
        ))}
      </div>
    </div>

    {/* ── Footer ── */}
    <div style={{textAlign:'center',color:C.t3,fontSize:'0.67rem',lineHeight:1.8,paddingBottom:'0.5rem'}}>
      <div>Print3D Manager {APP_VERSION} · Software gratuito</div>
      <div>{lang==='it'?"Fornito \"così com'è\", senza garanzie di alcun tipo.":'Provided "as is", without warranties of any kind.'}</div>
    </div>
  </div>);

  return null;
}

function SettingsView(props){
  const {t}=useT();
  const fmtV=useFmt();
  const {settingsSub,setModal,setConfirm}=props;
  const [report,setReport]=useState(null);
  return(<div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
      <div style={{color:C.t,fontSize:'1.25rem',fontWeight:500}}>{t('nav_set')}</div>
      <span style={{color:C.t3,fontSize:'0.78rem',background:C.s2,padding:'3px 10px',borderRadius:5}}>{APP_VERSION}</span>
    </div>
    {report&&(
      <div style={{background:report.type==='ok'?C.okBg:report.type==='warn'?C.warnBg:C.errBg,border:`1px solid ${report.type==='ok'?C.okBr:report.type==='warn'?C.warnBr:C.errBr}`,borderRadius:8,padding:'1rem',marginBottom:'1rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <div style={{color:report.type==='ok'?C.ok:report.type==='warn'?C.warn:C.err,fontWeight:600,fontSize:'0.875rem'}}>{report.title}</div>
          <button onClick={()=>setReport(null)} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',padding:2,display:'flex'}}><X size={14}/></button>
        </div>
        {report.notes.map((n,i)=>(<div key={i} style={{color:C.t2,fontSize:'0.8rem',lineHeight:1.6,paddingLeft:8,borderLeft:`2px solid ${report.type==='ok'?C.okBr:report.type==='warn'?C.warnBr:C.errBr}`,marginBottom:4}}>{n}</div>))}
      </div>
    )}
    <SettingsPanel {...props} setReport={setReport}/>
  </div>);
}

/* ══ QUICK CALCULATOR COMPONENT (FIXED) ══ */
function QuickCalc({ mats, printers, settings, onClose }) {
  const {t}=useT();
  const fmtV=useFmt();
  const [pId, setPId] = useState(printers[0]?.id || '');
  const [selectedMats, setSelectedMats] = useState([{ mat_id: mats[0]?.id || '', peso_g: 0 }]);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [markup, setMarkup] = useState(settings.markup_globale || 30);

  const pr = printers.find(p => p.id === pId);
  const timeH = (Number(hours) || 0) + ((Number(mins) || 0) / 60);

  const totalMatCost = selectedMats.reduce((acc, item) => {
    const m = mats.find(x => x.id === item.mat_id);
    if (!m) return acc;
    const prezzoGrammo = Number(m.prezzo) / 1000;
    const peso = Number(item.peso_g) || 0;
    const markupMat = 1 + (Number(m.markup || 0) / 100);
    const failMult = 1 + (Number(m.fallimento_pct || 0) / 100);
    return acc + (prezzoGrammo * peso * markupMat * failMult);
  }, 0);

  const energyCost = timeH * (Number(pr?.e_kwh) || 0) * Number(settings.c_kwh || 0);
  const amortCost  = timeH * (Number(pr?.a_h) || 0);
  const totalProd  = totalMatCost + energyCost + amortCost;
  const suggestedSale = totalProd * (1 + (Number(markup) / 100));

  /* Adatta la firma onChange di MatRow: (index, key, value) */
  const handleChange = (i, key, val) => {
    setSelectedMats(prev => prev.map((item, j) => j === i ? { ...item, [key]: val } : item));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <F label={t('print_printer')}>
          <Sel v={pId} set={setPId}>{printers.map(p => <option key={p.id} value={p.id}>{prNome(p)}</option>)}</Sel>
        </F>
        <F label={t('q_markup_base')}>
          <Inp type="number" v={markup} set={setMarkup} min={0}/>
        </F>
      </div>

      <div style={{ borderTop: `1px solid ${C.b}`, paddingTop: '0.5rem' }}>
        <div style={{ color: C.t2, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: 8 }}>{t('print_form_materials')}</div>
        {selectedMats.map((row, i) => (
          <MatRow
            key={i}
            row={row}
            index={i}
            mats={mats}
            onChange={handleChange}
            onRemove={idx => setSelectedMats(prev => prev.filter((_, j) => j !== idx))}
            canRemove={selectedMats.length > 1}
            committedMap={{}}
            inFormUsageMap={{}}
            disabled={false}
          />
        ))}
        <button onClick={() => setSelectedMats(prev => [...prev, { mat_id: mats[0]?.id || '', peso_g: 0 }])}
          style={{background:'none',border:`1px dashed ${C.b}`,color:C.t3,borderRadius:5,padding:'0.2rem 0.6rem',cursor:'pointer',fontSize:'0.75rem',display:'flex',alignItems:'center',gap:3,fontFamily:'inherit',marginTop:4}}>
          <Plus size={11}/>{t('print_form_add_mat')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <F label={t('print_hours')}><Inp type="number" v={hours} set={setHours} min={0}/></F>
        <F label={t('print_min')}><Inp type="number" v={mins} set={setMins} min={0} max={59}/></F>
      </div>

      <div style={{ background: C.s2, borderRadius: 10, padding: '1rem', border: `1px solid ${C.b}` }}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,marginBottom:8}}>
          {[[t('cb_mat'),totalMatCost,C.teal],[t('cb_energy'),energyCost,C.blue],[t('cb_amort'),amortCost,C.purple]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div style={{color:C.t3,fontSize:'0.6rem',textTransform:'uppercase',marginBottom:1}}>{l}</div>
              <div style={{color:c,fontSize:'0.8rem',fontWeight:600}}>{fmtV(v)}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:'0.85rem',marginBottom:5,borderTop:`1px solid ${C.b}`,paddingTop:8 }}>
          <span style={{ color: C.t3 }}>{t('print_form_total_prod')}:</span>
          <span style={{ fontWeight: 600 }}>{fmtV(totalProd)}</span>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',borderTop:`1px solid ${C.b}`,paddingTop:10,marginTop:5 }}>
          <span style={{ fontWeight: 700, color: C.a }}>{t('quick_calc_sale')}:</span>
          <span style={{ fontWeight: 700, color: C.a, fontSize: '1.2rem' }}>{fmtV(suggestedSale)}</span>
        </div>
      </div>
      <Btn onClick={onClose} full variant="pri">{t('close')}</Btn>
    </div>
  );
}

export default function App(){
  const [mats,setMats]         =useState(()=>LS.get('m',DM));
  const [prints,setPrints]     =useState(()=>LS.get('p',[]));
  const [quotes,setQuotes]     =useState(()=>LS.get('q',[]));
  const [printers,setPrinters] =useState(()=>LS.get('pr',DP));
  const [clients,setClients]   =useState(()=>LS.get('cl',[]));
  const [usedNums,setUsedNums] =useState(()=>LS.get('un',[]));
  const [rcptNums,setRcptNums] =useState(()=>LS.get('rcn',{}));
  const [showQuickCalc, setShowQuickCalc] = useState(false);
  const [settings,setSettings] =useState(()=>{
    const s=LS.get('s',DS);const logo=LS.get('logo',null);
    let ncMap=s.nomi_colore_map||(s.nomi_colore||BASE_NOMI_COLORE).map(n=>{const p=COLOR_BILINGUAL.find(c=>c.it.toLowerCase()===n.toLowerCase()||c.en.toLowerCase()===n.toLowerCase());return p||{it:n,en:n};});
    /* Aggiungi nuovi colori base non presenti */
    BASE_NOMI_COLORE_MAP.forEach(base=>{if(!ncMap.find(c=>c.en.toLowerCase()===base.en.toLowerCase()))ncMap.push(base);});
    /* Ordine alfabetico IT */
    ncMap=[...ncMap].sort((a,b)=>a.it.localeCompare(b.it,'it'));
    return{...DS,...s,logo,tipi:s.tipi||DS.tipi,materiali:normalizeMateriali(s.materiali||DS.materiali),tipi_mat:normalizeTipiMat(s.tipi_mat||DS.tipi_mat),nomi_colore_map:ncMap,nomi_colore:ncMap.map(c=>c.en),servizi_extra:s.servizi_extra||DS.servizi_extra,corrieri:s.corrieri||DS.corrieri,metodi_pagamento:s.metodi_pagamento||DS.metodi_pagamento};
  });
  const [lang,setLang]=useState(()=>LS.get('lang','it'));
  const t=mkT(lang);
  useEffect(()=>{LS.set('lang',lang);},[lang]);
  /* ── Applica tema a C ad ogni render ── */
  const _activeBase=getActiveBase(settings.tema);
  Object.assign(C,computeC(_activeBase));
  /* ── Aggiorna mappa colori utente per translateColor ── */
  _userColorMap=settings.nomi_colore_map||[];
  useEffect(()=>{document.body.style.background=C.bg;document.documentElement.style.background=C.bg;},[settings.tema]);
  const [tab,setTab]=useState('dashboard');
  const [settingsSub,setSettingsSub]=useState('azienda');
  const [modal,setModal]=useState(null);
  const [confirm,setConfirm]=useState(null);
  const [srch,setSrch]=useState('');

  /* ── Session & Memory state ── */
  const [saveStatus,setSaveStatus]=useState('idle'); // idle|saving|saved|error
  const [lastSaved,setLastSaved]=useState(null);
  const [fileHandle,setFileHandle]=useState(null);
  const [sessionFileName,setSessionFileName]=useState(()=>LS.get('sess_file_name',null));
  const [memUsage,setMemUsage]=useState(()=>calcMemUsage());
  const [closeState,setCloseState]=useState(null); // null|'saving'|'done'
  const fileHandleRef=useRef(null);
  const dataRef=useRef(null);

  /* Quando il nome file cambia, lo persisto in localStorage e aggiorno window */
  useEffect(()=>{
    if(sessionFileName){LS.set('sess_file_name',sessionFileName);window.__p3dFileName=sessionFileName;}
    else{LS.del('sess_file_name');window.__p3dFileName=null;}
  },[sessionFileName]);

  useEffect(()=>{LS.set('m',mats);},[mats]);
  useEffect(()=>{LS.set('p',prints);},[prints]);
  useEffect(()=>{LS.set('q',quotes);},[quotes]);
  useEffect(()=>{LS.set('pr',printers);},[printers]);
  useEffect(()=>{LS.set('cl',clients);},[clients]);
  useEffect(()=>{LS.set('un',usedNums);},[usedNums]);
  useEffect(()=>{LS.set('rcn',rcptNums);},[rcptNums]);
  useEffect(()=>{const{logo,...rest}=settings;LS.set('s',rest);if(logo)LS.set('logo',logo);else LS.del('logo');},[settings]);

  /* keep dataRef always current for use in callbacks/intervals */
  useEffect(()=>{
    dataRef.current=buildSessionData(mats,prints,quotes,printers,settings,usedNums,clients,rcptNums);
    setMemUsage(calcMemUsage());
  },[mats,prints,quotes,printers,settings,usedNums,clients]);

  /* keep fileHandleRef in sync */
  useEffect(()=>{fileHandleRef.current=fileHandle;},[fileHandle]);

  /* restore file handle from IndexedDB on mount — il nome viene da localStorage (sessionFileName state) */
  useEffect(()=>{
    if(FSA_SUPPORTED)idbGetHandle().then(h=>{
      if(h){
        setFileHandle(h);
        /* Prova a leggere il nome dal file stesso per conferma, fallback a quello in LS */
        h.getFile().then(f=>{
          if(f.name&&f.name!==sessionFileName)setSessionFileName(f.name);
        }).catch(()=>{});
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  /* expose fileHandle status globally (usato solo da codice legacy) */
  useEffect(()=>{window.__p3dFileLinked=!!fileHandle;},[fileHandle]);

  /* core save function */
  const doSave=useCallback(async(showStatus=true)=>{
    const data=dataRef.current;if(!data)return false;
    if(showStatus)setSaveStatus('saving');
    let ok=false;
    const h=fileHandleRef.current;
    if(FSA_SUPPORTED&&h){
      ok=await writeToHandle(h,data);
    }
    if(!ok){
      const fn=`p3d-sessione-${new Date().toISOString().slice(0,10)}.json`;
      dlSession(data,fn);ok=true;
    }
    if(ok){setLastSaved(new Date());if(showStatus){setSaveStatus('saved');setTimeout(()=>setSaveStatus('idle'),3000);}}
    else{if(showStatus){setSaveStatus('error');setTimeout(()=>setSaveStatus('idle'),3000);}}
    return ok;
  },[]);

  /* create NEW session file via FSA (showSaveFilePicker) */
  const pickSessionFile=useCallback(async()=>{
    if(!FSA_SUPPORTED)return;
    try{
      const h=await window.showSaveFilePicker({suggestedName:'p3d-sessione.json',types:[{description:'JSON',accept:{'application/json':['.json']}}]});
      setFileHandle(h);
      setSessionFileName(h.name);
      await idbSetHandle(h);
      await doSave(true);
    }catch(e){if(e.name!=='AbortError')console.error(e);}
  },[doSave]);

  /* link EXISTING session file via FSA (showOpenFilePicker — no overwrite prompt) */
  const linkExistingFile=useCallback(async()=>{
    if(!FSA_SUPPORTED)return;
    try{
      const [h]=await window.showOpenFilePicker({
        types:[{description:'JSON',accept:{'application/json':['.json']}}],
        excludeAcceptAllOption:true,
        multiple:false
      });
      /* request readwrite permission */
      const perm=await h.requestPermission({mode:'readwrite'});
      if(perm!=='granted'){
        alert('Permesso di scrittura negato. Il file non può essere usato per il salvataggio automatico.');
        return;
      }
      /* try to read existing data and offer to load */
      try{
        const file=await h.getFile();
        const text=await file.text();
        if(text.trim()){
          const raw=JSON.parse(text);
          if(raw&&(raw.mats||raw.prints||raw.quotes)){
            const savedDate=raw._saved?new Date(raw._saved).toLocaleString('it-IT'):'—';
            const load=window.confirm(
              `File trovato con dati salvati il: ${savedDate}\n\nVuoi caricare i dati da questo file?\n\n• OK     → Carica i dati (i dati correnti verranno sostituiti)\n• Annulla → Collega solo il file (i dati correnti restano, il file verrà aggiornato al prossimo salvataggio)`
            );
            if(load){
              const mg=migrateBackup(raw);
              setMats(mg.mats);
              setPrints(mg.prints);
              setQuotes(mg.quotes);
              setPrinters(mg.printers);
              setSettings(prev=>({...mg.settings,logo:mg.settings.logo||prev.logo}));
              setUsedNums(mg.usedNums||[]);
              if(mg.clients)setClients(mg.clients);
              if(mg.rcptNums)setRcptNums(mg.rcptNums);
            }
          }
        }
      }catch{}
      /* link the handle regardless */
      setFileHandle(h);
      setSessionFileName(h.name);
      await idbSetHandle(h);
      setSaveStatus('saved');
      setLastSaved(new Date());
      setTimeout(()=>setSaveStatus('idle'),3000);
    }catch(e){if(e.name!=='AbortError')console.error(e);}
  },[setMats,setPrints,setQuotes,setPrinters,setSettings,setUsedNums,setClients]);

  /* auto-save every 5 minutes */
  useEffect(()=>{
    const id=setInterval(()=>{if(fileHandleRef.current)doSave(true);},5*60*1000);
    return()=>clearInterval(id);
  },[doSave]);

  /* beforeunload: warn if FSA not linked (can't force download) */
  useEffect(()=>{
    const h=e=>{if(!fileHandleRef.current){e.preventDefault();e.returnValue='Dati non salvati su file. Esportare un backup prima di chiudere?';}};
    window.addEventListener('beforeunload',h);
    return()=>window.removeEventListener('beforeunload',h);
  },[]);

  /* close app handler */
  const handleCloseApp=useCallback(async()=>{
    setCloseState('saving');
    await doSave(false);
    setCloseState('done');
  },[doSave]);

  useEffect(()=>{
    const h=()=>{
      const d=window._importedData;
      if(!d)return;
      const{quotes:nq=[],prints:np=[],removedNums=[]}=d;
      delete window._importedData;
      if(nq.length>0){
        setQuotes(qs=>[...nq,...qs]);
        /* rimuovi i numeri ripristinati da usedNums e ri-aggiungi (pulizia) */
        setUsedNums(un=>[...un.filter(n=>!removedNums.includes(n)),...nq.map(q=>q.numero)]);
      }
      if(np.length>0){
        setPrints(ps=>[...np,...ps]);
      }
    };
    window.addEventListener('p3d_import_quotes',h);
    return()=>window.removeEventListener('p3d_import_quotes',h);
  },[]);

  /* FSA pick file trigger from Settings */
  useEffect(()=>{
    const h=()=>pickSessionFile();
    window.addEventListener('p3d_pick_file',h);
    return()=>window.removeEventListener('p3d_pick_file',h);
  },[pickSessionFile]);

  /* FSA open existing file trigger from Settings */
  useEffect(()=>{
    const h=()=>linkExistingFile();
    window.addEventListener('p3d_open_file',h);
    return()=>window.removeEventListener('p3d_open_file',h);
  },[linkExistingFile]);

  /* expose fileHandle status globally for Settings panel to read */
  useEffect(()=>{window.__p3dFileLinked=!!fileHandle;},[fileHandle]);

  /* reset session: scollega il file handle */
  useEffect(()=>{
    const h=()=>{setFileHandle(null);setSessionFileName('');};
    window.addEventListener('p3d_reset_session',h);
    return()=>window.removeEventListener('p3d_reset_session',h);
  },[]);

  const applyStock=useCallback((msList)=>{
    if(!msList||msList.length===0)return;
    /* tutto dentro il functional update — ms è sempre lo stato più recente */
    setMats(ms=>{
      /* raccoglie warning usando ms (sempre aggiornato) */
      const warnings=[];
      msList.forEach(({mat_id,peso_g})=>{
        const m=ms.find(x=>x.id===mat_id);
        if(m&&+peso_g>m.stock)warnings.push(`${m.nome}: richiesti ${peso_g}g, disponibili ${m.stock}g → azzerato`);
      });
      /* mostra alert solo se ci sono warning (non bloccante per lo stato) */
      if(warnings.length>0)setTimeout(()=>alert(`⚠ Stock insufficiente per:\n${warnings.map(w=>`• ${w}`).join('\n')}\nLo stock verrà azzerato.`),0);
      return ms.map(m=>{
        const used=msList.filter(x=>x.mat_id===m.id).reduce((s,x)=>s+(+x.peso_g||0),0);
        if(used<=0)return m;
        if((m.spools||[]).length>0){
          const{spools:newSpools}=deductFromSpools(m.spools,used);
          const newStock=calcStockFromSpools(newSpools);
          const newPrezzo=calcPrezzoMedio(newSpools,m.prezzo_manuale||m.prezzo);
          return{...m,spools:newSpools,stock:Math.max(0,newStock),prezzo:newPrezzo||m.prezzo};
        }
        return{...m,stock:Math.max(0,m.stock-used)};
      });
    });
  },[]);/* no deps: tutto usa ms fresco dal functional update */

  const applyWaste=useCallback((qtys)=>{
    setMats(ms=>ms.map(m=>{
      const used=(qtys||[]).filter(x=>x.mat_id===m.id).reduce((s,x)=>s+(+x.peso_g||0),0);
      if(used<=0)return m;
      if((m.spools||[]).length>0){
        const{spools:newSpools}=deductFromSpools(m.spools,used);
        const newStock=calcStockFromSpools(newSpools);
        const newPrezzo=calcPrezzoMedio(newSpools,m.prezzo_manuale||m.prezzo);
        return{...m,spools:newSpools,stock:Math.max(0,newStock),prezzo:newPrezzo||m.prezzo};
      }
      return{...m,stock:Math.max(0,m.stock-used)};
    }));
  },[]);
  const syncQStato = (qid, modelId, pStato) => {
    if(!qid) return;
    setQuotes(qlist => qlist.map(q => {
      if(q.id !== qid) return q;
      
      if (!q.modelli || !modelId) {
        const qs = pStato==='In corso'?'Confermato':pStato==='Completata'?'Completato':pStato==='In attesa'?'In attesa':q.stato;
        return {...q, stato: qs};
      }

      const updatedModelli = q.modelli.map(m => m.id === modelId ? { ...m, stato: pStato } : m);
      
      let qStato = 'In attesa';
      const nonAnnullati = updatedModelli.filter(m => m.stato !== 'Annullato');
      if (nonAnnullati.length > 0) {
        if (nonAnnullati.every(m => m.stato === 'Completata')) qStato = 'Completato';
        else if (nonAnnullati.some(m => m.stato === 'In corso')) qStato = 'Confermato';
        else if (nonAnnullati.some(m => m.stato === 'Fallita')) qStato = 'In attesa';
      } else if (updatedModelli.length > 0) {
        qStato = 'Annullato';
      }
      
      return { ...q, modelli: updatedModelli, stato: qStato };
    }));
  };

  const upsertMat=f=>{setMats(ms=>modal?.data?.id?ms.map(x=>x.id===modal.data.id?{...f,id:x.id}:x):[...ms,{...f,id:uid()}]);setModal(null);};
  const upsertPrinter=f=>{setPrinters(ps=>modal?.data?.id?ps.map(x=>x.id===modal.data.id?{...f,id:x.id}:x):[...ps,{...f,id:uid()}]);setModal(null);};
  const upsertClient=f=>{setClients(cs=>modal?.data?.id?cs.map(x=>x.id===modal.data.id?{...f,id:x.id}:x):[...cs,{...f,id:uid()}]);setModal(null);};
  const updateStock=(id,ns)=>{setMats(ms=>ms.map(m=>m.id===id?{...m,stock:ns}:m));setModal(null);};
  const updateSpools=updatedMat=>{setMats(ms=>ms.map(m=>m.id===updatedMat.id?updatedMat:m));setModal(null);};
  const addPrint=f=>{
    let pr={...f,id:uid(),stock_deducted:false,waste_deducted:false};
    if(f.stato==='Completata'){applyStock(f.materials);pr={...pr,stock_deducted:true};}
    setPrints(ps=>[pr,...ps]);setModal(null);
    /* se creata già fallita, chiedi consumo materiale */
    if(f.stato==='Fallita'&&f.materials.length>0){
      setModal({type:'waste',data:pr});
    }
  };
  const editPrint = f => {
    const old = prints.find(p => p.id === f.id);
    const wasC = old?.stato === 'Completata';
    const wasF = old?.stato === 'Fallita';
    const isC = f.stato === 'Completata';
    const isF = f.stato === 'Fallita';
    let upd = { ...f };
    
    if(isC && !wasC && !f.stock_deducted){
      applyStock(f.materials);
      upd = { ...upd, stock_deducted: true };
    }
    
    // Sincronizza lo stato (es. da In attesa a In corso)
    syncQStato(f.quote_id, f.quote_model_id, f.stato);

    // --- SINCRONIZZAZIONE COMPLETA DATI TECNICI (Stampa -> Preventivo) ---
    if (f.quote_id && f.quote_model_id) {
      setQuotes(qs => qs.map(q => {
        if (q.id === f.quote_id) {
          const newModelli = (q.modelli || []).map(m => {
            // Troviamo il modello corrispondente e copiamo TUTTI i nuovi valori
            if (m.id === f.quote_model_id) {
              return { 
                ...m, 
                m_op: f.m_op,
                printer_id: f.printer_id,
                materials: f.materials,
                ore: f.ore,
                min: f.min
              };
            }
            return m;
          });
          return { ...q, modelli: newModelli };
        }
        return q;
      }));
    }
    // --- FINE SINCRONIZZAZIONE ---

    setPrints(ps => ps.map(p => p.id === f.id ? upd : p));
    setModal(null);
    /* se appena dichiarata fallita (non lo era prima) e non già gestita, apri modale scarti */
    if(isF && !wasF && !f.waste_deducted && f.materials.length>0){
      setModal({type:'waste',data:upd});
    }
  };
  const handleWasteSave=useCallback((doDeduct,qtys)=>{
    if(doDeduct&&qtys.length>0){
      applyWaste(qtys.filter(q=>q.peso_g>0));
      /* marca la stampa come waste_deducted */
      setPrints(ps=>ps.map(p=>p.id===modal?.data?.id?{...p,waste_deducted:true}:p));
    }
    setModal(null);
  },[applyWaste,modal]);

  const addQuote = f => {
    const qId = uid();
    const sn = makeSnapshot(f, mats, printers, settings.c_kwh);
    const newQ = { ...f, id: qId, congelato: false, snapshot: sn };
    setQuotes(qs => [newQ, ...qs]);
    setUsedNums(un => [...un, f.numero]);
    
    const newPrints = (f.modelli || []).filter(m => m.stato !== 'Annullato').map((mod) => {
      const pCost = calcCost({modelli: [mod], c_kwh: settings.c_kwh, matsDb: mats, printers}).total;
      
      return {
        id: uid(),
        nome: `${f.numero} — ${mod.nome_modello}`,
        nome_progetto: f.nome_progetto||'',
        data: f.data,
        printer_id: mod.printer_id,
        materials: mod.materials,
        ore: mod.ore,
        min: mod.min,
        stato: mod.stato || 'In attesa',
        cliente: f.cliente,
        note: `Modello associato al preventivo ${f.numero}`,
        m_op: mod.m_op,
        costo: pCost,
        quote_id: qId,
        quote_model_id: mod.id, 
        stock_deducted: false
      };
    });
    
    setPrints(ps => [...newPrints, ...ps]);
    setModal(null);
  };
  const editQuote = f => {
    const sn = makeSnapshot(f, mats, printers, settings.c_kwh);
    setQuotes(qs => qs.map(q => q.id === f.id ? { ...f, congelato: false, snapshot: sn } : q));
    
    // Aggiorna le stampe collegate
    setPrints(ps => ps.map(p => {
      if (p.quote_id !== f.id) return p;
      const mod = (f.modelli || []).find(m => m.id === p.quote_model_id);
      if (!mod) return p;
      
      // Mappa stato modello → stato stampa
      const statoFromMod =
        mod.stato === 'Completata' ? 'Completata' :
        mod.stato === 'Annullato'  ? 'Annullata'  :
        mod.stato === 'In corso'   ? 'In corso'   :
        p.stato; // 'In attesa' del modello mantiene lo stato corrente della stampa
      
      if (p.stato === 'In attesa') {
        // Stampa ancora da avviare: aggiorna tutti i dati tecnici + eventuale nuovo stato
        const costs = calcCost({modelli: [mod], c_kwh: settings.c_kwh, matsDb: mats, printers});
        return {
          ...p,
          materials: mod.materials,
          printer_id: mod.printer_id,
          ore: mod.ore,
          min: mod.min,
          m_op: mod.m_op,
          costo: costs.total,
          cost_detail: costs,
          stato: statoFromMod,
        };
      } else if (p.stato !== 'Completata' && p.stato !== 'Fallita') {
        // Stampa in corso o annullata: solo lo stato viene aggiornato, non i dati tecnici
        return { ...p, stato: statoFromMod };
      }
      // Stampa già completata o fallita: non modificare
      return p;
    }));

    setModal(null);
  };
  const updateQuotePrices = qid => {
    setQuotes(qs => qs.map(q => {
      if (q.id !== qid) return q;
      
      const mList = q.modelli && q.modelli.length > 0 ? q.modelli : [{
        id: uid(), nome_modello: 'Modello', printer_id: q.printer_id, materials: q.materials || [], ore: q.ore, min: q.min, m_op: q.m_op, servizi: q.servizi || [], stato: q.stato
      }];
      
      const newModelli = mList.map(mod => ({
        ...mod,
        m_op: q.uso_interno ? 0 : mod.m_op,
        servizi: q.uso_interno ? [] : mod.servizi,
        materials: mod.materials.map(m => {
          const mat = mats.find(x => x.id === m.mat_id);
          return mat ? { ...m, prezzo_snapshot: mat.prezzo } : m;
        })
      }));
      
      const costs = calcCost({modelli: newModelli, c_kwh: settings.c_kwh, matsDb: mats, corriere_prezzo: q.uso_interno ? 0 : (+q.corriere_prezzo || 0), printers});
      const effMarkup = q.uso_interno ? 0 : q.markup;
      const effMarkupExtra = q.uso_interno ? 0 : q.markup_extra;
      const effIva = q.uso_interno ? 0 : q.iva;
      const effRitenuta = q.uso_interno ? false : (q.ritenuta && settings.regime === 'occasionale');
      const sale = calcSale(costs.total, effMarkup, effMarkupExtra, effIva, effRitenuta);
      const sn = makeSnapshot({ ...q, modelli: newModelli }, mats, printers, settings.c_kwh);
      
      return { ...q, modelli: newModelli, costo_prod: costs.total, prezzo: sale.totale, imponibile: sale.imponibile, iva_amt: sale.ivaAmt, ritenuta_amt: sale.ritenuta_amt, cost_detail: costs, congelato: false, snapshot: sn };
    }));
  };
  const freezeQuote=qid=>setQuotes(qs=>qs.map(q=>q.id===qid?{...q,congelato:true}:q));
  const updateQuote=q=>setQuotes(qs=>qs.map(x=>x.id===q.id?q:x));
  const duplicateQuote = qid => {
    const q = quotes.find(x => x.id === qid);
    if (!q) return;
    const newNum = q.uso_interno ? `${q.numero}-dup` : `${q.numero}-dup`;
    if (isQNUsed(newNum, quotes, usedNums)) { alert(`Il numero "${newNum}" esiste già.`); return; }
    
    const mList = q.modelli && q.modelli.length > 0 ? q.modelli : [{
      id: uid(), nome_modello: 'Modello', printer_id: q.printer_id, materials: q.materials || [], ore: q.ore, min: q.min, m_op: q.m_op, servizi: q.servizi || [], stato: q.stato
    }];
    
    const newModelli = mList.map(mod => ({
      ...mod,
      id: uid(),
      stato: 'In attesa',
      m_op: q.uso_interno ? 0 : mod.m_op,
      servizi: q.uso_interno ? [] : mod.servizi,
      materials: mod.materials.map(m => {
        const mat = mats.find(x => x.id === m.mat_id);
        return mat ? { ...m, prezzo_snapshot: mat.prezzo } : m;
      })
    }));
    
    const costs = calcCost({modelli: newModelli, c_kwh: settings.c_kwh, matsDb: mats, corriere_prezzo: q.uso_interno ? 0 : (+q.corriere_prezzo || 0), printers});
    const effMarkup = q.uso_interno ? 0 : q.markup;
    const effMarkupExtra = q.uso_interno ? 0 : q.markup_extra;
    const effIva = q.uso_interno ? 0 : q.iva;
    const effRitenuta = q.uso_interno ? false : (q.ritenuta && settings.regime === 'occasionale');
    const sale = calcSale(costs.total, effMarkup, effMarkupExtra, effIva, effRitenuta);
    const sn = makeSnapshot({ ...q, modelli: newModelli }, mats, printers, settings.c_kwh);
    
    const dup = { ...q, id: uid(), numero: newNum, stato: 'In attesa', modelli: newModelli, costo_prod: costs.total, prezzo: sale.totale, imponibile: sale.imponibile, iva_amt: sale.ivaAmt, ritenuta_amt: sale.ritenuta_amt, cost_detail: costs, congelato: false, snapshot: sn };
    
    setQuotes(qs => [dup, ...qs]);
    setUsedNums(un => [...un, newNum]);
  };
  const deleteItem=(type,id,opt)=>{
    if(type==='mat')setMats(ms=>ms.filter(x=>x.id!==id));
    else if(type==='print')setPrints(ps=>ps.filter(x=>x.id!==id));
    else if(type==='quote'){
      /* opt: 'unlink' = scollega stampe, 'also' = elimina anche stampe */
      if(opt==='also')setPrints(ps=>ps.filter(p=>p.quote_id!==id));
      else if(opt==='unlink')setPrints(ps=>ps.map(p=>p.quote_id===id?{...p,quote_id:null}:p));
      setQuotes(qs=>qs.filter(x=>x.id!==id));
    }
    else if(type==='printer')setPrinters(ps=>ps.filter(x=>x.id!==id));
    else if(type==='client')setClients(cs=>cs.filter(x=>x.id!==id));
    setConfirm(null);
  };

  const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<768);
  useEffect(()=>{
    const onResize=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener('resize',onResize);
    return()=>window.removeEventListener('resize',onResize);
  },[]);

  const alerts=[...mats.filter(m=>!m.esclude_critici&&m.stock<=0).map(m=>({...m,st:'err'})),...mats.filter(m=>!m.esclude_critici&&m.stock>0&&m.stock<m.soglia).map(m=>({...m,st:'warn'}))];
  const inCorso=prints.filter(p=>p.stato==='In corso').length;
  const inAttesaPrints=prints.filter(p=>p.stato==='In attesa').length;
  const inAttesaQuotes=quotes.filter(q=>q.stato==='In attesa').length;
  const inConfermatiQuotes=quotes.filter(q=>q.stato==='Confermato').length;

  const SETTINGS_SUBS=[
    {id:'azienda',label:t('sub_azienda')},
    {id:'regime',label:t('sub_regime')},
    {id:'pagamenti',label:t('sub_pagamenti')},
    {id:'costi',label:t('sub_costi')},
    {id:'def_mat',label:t('sub_def_mat')},
    {id:'stampanti',label:t('nav_pr')},
    {id:'servizi',label:t('sub_servizi')},
    {id:'corrieri',label:t('sub_corrieri')},
    {id:'lang',label:t('sub_lang')},
    {id:'aspetto',label:t('sub_aspetto')},
    {id:'io',label:t('sub_io')},
    {id:'about',label:t('sub_about')},
  ];
  const NAVS=[
    {id:'dashboard',label:t('nav_dash'),Icon:LayoutDashboard},
    {id:'inventario',label:t('nav_inv'),Icon:Package,badge:alerts.length>0?alerts.length:null,badgeClr:C.err},
    {id:'stampe',label:t('nav_prints'),Icon:Calculator,
      badges:[
        inAttesaPrints>0?{n:inAttesaPrints,clr:C.warn}:null,
        inCorso>0?{n:inCorso,clr:C.blue}:null,
      ].filter(Boolean)},
    {id:'preventivi',label:t('nav_quotes'),Icon:FileText,
      badges:[
        inAttesaQuotes>0?{n:inAttesaQuotes,clr:C.warn}:null,
        inConfermatiQuotes>0?{n:inConfermatiQuotes,clr:C.blue}:null,
      ].filter(Boolean)},
    {id:'rubrica',label:t('nav_contacts'),Icon:Users},
    {id:'impostazioni',label:t('nav_set'),Icon:Settings},
  ];

  /* save status label */
  const saveLabel=saveStatus==='saving'?t('sess_saving'):saveStatus==='saved'?`${t('sess_saved')} ✓`:saveStatus==='error'?'Errore salvataggio':lastSaved?`${t('sess_saved')}: ${lastSaved.toLocaleTimeString(lang==='en'?'en-GB':'it-IT',{hour:'2-digit',minute:'2-digit'})}`:t('sess_never');
  const saveLabelColor=saveStatus==='saved'?C.ok:saveStatus==='error'?C.err:C.t3;
  const memClr=memUsage.pct>80?C.err:memUsage.pct>60?C.warn:C.ok;

  return(
    <LangCtx.Provider value={{t,lang,setLang,valuta:settings.valuta||'€',colorLang:settings.colori_en&&lang==='it'?'en':lang}}>
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:C.bg,fontFamily:'system-ui,sans-serif',position:'relative',color:C.t}}>
      {/* ══ TOP BAR ══ */}
      <header style={{background:C.s1,borderBottom:`3px solid ${C.a}`,borderTop:`3px solid ${C.a}`,display:'flex',alignItems:'stretch',height:88,flexShrink:0,zIndex:50}}>

        {/* Logo block — 180px, piena altezza */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 10px',borderRight:`1px solid ${C.b}`,flexShrink:0,width:180,boxSizing:'border-box',gap:3,overflow:'hidden'}}>
          {settings.logo&&!isMobile&&<img src={settings.logo} alt="" style={{maxHeight:settings.ragione_sociale?40:54,maxWidth:155,display:'block',borderRadius:4,objectFit:'contain',flexShrink:0}}/>}
          <span style={{color:C.a,fontWeight:700,fontSize:'0.88rem',lineHeight:1.1,letterSpacing:'0.02em',textAlign:'center',flexShrink:0}}>Print3D Manager</span>
          {!isMobile&&<span style={{color:C.t2,fontSize:'0.64rem',lineHeight:1.5,maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textAlign:'center',fontWeight:500,flexShrink:0,paddingBottom:2}} title={settings.ragione_sociale||undefined}>{settings.ragione_sociale||'—'}</span>}
          {isMobile&&<span style={{color:C.t2,fontSize:'0.65rem',lineHeight:1}}>{NAVS.find(n=>n.id===tab)?.label||''}</span>}
        </div>

        {/* Nav 3 colonne — nascosto su mobile */}
        {!isMobile&&<nav style={{flex:1,display:'flex',overflow:'hidden'}}>

          {/* Colonna SINISTRA — Dashboard a piena altezza */}
          {(()=>{const d=NAVS.find(n=>n.id==='dashboard');return(
            <button onClick={()=>{setTab('dashboard');setMobileMenuOpen(false);}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,width:110,flexShrink:0,background:tab==='dashboard'?C.a2:'none',border:'none',borderRight:`1px solid ${C.b}`,borderBottom:`3px solid ${tab==='dashboard'?C.a:'transparent'}`,color:tab==='dashboard'?C.a:C.t2,cursor:'pointer',fontFamily:'inherit',transition:'color 0.15s,background 0.15s'}}>
              <LayoutDashboard size={20}/>
              <span style={{fontSize:'0.82rem',fontWeight:600,whiteSpace:'nowrap'}}>{d?.label}</span>
            </button>
          );})()}

          {/* Colonna CENTRALE — 2 righe × 2 voci */}
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            {/* Riga superiore: Inventario | Rubrica */}
            <div style={{flex:1,display:'flex',alignItems:'stretch',borderBottom:`1px solid ${C.b}`}}>
              {NAVS.filter(n=>['inventario','rubrica'].includes(n.id)).map(({id,label,badge,badgeClr,badges})=>(
                <button key={id} onClick={()=>{setTab(id);setMobileMenuOpen(false);}}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,background:tab===id?C.a2:'none',border:'none',borderRight:`1px solid ${C.b}`,borderBottom:`2px solid ${tab===id?C.a:'transparent'}`,color:tab===id?C.a:C.t2,cursor:'pointer',fontSize:'0.85rem',fontFamily:'inherit',whiteSpace:'nowrap',transition:'color 0.15s,background 0.15s'}}>
                  {label}
                  {badge&&<span style={{background:`${badgeClr}22`,color:badgeClr,border:`1px solid ${badgeClr}44`,fontSize:'0.62rem',padding:'1px 4px',borderRadius:3,fontWeight:700}}>{badge}</span>}
                  {badges&&badges.map((b,i)=><span key={i} style={{background:`${b.clr}22`,color:b.clr,border:`1px solid ${b.clr}44`,fontSize:'0.62rem',padding:'1px 4px',borderRadius:3,fontWeight:700}}>{b.n}</span>)}
                </button>
              ))}
            </div>
            {/* Riga inferiore: Stampe | Preventivi */}
            <div style={{flex:1,display:'flex',alignItems:'stretch'}}>
              {NAVS.filter(n=>['stampe','preventivi'].includes(n.id)).map(({id,label,badge,badgeClr,badges})=>(
                <button key={id} onClick={()=>{setTab(id);setMobileMenuOpen(false);}}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,background:tab===id?C.a2:'none',border:'none',borderRight:`1px solid ${C.b}`,borderTop:`2px solid ${tab===id?C.a:'transparent'}`,color:tab===id?C.a:C.t2,cursor:'pointer',fontSize:'0.85rem',fontFamily:'inherit',whiteSpace:'nowrap',transition:'color 0.15s,background 0.15s'}}>
                  {label}
                  {badge&&<span style={{background:`${badgeClr}22`,color:badgeClr,border:`1px solid ${badgeClr}44`,fontSize:'0.62rem',padding:'1px 4px',borderRadius:3,fontWeight:700}}>{badge}</span>}
                  {badges&&badges.map((b,i)=><span key={i} style={{background:`${b.clr}22`,color:b.clr,border:`1px solid ${b.clr}44`,fontSize:'0.62rem',padding:'1px 4px',borderRadius:3,fontWeight:700}}>{b.n}</span>)}
                </button>
              ))}
            </div>
          </div>

          {/* Colonna DESTRA — Impostazioni a piena altezza */}
          {(()=>{const s=NAVS.find(n=>n.id==='impostazioni');return(
            <button onClick={()=>{setTab('impostazioni');setMobileMenuOpen(false);}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,width:90,flexShrink:0,background:tab==='impostazioni'?C.a2:'none',border:'none',borderLeft:`1px solid ${C.b}`,borderBottom:`3px solid ${tab==='impostazioni'?C.a:'transparent'}`,color:tab==='impostazioni'?C.a:C.t2,cursor:'pointer',fontFamily:'inherit',transition:'color 0.15s,background 0.15s'}}>
              <Settings size={21}/>
              <span style={{fontSize:'0.72rem',fontWeight:600,whiteSpace:'nowrap'}}>{s?.label}</span>
            </button>
          );})()}

        </nav>}

        {/* Right controls — 2 colonne */}
        <div style={{display:'flex',alignItems:'stretch',borderLeft:`1px solid ${C.b}`,flexShrink:0,marginLeft:isMobile?'auto':'0'}}>

          {/* Colonna sinistra — solo Calcolatrice */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'0 10px',borderRight:`1px solid ${C.b}`}}>
            <button onClick={()=>setShowQuickCalc(true)} title={t('quick_calc_title')}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,background:C.a2,border:`1px solid ${C.a3}`,color:C.a,borderRadius:7,padding:'6px 12px',cursor:'pointer',fontFamily:'inherit',fontSize:'0.68rem',fontWeight:700}}>
              <Calculator size={16}/>
              {!isMobile&&<span>Calc</span>}
            </button>
          </div>

          {/* Colonna destra — 2 righe (nascosta su mobile tranne hamburger) */}
          {!isMobile&&<div style={{display:'flex',flexDirection:'column',minWidth:170}}>
            {/* Riga superiore: memoria · versione · chiudi */}
            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'0 8px',borderBottom:`1px solid ${C.b}`}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',lineHeight:1.2}}>
                {memUsage.warning
                  ?<span title={`${memUsage.usedMB}MB / ${memUsage.limitMB}MB`} style={{color:C.err,fontSize:'0.72rem',fontWeight:700,background:C.errBg,padding:'1px 6px',borderRadius:4}}>⚠ {memUsage.pct}%</span>
                  :<span style={{color:memClr,fontSize:'0.72rem',fontWeight:700}}>{memUsage.pct}%</span>
                }
                <span style={{color:C.t3,fontSize:'0.58rem',marginTop:1}}>{t('dash_mem_used')}</span>
              </div>
              <span style={{color:C.t3,fontSize:'0.62rem',borderLeft:`1px solid ${C.b}`,paddingLeft:6}}>{APP_VERSION}</span>
              <button onClick={handleCloseApp} title={t('sess_close')} style={{background:C.errBg,border:`1px solid ${C.errBr}`,color:C.err,borderRadius:4,padding:'2px 6px',cursor:'pointer',display:'flex',alignItems:'center',gap:3,fontSize:'0.68rem',fontFamily:'inherit'}}>
                <X size={10}/>
              </button>
            </div>
            {/* Riga inferiore: salvataggio */}
            <div style={{flex:1,display:'flex',alignItems:'center',padding:'0 8px'}}>
              <button onClick={()=>doSave(true)} title={`${saveLabel} — ${t('sess_save_now')}`}
                style={{display:'flex',alignItems:'center',gap:4,background:'none',border:'none',color:saveLabelColor,cursor:'pointer',padding:'2px 4px',borderRadius:4,fontSize:'0.68rem',maxWidth:180,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',fontFamily:'inherit'}}>
                <Download size={11}/><span style={{overflow:'hidden',textOverflow:'ellipsis'}}>{saveLabel}</span>
              </button>
            </div>
          </div>}

          {/* Mobile: solo hamburger */}
          {isMobile&&<div style={{display:'flex',alignItems:'center',padding:'0 8px'}}>
            <button onClick={()=>setMobileMenuOpen(o=>!o)}
              style={{background:mobileMenuOpen?C.a2:'none',border:`1px solid ${mobileMenuOpen?C.a:C.b}`,color:mobileMenuOpen?C.a:C.t2,borderRadius:5,padding:'4px 10px',cursor:'pointer',fontSize:'0.85rem',lineHeight:1,fontFamily:'inherit'}}>
              {mobileMenuOpen?'✕':'☰'}
            </button>
          </div>}

        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileMenuOpen&&(
        <div style={{position:'absolute',top:84,left:0,right:0,background:C.s1,borderBottom:`1px solid ${C.b}`,zIndex:100,padding:'0.5rem'}}>
          {NAVS.map(({id,label})=>(
            <button key={id} onClick={()=>{setTab(id);setMobileMenuOpen(false);}}
              style={{display:'block',width:'100%',textAlign:'left',padding:'0.6rem 1rem',background:tab===id?C.a2:'transparent',color:tab===id?C.a:C.t2,border:'none',borderRadius:6,cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',marginBottom:2}}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>

        {/* Views a pannello singolo (larghezza piena) */}
        {['dashboard','inventario','rubrica'].includes(tab)&&(
          <main style={{flex:1,overflowY:'auto',padding:'1.25rem 1.5rem'}}>
            {tab==='dashboard' &&<Dashboard mats={mats} prints={prints} quotes={quotes} printers={printers} alerts={alerts} setTab={setTab} settings={settings}/>}
            {tab==='inventario'&&<MatInvView mats={mats} alerts={alerts} settings={settings} setModal={setModal} setConfirm={setConfirm} setMats={setMats}/>}
            {tab==='rubrica'   &&<ClientView clients={clients} setModal={setModal} setConfirm={setConfirm}/>}
          </main>
        )}

        {/* Impostazioni — sidebar sub-nav a sinistra + contenuto a destra */}
        {tab==='impostazioni'&&(
          <div style={{flex:1,display:'flex',overflow:'hidden'}}>
            <div style={{width:180,background:C.s1,borderRight:`1px solid ${C.b}`,padding:'0.5rem 0',flexShrink:0,overflowY:'auto'}}>
              {SETTINGS_SUBS.map(sub=>(
                <button key={sub.id} onClick={()=>setSettingsSub(sub.id)}
                  style={{display:'block',width:'100%',textAlign:'left',padding:'0.35rem 0.875rem',borderRadius:5,border:'none',background:settingsSub===sub.id?C.a2:'transparent',color:settingsSub===sub.id?C.a:C.t3,fontSize:'0.8rem',cursor:'pointer',fontFamily:'inherit',marginBottom:1}}>
                  {sub.label}
                </button>
              ))}
            </div>
            <main style={{flex:1,overflowY:'auto',padding:'1.25rem 1.5rem'}}>
              <SettingsView settingsSub={settingsSub} settings={settings} setSettings={setSettings} mats={mats} setMats={setMats} prints={prints} setPrints={setPrints} quotes={quotes} setQuotes={setQuotes} printers={printers} setPrinters={setPrinters} clients={clients} setClients={setClients} usedNums={usedNums} setUsedNums={setUsedNums} sessionFileName={sessionFileName} setModal={setModal} setConfirm={setConfirm}/>
            </main>
          </div>
        )}

        {/* Stampe — Master/Detail inline */}
        {tab==='stampe'&&(
          <PrintView prints={prints} mats={mats} printers={printers} quotes={quotes}
            onAddPrint={addPrint} onEditPrint={editPrint} settings={settings}
            setModal={setModal} setConfirm={setConfirm} isMobile={isMobile}/>
        )}

        {/* Preventivi — Master/Detail inline */}
        {tab==='preventivi'&&(
          <QuoteView quotes={quotes} mats={mats} printers={printers} settings={settings}
            usedNums={usedNums} clients={clients} prints={prints}
            onAddQuote={addQuote} onEditQuote={editQuote}
            setModal={setModal} setConfirm={setConfirm}
            setUsedNums={setUsedNums} onUpdatePrices={updateQuotePrices}
            onFreeze={freezeQuote} onDuplicate={duplicateQuote} isMobile={isMobile}
            rcptNums={rcptNums} setRcptNums={setRcptNums} onUpdateQuote={updateQuote}/>
        )}

      </div>

      {/* ══ MODALS ══ */}
      {modal?.type==='mat'     &&<Modal title={modal.data?t('mat_edit'):t('mat_new')} onClose={()=>setModal(null)}><MatForm init={modal.data} settings={settings} onSave={upsertMat} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==='printer' &&<Modal title={modal.data?t('pr_edit'):t('pr_new')} onClose={()=>setModal(null)}><PrinterForm init={modal.data} onSave={upsertPrinter} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==='client'  &&<Modal title={modal.data?t('rb_edit'):t('rb_new')} onClose={()=>setModal(null)}><ClientForm init={modal.data} onSave={upsertClient} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==='quote'     &&<Modal title={t('q_new')} onClose={()=>setModal(null)} wide maxWidth={1100}><QuoteForm mats={mats} printers={printers} settings={settings} quotes={quotes} clients={clients} usedNums={usedNums} prints={prints} onSave={addQuote} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==='quote_edit'&&<Modal title={t('edit_quote_title')} onClose={()=>setModal(null)} wide maxWidth={1100}><QuoteForm mats={mats} printers={printers} settings={settings} quotes={quotes} clients={clients} usedNums={usedNums} prints={prints} init={modal.data} isEdit onSave={f=>editQuote({...modal.data,...f})} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==='stock'   &&<Modal title={t('stk_upd')} onClose={()=>setModal(null)}><StockForm mat={modal.data} onSave={ns=>updateStock(modal.data.id,ns)} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==='spools'  &&<Modal title={t('spool_title')} onClose={()=>setModal(null)} wide><SpoolManager mat={modal.data} onSave={updateSpools} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==='waste'   &&<Modal title={`⚠ ${t('st_fallita')} — ${t('print_form_materials')}`} onClose={()=>handleWasteSave(false,[])}><WasteForm print={modal.data} mats={mats} onSave={handleWasteSave} onClose={()=>handleWasteSave(false,[])}/></Modal>}
      {showQuickCalc&&<Modal title={t('quick_calc_title')} onClose={()=>setShowQuickCalc(false)}><QuickCalc mats={mats} printers={printers} settings={settings} onClose={()=>setShowQuickCalc(false)}/></Modal>}
      {confirm&&(()=>{
        const linkedPrints=confirm.type==='quote'?prints.filter(p=>p.quote_id===confirm.id):[];
        const isQuoteWithPrints=confirm.type==='quote'&&linkedPrints.length>0;
        return(
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.82)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}}>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:'1.25rem',maxWidth:400,width:'90%'}}>
              <div style={{color:C.t,fontWeight:500,marginBottom:8}}>{isQuoteWithPrints?t('q_del_title'):t('confirm_del')}</div>
              {isQuoteWithPrints?(
                <>
                  <div style={{color:C.t2,fontSize:'0.875rem',marginBottom:'1rem'}}>
                    Preventivo <strong style={{color:C.t}}>{confirm.nome}</strong> — {t('q_del_has_prints')}
                    <span style={{color:C.t3,fontSize:'0.78rem',display:'block',marginTop:4}}>{linkedPrints.length} stampa/e collegata/e.</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:'1rem'}}>
                    <button onClick={()=>deleteItem(confirm.type,confirm.id,'unlink')}
                      style={{background:C.warnBg,border:`1px solid ${C.warnBr}`,color:C.warn,borderRadius:7,padding:'0.55rem 0.875rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.82rem',textAlign:'left'}}>
                      <div style={{fontWeight:600,marginBottom:2}}>{t('q_del_unlink')}</div>
                      <div style={{fontSize:'0.72rem',opacity:0.8}}>{t('q_del_unlink_hint')}</div>
                    </button>
                    <button onClick={()=>deleteItem(confirm.type,confirm.id,'also')}
                      style={{background:C.errBg,border:`1px solid ${C.errBr}`,color:C.err,borderRadius:7,padding:'0.55rem 0.875rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.82rem',textAlign:'left'}}>
                      <div style={{fontWeight:600,marginBottom:2}}>{t('q_del_also')}</div>
                      <div style={{fontSize:'0.72rem',opacity:0.8}}>{t('q_del_also_hint')}</div>
                    </button>
                  </div>
                  <div style={{display:'flex',justifyContent:'flex-end'}}><Btn onClick={()=>setConfirm(null)}>{t('cancel')}</Btn></div>
                </>
              ):(
                <>
                  <div style={{color:C.t2,fontSize:'0.875rem',marginBottom:'1rem'}}>{t('del_confirm_text')} <strong style={{color:C.t}}>{confirm.nome}</strong>? {t('irreversible')}<br/><span style={{color:C.t3,fontSize:'0.8rem',marginTop:4,display:'block'}}>{t('del_linked')}</span></div>
                  <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn onClick={()=>setConfirm(null)}>{t('cancel')}</Btn><Btn onClick={()=>deleteItem(confirm.type,confirm.id)} variant="dan"><Trash2 size={13}/>{t('del')}</Btn></div>
                </>
              )}
            </div>
          </div>
        );
      })()}
      {memUsage.warning&&(
        <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:150,background:C.errBg,borderTop:`1px solid ${C.errBr}`,padding:'0.4rem 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <span style={{color:C.err,fontSize:'0.8rem',fontWeight:500}}>{t('mem_warn')} ({memUsage.usedMB}MB / {memUsage.limitMB}MB {t('mem_used_note')})</span>
          <button onClick={()=>setTab('impostazioni')} style={{background:C.errBg,border:`1px solid ${C.errBr}`,color:C.err,borderRadius:5,padding:'0.2rem 0.6rem',cursor:'pointer',fontSize:'0.75rem',fontFamily:'inherit'}}>{t('set_exp_all')}</button>
        </div>
      )}
      {closeState&&(
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300}}>
          <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,padding:'2rem',textAlign:'center',maxWidth:340}}>
            {closeState==='saving'?(<><div style={{color:C.a,fontSize:'2rem',marginBottom:'0.75rem'}}>💾</div><div style={{color:C.t,fontWeight:600,fontSize:'1rem',marginBottom:6}}>{t('sess_close_saving')}</div><div style={{color:C.t3,fontSize:'0.82rem'}}>{t('sess_wait')}</div></>):(
              <><div style={{color:C.ok,fontSize:'2rem',marginBottom:'0.75rem'}}>✓</div><div style={{color:C.t,fontWeight:600,fontSize:'1rem',marginBottom:6}}>{t('sess_close_ok')}</div>
              <div style={{color:C.t3,fontSize:'0.82rem',marginBottom:'1.25rem'}}>{FSA_SUPPORTED&&fileHandle?'File di sessione aggiornato automaticamente.':'File scaricato nella cartella Download.'}</div>
              <button onClick={()=>{try{window.close();}catch{}setCloseState(null);}} style={{background:C.a,border:'none',color:'#000',borderRadius:7,padding:'0.5rem 1.5rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',fontWeight:600}}>{t('close_window_btn')}</button></>
            )}
          </div>
        </div>
      )}
    </div>
    </LangCtx.Provider>
  );
}
