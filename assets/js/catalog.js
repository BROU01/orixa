/* ORIXA — Catalogue
   Source unique de vérité pour la boutique, la fiche produit et l'admin.
   Les produits correspondent aux fichiers réels de /products.
   Prix en EUR (€) — boutique française, livraison Europe. */

window.ORIXA_CATEGORIES = [
  { id: 'cosmetiques', label: 'Cosmétiques',          desc: 'Soins naturels, maquillage et parfums.' },
  { id: 'exotiques',   label: 'Produits exotiques',   desc: "Épicerie fine et saveurs d'ailleurs." }
];

window.ORIXA_PRODUCTS = [
  /* ---------- Cosmétiques ---------- */
  { id:'karite',          nom:'Beurre de karité brut',       cat:'cosmetiques', prix:12.90, unite:'250 g',     stock:120, img:'products/cosmetics/beurre-de-karite.jpg', desc:"Karité non raffiné pressé à froid. Nourrit peau sèche, cheveux et cicatrices. Sans parfum ajouté.", origine:'Burkina Faso', badge:'Best-seller' },
  { id:'pommade',         nom:'Pommade hydratante karité',   cat:'cosmetiques', prix:9.90,  unite:'150 ml',    stock:74,  img:'products/cosmetics/pommade.jpg',       desc:"Base de karité fondue, texture légère. Application quotidienne visage et corps.", origine:'Burkina Faso', badge:'' },
  { id:'masque-facial',   nom:'Masque facial argile',        cat:'cosmetiques', prix:10.90, unite:'100 g',     stock:43,  img:'products/cosmetics/masque-facial.jpg', desc:"Argile et plantes séchées à mélanger à l'eau. Pose de 10 minutes, une à deux fois par semaine.", origine:'Maroc', badge:'' },
  { id:'parfum',          nom:'Parfum floral Orixa',         cat:'cosmetiques', prix:39.90, unite:'50 ml',     stock:22,  img:'products/cosmetics/parfum.jpg',        desc:"Notes de frangipanier, vétiver et bois de cade. Tenue longue, sillage discret.", origine:'Composé en France', badge:'Nouveau' },
  { id:'rouge-levres',    nom:'Rouge à lèvres mat',          cat:'cosmetiques', prix:14.90, unite:'3,5 g',     stock:61,  img:'products/cosmetics/rouge-a-levre.jpg', desc:"Fini mat non desséchant, pigmentation forte. Six teintes chaudes disponibles.", origine:'Import', badge:'' },
  { id:'blush',           nom:'Blush poudre',                cat:'cosmetiques', prix:12.90, unite:'6 g',       stock:38,  img:'products/cosmetics/blush.jpg',         desc:"Poudre compacte à fondu progressif. Convient aux carnations claires à médium.", origine:'Import', badge:'' },
  { id:'mascara',         nom:'Mascara volume',              cat:'cosmetiques', prix:11.90, unite:'10 ml',     stock:55,  img:'products/cosmetics/mascara.jpg',       desc:"Brosse dense, formule résistante à l'humidité. Se retire à l'eau tiède.", origine:'Import', badge:'' },
  { id:'crayon-sourcils', nom:'Crayon à sourcils',           cat:'cosmetiques', prix:7.90,  unite:'1,2 g',     stock:69,  img:'products/cosmetics/crayon-a-sourcils-blond.jpg', desc:"Mine fine avec goupillon intégré. Teinte blond à châtain.", origine:'Import', badge:'' },
  { id:'faux-cils',       nom:'Faux cils réutilisables',     cat:'cosmetiques', prix:8.90,  unite:'paire',     stock:83,  img:'products/cosmetics/faux-cils.jpg',     desc:"Bande souple, port confortable. Réutilisables une dizaine de fois. Colle non incluse.", origine:'Import', badge:'' },
  { id:'faux-ongles',     nom:'Faux ongles pressés',         cat:'cosmetiques', prix:10.90, unite:'24 pièces', stock:47,  img:'products/cosmetics/faux-ongles.jpg',   desc:"Kit de 24 capsules en 12 tailles, colle et lime incluses. Pose en 15 minutes.", origine:'Import', badge:'' },
  { id:'vernis',          nom:'Vernis à ongles',             cat:'cosmetiques', prix:6.90,  unite:'12 ml',     stock:96,  img:'products/cosmetics/vernis-a-ongles.jpg', desc:"Séchage rapide, deux couches suffisent. Formule sans toluène ni formaldéhyde.", origine:'Import', badge:'' },
  { id:'gel',             nom:'Gel coiffant fixation forte', cat:'cosmetiques', prix:8.90,  unite:'250 ml',    stock:58,  img:'products/cosmetics/gel.jpg',           desc:"Gel sans alcool pour baby hair et coiffures tirées. Ne laisse pas de résidus blancs.", origine:'Import', badge:'' },

  /* ---------- Produits exotiques ---------- */
  { id:'gari',            nom:'Gari blanc fin',              cat:'exotiques',   prix:3.90,  unite:'1 kg',      stock:142, img:'products/exotic/gari.jpeg',            desc:"Semoule de manioc fermentée puis torréfiée. Se prépare en eba ou se boit à l'eau fraîche avec du sucre et des arachides.", origine:'Togo', badge:'' },
  { id:'attieke',         nom:'Attiéké déshydraté',          cat:'exotiques',   prix:4.90,  unite:'500 g',     stock:88,  img:'products/exotic/attieke.jpg',          desc:"Couscous de manioc ivoirien. Réhydratation à la vapeur en 10 minutes. Accompagne poisson braisé et alloco.", origine:"Côte d'Ivoire", badge:'Populaire' },
  { id:'tapioca',         nom:'Tapioca perlé',               cat:'exotiques',   prix:3.90,  unite:'500 g',     stock:64,  img:'products/exotic/tapioca.jpeg',         desc:"Perles d'amidon de manioc. Pour bouillies, desserts au lait et boissons.", origine:"Afrique de l'Ouest", badge:'' },
  { id:'farine-haricot',  nom:"Farine d'haricot",            cat:'exotiques',   prix:5.90,  unite:'1 kg',      stock:37,  img:'products/exotic/farine-d-haricot.jpg', desc:"Farine de niébé décortiqué, base des ablo et des beignets koklo. Riche en protéines.", origine:'Togo', badge:'' },
  { id:'cossette-igname', nom:"Cossettes d'igname",          cat:'exotiques',   prix:6.90,  unite:'1 kg',      stock:29,  img:'products/exotic/cossete-igname.webp', desc:"Igname séchée en lamelles, à moudre pour le foutou sec. Conservation longue durée.", origine:'Togo', badge:'' },
  { id:'aklui',           nom:'Aklui (semoule de maïs)',     cat:'exotiques',   prix:2.90,  unite:'500 g',     stock:73,  img:'products/exotic/aklui.jpg',            desc:"Fine semoule de maïs fermenté pour bouillie du matin. Se sert chaude, sucrée ou salée.", origine:'Bénin', badge:'' },
  { id:'koms',            nom:'Koms (pâte de maïs)',         cat:'exotiques',   prix:2.50,  unite:'400 g',     stock:51,  img:'products/exotic/koms.jpg',             desc:"Pâte de maïs fermentée emballée en feuille. Prête à réchauffer, accompagne sauces et poissons.", origine:'Togo', badge:'' },
  { id:'igname',          nom:'Igname fraîche',              cat:'exotiques',   prix:5.90,  unite:'pièce ~2 kg', stock:46, img:'products/exotic/igname.jpg',           desc:"Tubercule ferme à chair blanche. Pour le foutou, la friture ou la braise.", origine:'Togo', badge:'Nouveau' },
  { id:'manioc',          nom:'Manioc frais',                cat:'exotiques',   prix:2.90,  unite:'1 kg',      stock:58,  img:'products/exotic/manioc.jpg',           desc:"Racine à éplucher et cuire. Base du gari, du tapioca et de l'attiéké.", origine:"Afrique de l'Ouest", badge:'' },
  { id:'banane-plantain', nom:'Banane plantain',             cat:'exotiques',   prix:3.90,  unite:'régime ~1,5 kg', stock:92, img:'products/exotic/banane-plantain.jpg', desc:"Plantain mûr pour alloco doré, ou vert pour le foufou. Livré à maturité choisie.", origine:"Afrique de l'Ouest", badge:'Populaire' },
  { id:'aubergine',       nom:'Aubergine blanche',           cat:'exotiques',   prix:2.50,  unite:'500 g',     stock:34,  img:'products/exotic/aubergine-blanche.jpg', desc:"Petite aubergine amère locale. Se cuisine en sauce ou écrasée avec du piment.", origine:"Afrique de l'Ouest", badge:'' },
  { id:'gombo',           nom:'Gombo frais',                 cat:'exotiques',   prix:2.90,  unite:'500 g',     stock:41,  img:'products/exotic/gombo.jpg',            desc:"Gousses jeunes et tendres. Pour la sauce gluante servie avec la pâte.", origine:"Afrique de l'Ouest", badge:'' },
  { id:'gombo-moulu',     nom:'Gombo moulu',                 cat:'exotiques',   prix:3.90,  unite:'250 g',     stock:67,  img:'products/exotic/gombo-moulu.png',      desc:"Gombo séché et réduit en poudre. Épaissit les sauces sans cuisson longue.", origine:"Afrique de l'Ouest", badge:'' },
  { id:'piments',         nom:'Piments séchés',              cat:'exotiques',   prix:3.50,  unite:'200 g',     stock:105, img:'products/exotic/piments.jpg',          desc:"Piments rouges séchés au soleil, très forts. À moudre ou à infuser dans l'huile.", origine:"Afrique de l'Ouest", badge:'' },
  { id:'hibiscus',        nom:'Fleurs d’hibiscus (bissap)',  cat:'exotiques',   prix:4.90,  unite:'250 g',     stock:78,  img:'products/exotic/hibiscus.jpg',         desc:"Calices d'hibiscus pour le bissap glacé. Infusion acidulée, riche en vitamine C.", origine:'Burkina Faso', badge:'Populaire' },
  { id:'cube-maggi',      nom:'Bouillon cube poulet',        cat:'exotiques',   prix:1.90,  unite:'boîte 50 cubes', stock:210, img:'products/exotic/cube-maggi-poulet.jpg', desc:"Bouillon déshydraté au poulet. L'indispensable de toutes les sauces.", origine:'Import', badge:'' }
];

/* Devises disponibles — source unique de vérité (admin.js s'y réfère)
   Taux indicatifs par rapport à l'euro (prix catalogue en EUR) */
window.ORIXA_CURRENCIES = [
  { code: 'EUR', symbol: '€',    locale: 'fr-FR', name: 'Euro (EUR)',           rate: 1,      pos: 'after' },
  { code: 'XOF', symbol: 'FCFA', locale: 'fr-FR', name: 'Franc CFA (XOF)',      rate: 655.957, pos: 'after' },
  { code: 'USD', symbol: '$',    locale: 'en-US', name: 'Dollar US (USD)',      rate: 1.09,    pos: 'before' },
  { code: 'GBP', symbol: '£',    locale: 'en-GB', name: 'Livre Sterling (GBP)', rate: 0.86,    pos: 'before' },
  { code: 'CHF', symbol: 'CHF',  locale: 'fr-CH', name: 'Franc suisse (CHF)',   rate: 0.94,    pos: 'after' },
  { code: 'MAD', symbol: 'DH',   locale: 'fr-MA', name: 'Dirham (MAD)',         rate: 10.8,    pos: 'after' }
];

/* Devise effective : préférence du visiteur > devise du site (admin) > EUR */
window.OrixaCurrency = {
  get() {
    try {
      const vc = localStorage.getItem('orixa:visitor-currency');
      if (vc) {
        const c = (window.ORIXA_CURRENCIES || []).find(function (x) { return x.code === vc; });
        if (c) return { code: c.code, symbol: c.symbol, pos: c.pos || 'after', locale: c.locale, rate: c.rate || 1 };
      }
    } catch (e) {}
    try {
      const s = JSON.parse(localStorage.getItem('orixa:settings') || '{}');
      const c2 = (window.ORIXA_CURRENCIES || []).find(function (x) { return x.code === s.currency; });
      if (c2) {
        return {
          code: c2.code, symbol: s.currencySymbol || c2.symbol,
          pos: s.currencyPosition || c2.pos || 'after',
          locale: s.locale || c2.locale, rate: c2.rate || 1
        };
      }
    } catch (e) {}
    return { code: 'EUR', symbol: '€', pos: 'after', locale: 'fr-FR', rate: 1 };
  },
  set(code) {
    try { localStorage.setItem('orixa:visitor-currency', code); } catch (e) {}
  },
  list() { return window.ORIXA_CURRENCIES || []; }
};

/* Helpers partagés — utilisent les réglages admin si disponibles */
window.OrixaFmt = {
  prix(v) {
    // Essayer d'utiliser la devise configurée dans l'admin
    if (window.OrixaAdmin && window.OrixaAdmin.formatPrice) {
      return window.OrixaAdmin.formatPrice(v);
    }
    // Fallback: devise effective (préférence visiteur > réglages admin)
    try {
      const eff = window.OrixaCurrency ? window.OrixaCurrency.get() : null;
      const rate = (eff && eff.rate) || 1;
      const symbol = eff ? eff.symbol : '€';
      const pos = eff ? eff.pos : 'after';
      const loc = eff ? eff.locale : 'fr-FR';
      const formatted = new Intl.NumberFormat(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v * rate);
      return pos === 'before' ? symbol + ' ' + formatted : formatted + ' ' + symbol;
    } catch (e) {
      return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' €';
    }
  },
  cat(id) {
    const c = window.ORIXA_CATEGORIES.find(x => x.id === id);
    return c ? c.label : id;
  },
  // Formater une date
  date(d) {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return d; }
  },
  // Slugify
  slug(s) {
    return s.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
};
