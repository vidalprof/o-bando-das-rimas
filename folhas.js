/* ============================================================
   A FÁBRICA DE PALAVRAS — as dez folhas.

   Cada folha nasceu de um VERBO impresso numa folha real de alfabetização
   (as 41 de `_pesquisa/fotos/ddg-alfa-1ano/`). O catálogo desses verbos é o
   `_padrao/INTERATIVIDADES-FOLHA.md`. Nenhuma mecânica foi escolhida do nosso
   cardápio: a folha é que manda.
   ============================================================ */

var livro = document.getElementById("livro"), PAGEL = [];

function faixa(d, i, titulo){ d.appendChild(el("div", "faixa", '<div class="num">' + i + '</div><h2>' + titulo + '</h2>')); }
function aoAbrir(d, fn){ if(!d._aoAbrir) d._aoAbrir = []; d._aoAbrir.push(fn); }
/* ---------- O ALTO-FALANTE (pedido do Marcos, set/2026) ----------
   Palavras dele: *"os enunciados podem ter o botão de som para a criança clicar
   e ouvir"* e *"assim como as palavras"*.

   É regra da casa e tem motivo: no 1º ano metade da turma ainda soletra. Tudo o
   que a criança PRECISA LER tem que poder ser OUVIDO, senão ela responde pelo
   desenho e a folha vira loteria.

   ⚠️ O desenho do alto-falante é CSS puro — caixinha + triângulo + duas ondas
   feitas com borda arredondada. Nada de emoji (vira quadradinho nos PCs da
   escola) e nada de SVG (ordem dele). */
function botaoSom(rot, aoTocar){
  var b = el("button", "som");
  b.innerHTML = '<i class="cone"></i><i class="onda o1"></i><i class="onda o2"></i>';
  b.setAttribute("aria-label", rot || "Ouvir");
  b.onclick = function(ev){ ev.stopPropagation(); sPasso(); aoTocar(); };
  return b;
}
function enunciado(d, pi, texto, chave){
  var cx = el("div", "enunlin");
  cx.appendChild(el("div", "enun", texto));
  cx.appendChild(botaoSom("Ouvir o que a folha pede", function(){ falar(chave); }));
  d.appendChild(cx);
}
function palavraComSom(w){
  var cx = el("div", "palin");
  cx.appendChild(el("span", "pal", esc(w)));
  cx.appendChild(botaoSom("Ouvir a palavra " + esc(w), function(){ falar("pal_" + w); }));
  return cx;
}
function item(n){ return el("div", "item", n ? '<span class="n">' + n + '.</span>' : ""); }
/* fecha o item e o prega na folha — o padrão que o `_alfa1` repetia à mão em
   cada uma das onze folhas (marca o `feito`, o `data-qa` do jogador e anexa) */
function fechaItem(d, box, id){
  if(ST.resp[id]) box.className = "item feito";
  box.setAttribute("data-qa", "item-" + id);
  d.appendChild(box);
}

function monta(){
  livro.innerHTML = ""; PAGEL = []; RESP = {};
  var caps = [f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10], i;
  for(i = 0; i < caps.length; i++){
    var d = el("div", "pagina" + (i > 0 ? " " + CORES[i - 1] : "")); d.setAttribute("data-pag", i);
    caps[i](d, i);
    if(i > 0) d.appendChild(el("div", "carimbo", "FOLHA<br>PRONTA"));
    livro.appendChild(d); PAGEL.push(d);
  }
}

/* ---------- capa ----------
   Pedido do Marcos (set/2026): *"essas atividades deveriam ter uma capa bem
   legal e bonita"*. A capa não é enfeite: é a primeira coisa que a criança de
   seis anos vê, e é ela que diz "isto aqui é um lugar bom".

   ⚠️ RESTO DE CLONE, E ELE QUASE PASSOU: a capa herdada da Fábrica de Palavras
   trazia `img("sapo")` — uma figura que existe LÁ e não existe aqui. O app abria
   com um quadradinho vazio e um 404 no console, e nenhum portão de texto via
   isso. Foi o navegador que pegou. Regra: capa clonada = trocar a CENA, sempre.

   A ideia agora vem do nome: um BANDO — as palavras andam em dupla, e é isso
   que a criança vai aprender a ouvir. Então a cena da capa são PARES QUE RIMAM,
   lado a lado, com o sinal de igual entre eles. O movimento conta a atividade:
   cada par entra junto, porque rima é coisa de dois. */
function f0(d){
  var c = el("div", "capa"), nome = "O BANDO DAS RIMAS", k, letras = "";
  for(k = 0; k < nome.length; k++){
    var ch = nome.charAt(k);
    letras += ch === " " ? '<span class="esp"></span>'
      : '<span class="lt" style="animation-delay:' + (0.05 * k).toFixed(2) + 's">' + ch + '</span>';
  }
  var PARES = [["gato", "pato"], ["bola", "mola"], ["boca", "foca"]], cena = "";
  PARES.forEach(function(P, i){
    cena += '<span class="dupla" style="animation-delay:' + (0.5 + i * 0.3).toFixed(2) + 's">' +
            img(P[0]) + '<i class="igual"></i>' + img(P[1]) + '</span>';
  });
  c.innerHTML =
    '<div class="ceu"><i class="nv n1"></i><i class="nv n2"></i><i class="nv n3"></i></div>' +
    '<h1 class="titu">' + letras + '</h1>' +
    '<div class="sub">Alfabetização &middot; 1º ano &middot; dez folhas de rima</div>' +
    '<div class="esteira">' +
      '<div class="cena">' + cena + '</div>' +
      '<div class="cinta"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
    '</div>' +
    '<div class="chamada">Escreva o seu nome ali embaixo e toque em <b>Começar</b>.</div>';
  d.appendChild(c);
}

/* ---------- fileira de opções (usada em várias folhas) ----------
   `soltarEm` (opcional) liga o ARRASTAR: a criança pode puxar a figura até o
   quadro vazio em vez de só tocar nela. Pedido do Marcos, set/2026:
   *"da atividade o que vem depois a criança pode tanto clicar como arrastar a
   imagem até o local"*. As DUAS portas, sempre — no PC da escola ela usa o
   mouse e arrastar é o gesto natural; no celular, tocar é. */
function opcoes(pai, pi, id, lista, certa, cls, falaCerto, falaDica, aoAcertar, soltarEm){
  registra(id, pi, certa);
  var box = el("div", "ops"), feito = !!ST.resp[id];
  function responde(o, b){
    if(ST.resp[id]) return;
    sPasso(); if(o.fala) falar(o.fala);
    if(o.v === certa){
      b.className = "op" + (cls ? " " + cls : "") + " certa";
      if(aoAcertar) aoAcertar(b);
      setTimeout(function(){ acertou(id, falaCerto); }, aoAcertar ? 620 : 240);
    } else {
      b.className = "op" + (cls ? " " + cls : "") + " erro";
      setTimeout(function(){ b.className = "op" + (cls ? " " + cls : ""); }, 500);
      errou(id, falaDica);
    }
  }
  lista.forEach(function(o){
    var b = el("button", "op" + (cls ? " " + cls : "") + (feito && o.v === certa ? " certa" : ""), o.rot);
    b.setAttribute("data-qa", "op-" + id + "-" + o.v);
    b.setAttribute("aria-label", o.aria || o.v);
    b.onclick = function(){ if(b._arrastou){ b._arrastou = false; return; } responde(o, b); };
    if(soltarEm) puxavel(b, soltarEm, function(){ responde(o, b); });
    box.appendChild(b);
  });
  pai.appendChild(box);
}

/* ---------- PUXAR uma peça até um alvo (mouse, dedo e caneta) ----------
   ⚠️ Pointer Events e não mouse+touch separados: no celular o navegador dispara
   eventos de mouse FANTASMA depois do toque, e foi assim que o arrastar já
   quebrou duas vezes nesta casa. Aqui o `setPointerCapture` prende o ponteiro
   no botão e o mesmo código serve para os três.
   ⚠️ E nada de `preventDefault` no início: isso mataria o toque. Só depois de
   o dedo ANDAR 8 px é que vira arrasto — antes disso continua sendo um toque
   normal, e o `onclick` responde igual. */
var PUXA = null;   /* o arrasto em andamento (um de cada vez) */

function puxavel(bt, alvos, aoSoltar){
  if(!alvos.push) alvos = [alvos];
  bt.style.touchAction = "none";
  bt.addEventListener("pointerdown", function(ev){
    if(ev.button && ev.button !== 0) return;
    PUXA = {bt: bt, alvos: alvos, aoSoltar: aoSoltar,
            x0: ev.clientX, y0: ev.clientY,
            lx: ev.clientX, ly: ev.clientY,   /* último lugar onde o dedo esteve */
            andando: false, fantasma: null};
  });
}

/* ⚠️⚠️ DUAS LIÇÕES PAGAS AQUI (set/2026), as duas achadas por teste e nenhuma
   delas dava erro na tela — o arrasto simplesmente não acontecia:

   1. `setPointerCapture` no próprio botão + `pointermove` NELE: só o primeiro
      movimento chegava. O padrão certo é ouvir no DOCUMENTO — o dedo precisa
      poder SAIR de cima da peça, que é justamente o que ele faz ao levá-la.

   2. O navegador FUNDE os movimentos (coalescing). Num teste com 8 passos
      chegou UM `pointermove`, de 5 px. Se eu decidir "isto é um arrasto" pela
      contagem de movimentos, perco a jogada. Então quem MANDA é a SOLTURA:
      apertou na peça e soltou em cima do alvo = soltou ali, tenham chegado dez
      movimentos ou um. O fantasma que segue o dedo é enfeite útil; a resposta
      não depende dele.

   E um só par de ouvintes no documento, não um por peça: com 18 figuras numa
   folha eram 18 cópias do mesmo tratador rodando a cada movimento. */
function _puxaAnda(ev){
  var P = PUXA; if(!P) return;
  P.lx = ev.clientX; P.ly = ev.clientY;
  var dx = ev.clientX - P.x0, dy = ev.clientY - P.y0;
  if(!P.andando){
    if(dx * dx + dy * dy < 64) return;            /* menos de 8 px: ainda é toque */
    P.andando = true; P.bt._arrastou = true;
    var f = P.bt.cloneNode(true);
    f.className = "fantasma " + P.bt.className;
    var r = P.bt.getBoundingClientRect();
    f.style.width = r.width + "px"; f.style.height = r.height + "px";
    f._ox = r.left; f._oy = r.top;
    document.body.appendChild(f); P.fantasma = f;
    P.bt.className = P.bt.className + " puxada";
  }
  if(ev.cancelable) ev.preventDefault();
  P.fantasma.style.left = (P.fantasma._ox + dx) + "px";
  P.fantasma.style.top = (P.fantasma._oy + dy) + "px";
  P.alvos.forEach(function(a){
    a.className = a.className.replace(/ ?perto/, "") + (sobre(ev, a) ? " perto" : "");
  });
}
function _puxaSolta(ev){
  var P = PUXA; if(!P) return;
  PUXA = null;
  P.alvos.forEach(function(a){ a.className = a.className.replace(/ ?perto/, ""); });
  P.bt.className = P.bt.className.replace(/ ?puxada/, "");
  if(P.fantasma && P.fantasma.parentNode) P.fantasma.parentNode.removeChild(P.fantasma);
  /* ⚠️ TERCEIRA LIÇÃO PAGA: o `pointercancel` chega ANTES do `pointerup` e vem
     com clientX/clientY = 0,0. Quem usasse a coordenada dele concluiria que a
     criança soltou no canto superior esquerdo da tela — e a peça nunca cairia
     no lugar. Por isso o último ponto REAL fica guardado (`lx`,`ly`) e é ele
     que manda quando o evento chega sem posição. */
  var px = ev.clientX, py = ev.clientY;
  if(!px && !py){ px = P.lx; py = P.ly; }
  var onde = {clientX: px, clientY: py};
  var andou = (px - P.x0) * (px - P.x0) + (py - P.y0) * (py - P.y0) >= 64;
  if(!andou) return;                              /* foi toque, o onclick resolve */
  P.bt._arrastou = true;
  var i;
  for(i = 0; i < P.alvos.length; i++){
    if(sobre(onde, P.alvos[i])){ P.aoSoltar(P.alvos[i], i); break; }
  }
  setTimeout(function(){ P.bt._arrastou = false; }, 60);
}
/* e o arrasto NATIVO do navegador fica desligado na atividade inteira: era ele
   que disparava o `pointercancel` e matava o nosso. */
document.addEventListener("dragstart", function(ev){ ev.preventDefault(); });
document.addEventListener("pointermove", _puxaAnda);
document.addEventListener("pointerup", _puxaSolta);
document.addEventListener("pointercancel", _puxaSolta);

function sobre(ev, alvo){
  var r = alvo.getBoundingClientRect(), m = 14;
  return ev.clientX >= r.left - m && ev.clientX <= r.right + m &&
         ev.clientY >= r.top - m && ev.clientY <= r.bottom + m;
}

/* ============ 1 — A FILA DO ALFABETO (sequência alfabética) ============
   Da folha impressa: *"complete a sequência do alfabeto"* / *"que letra vem
   depois?"* — está em quase toda folha de 1º ano.

   ⚠️ POR QUE ELA É A FOLHA 1 (parecer pedagógico, set/2026): o currículo de
   Blumenau abre o 1º ano com *"nomear as letras do alfabeto e ordená-las"*, e a
   atividade não tinha nenhuma folha disso — o Marcos tinha pedido no encargo
   ("sequência alfabética") e escapou. Ordenar letra é o degrau anterior a tudo
   o que vem depois; por isso ela abre o caderno.

   O ANDAIME: mostra-se um pedacinho da fila (três letras) com um buraco no
   meio, nunca o alfabeto inteiro — carga cognitiva de uma ideia por vez
   (Sweller). A criança escolhe entre três letras VIZINHAS na fila, que é o que
   força olhar a ordem em vez de reconhecer a forma. *//* ============================================================
   AS DEZ FOLHAS DA RIMA

   ⭐ CADA FOLHA VEIO DE UMA FOLHA REAL DE PROFESSOR, e é FIEL a ela: as mesmas
   palavras, os mesmos distratores, o mesmo comando impresso. As folhas estão em
   `_sequencias/folhas/` e os itens em `_sequencias/POTE-RIMA.md`, com cada
   correção justificada.

   O que muda é só o GESTO — porque a folha foi feita para o papel, e transpor
   direto daria "papel na tela", que é pior que papel: a criança perde o lápis e
   não ganha nada em troca.

   ⚠️ A ORDEM É A DA CONSCIÊNCIA FONOLÓGICA, não a das folhas: julgar se rima
   (mais fácil) → escolher entre três → pintar → a pegadinha → circular →
   arrastar → ligar → completar a parlenda → escrever → inventar.
   ============================================================ */

/* 1 — RIMA OU NÃO RIMA? (o degrau mais baixo: só JULGAR)
   ⚠️ Antes de escolher entre três, a criança precisa saber o que "rimar"
   quer dizer. Aqui ela só ouve duas palavras e diz sim ou não — e as duas
   palavras SEMPRE têm alto-falante, porque rima é coisa de ouvido: quem
   decidir pelo desenho está fazendo outra atividade. */
function f1(d, pi){
  faixa(d, pi, NOMES[0]);
  enunciado(d, pi, "Ouça as duas palavras. Elas <b>terminam com o mesmo som</b>?", "p1enun");
  var L = ST.folha.p1;
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r1_" + i;
    var box = item(i + 1);
    var par = el("div", "parrima");
    par.appendChild(figComSom(it.a));
    par.appendChild(el("span", "eou", "e"));
    par.appendChild(figComSom(it.b));
    box.appendChild(par);
    opcoes(box, pi, id, [
      {v: "sim", rot: "RIMA", aria: "Rima"},
      {v: "nao", rot: "NÃO RIMA", aria: "Não rima"}
    ], it.r ? "sim" : "nao", "grande", "certo1_" + it.a + "_" + it.b, "dica1_" + it.a + "_" + it.b);
    fechaItem(d, box, id, 0);
  }
}

/* a figura com o alto-falante embaixo — o par que a folha 06/17/18 imprime */
function figComSom(w){
  var c = el("div", "figsom");
  c.innerHTML = img(w);
  c.appendChild(el("span", "rot", esc(w.toUpperCase())));
  c.appendChild(botaoSom("Ouvir " + esc(w), function(){ falar("pal_" + w); }));
  return c;
}

/* 2 — QUAL RIMA COM ESTA? (folhas 06, 17 e 18: "PASSARINHO rima com:")
   Fiel: a figura grande à esquerda e três figuras à direita, como no papel. */
function f2(d, pi){
  faixa(d, pi, NOMES[1]);
  enunciado(d, pi, "Toque na figura que <b>rima</b> com a de cima.", "p2enun");
  var L = ST.folha.p2;
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r2_" + i;
    var box = item(i + 1);
    box.appendChild(chamada(it.f, "rima com:"));
    opcoes(box, pi, id, it.op.map(function(w){
      return {v: w, rot: img(w, "figop") + '<span class="rotop">' + esc(w.toUpperCase()) + "</span>",
              aria: w, fala: "pal_" + w};
    }), it.c, "figbt", "certo2_" + it.f, "dica2_" + it.f);
    fechaItem(d, box, id, 0);
  }
}

/* a chamada da folha: "PASSARINHO rima com:" com a figura e o alto-falante */
function chamada(w, texto){
  var c = el("div", "chamrima");
  c.innerHTML = img(w, "figgrande");
  var lin = el("div", "chamlin");
  lin.appendChild(el("b", "", esc(w.toUpperCase()) + " " + texto));
  lin.appendChild(botaoSom("Ouvir " + esc(w), function(){ falar("pal_" + w); }));
  c.appendChild(lin);
  return c;
}

/* 3 — PINTE A PALAVRA QUE RIMA (folha 08, e o comando dela é PINTAR)
   ⚠️ FIEL AO PAPEL: aqui as opções são PALAVRAS ESCRITAS, não figuras — é
   assim que a folha 08 é, e é mais difícil de propósito (a criança lê). O
   alto-falante em cada uma é o que impede a folha de virar loteria. */
function f3(d, pi){
  faixa(d, pi, NOMES[2]);
  enunciado(d, pi, "<b>Pinte</b> a palavra que rima com a figura.", "p3enun");
  estojo(d);
  var L = ST.folha.p3;
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r3_" + i;
    var box = item(i + 1);
    box.appendChild(chamada(it.f, "rima com:"));
    opcoes(box, pi, id, it.op.map(function(w){
      return {v: w, rot: esc(w.toUpperCase()), aria: w, fala: "pal_" + w};
    }), it.c, "pintavel", "certo3_" + it.f, "dica3_" + it.f, function(b){
      b.style.background = LAPIS[LAPIS_ESCOLHIDO][1];
      b.style.borderColor = LAPIS[LAPIS_ESCOLHIDO][1];
      b.style.color = "#fff";
    });
    fechaItem(d, box, id, 0);
  }
}

/* 4 — CUIDADO COM A PEGADINHA! (folha 18, e a técnica é dela)
   ⭐ A folha 18 põe BOLA ao lado de BOLSA de propósito: começa igual e NÃO
   rima. A pesquisa descreve isso como técnica ("pares pegadinha"), e achar a
   técnica sendo usada numa folha real confirma que é prática de sala.
   ⚠️ Aqui o erro na pegadinha ganha dica PRÓPRIA, que diz o que olhar: o
   COMEÇO é igual, mas rima é o FIM. */
function f4(d, pi){
  faixa(d, pi, NOMES[3]);
  enunciado(d, pi, "Uma delas <b>começa</b> parecido mas <b>não rima</b>. Ache a que rima de verdade.", "p4enun");
  var L = ST.folha.p4;
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r4_" + i;
    var box = item(i + 1);
    box.appendChild(chamada(it.f, "rima com:"));
    (function(it2, id2){
      opcoes(box, pi, id2, it2.op.map(function(w){
        return {v: w, rot: img(w, "figop") + '<span class="rotop">' + esc(w.toUpperCase()) + "</span>",
                aria: w, fala: "pal_" + w};
      }), it2.c, "figbt", "certo4_" + it2.f, "dicapeg_" + it2.f);
    })(it, id);
    fechaItem(d, box, id, 0);
  }
}

/* 5 — CIRCULE AS DUAS QUE RIMAM
   O comando impresso é CIRCULAR, então aqui se circula de verdade: a criança
   risca em volta com o dedo (ou toca, que também vale). */
function f5(d, pi){
  faixa(d, pi, NOMES[4]);
  enunciado(d, pi, "<b>Circule</b> as <b>duas</b> figuras que rimam.", "p5enun");
  var L = ST.folha.p5;
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r5_" + i;
    registra(id, pi, it.c.join(","));
    var box = item(i + 1);
    var grade = el("div", "gradecirc"), bts = [];
    it.g.forEach(function(w){
      var b = el("button", "figcirc", img(w, "figop") + '<span class="rotop">' + esc(w.toUpperCase()) + "</span>");
      b.setAttribute("data-qa", "circ-" + id + "-" + w);
      b.setAttribute("aria-label", w);
      b._w = w;
      grade.appendChild(b); bts.push(b);
    });
    box.appendChild(grade);
    (function(it2, id2, bts2, grade2){
      function confere(){
        var mar = bts2.filter(function(b){ return b.className.indexOf("marcada") >= 0; }).map(function(b){ return b._w; });
        if(mar.length < 2) return;
        var ok = mar.length === 2 && it2.c.indexOf(mar[0]) >= 0 && it2.c.indexOf(mar[1]) >= 0;
        if(ok){ acertou(id2, "certo5_" + it2.c[0]); }
        else { errou(id2, "dica5_" + it2.c[0]);
               bts2.forEach(function(b){ b.className = "figcirc"; }); }
      }
      riscoDeCircular(grade2, bts2, function(b){
        if(ST.resp[id2]) return;
        sPasso(); if(b._w) falar("pal_" + b._w);
        b.className = b.className.indexOf("marcada") >= 0 ? "figcirc" : "figcirc marcada";
        setTimeout(confere, 120);
      });
    })(it, id, bts, grade);
    fechaItem(d, box, id, 0);
  }
}

/* 6 — PUXE A QUE RIMA ATÉ O PAR
   ⚠️ TRÊS CAMINHOS, sempre: arrastar com o mouse, arrastar com o dedo e
   TOCAR. No PC da escola a criança arrasta; no celular, muitas só tocam. */
function f6(d, pi){
  faixa(d, pi, NOMES[5]);
  enunciado(d, pi, "<b>Puxe</b> até a figura de cima a que rima com ela. Tocar também vale.", "p6enun");
  var L = ST.folha.p6;
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r6_" + i;
    var box = item(i + 1);
    var alvo = el("div", "alvorima", img(it.f, "figgrande") + '<span class="rotop">' + esc(it.f.toUpperCase()) + "</span>");
    alvo.appendChild(botaoSom("Ouvir " + esc(it.f), (function(w){ return function(){ falar("pal_" + w); }; })(it.f)));
    box.appendChild(alvo);
    opcoes(box, pi, id, it.op.map(function(w){
      return {v: w, rot: img(w, "figop") + '<span class="rotop">' + esc(w.toUpperCase()) + "</span>",
              aria: w, fala: "pal_" + w};
    }), it.c, "figbt", "certo6_" + it.f, "dica6_" + it.f, null, alvo);
    fechaItem(d, box, id, 0);
  }
}

/* 7 — LIGUE QUEM RIMA (folhas 14 e 21: "ligue as palavras que rimam")
   A folha manda LIGAR, então se puxa uma linha de verdade — e ela também
   aceita tocar de um lado e do outro, para quem não consegue arrastar. */
function f7(d, pi){
  faixa(d, pi, NOMES[6]);
  enunciado(d, pi, "<b>Ligue</b> cada figura à que rima com ela.", "p7enun");
  var L = ST.folha.p7;
  for(var i = 0; i < L.length; i++){
    var g = L[i], cx = el("div", "");
    montaLigar(cx, pi, "l7g" + i, g.map(function(p){
      return {k: p.e, w: p.e, wd: p.d,
              esq: img(p.e, "figop") + '<span class="rotop">' + esc(p.e.toUpperCase()) + "</span>",
              dir: img(p.d, "figop") + '<span class="rotop">' + esc(p.d.toUpperCase()) + "</span>",
              fe: "pal_" + p.e, fd: "pal_" + p.d,
              fc: "certo7_" + p.e, dica: "dica7_" + p.e};
    }), d);
    d.appendChild(cx);
  }
}

/* 8 — COMPLETE A PARLENDA
   ⭐ ESTE É O OBJETIVO F DO CURRÍCULO, e ele é de ORALIDADE: *"recitar
   parlendas, quadras, quadrinhas… observando as rimas"*. A criança já sabe
   estas parlendas de cor — e é justamente por isso que ela funciona: a boca
   completa antes de a cabeça explicar, e aí ela DESCOBRE que sabia de rima
   sem saber o nome. */
function f8(d, pi){
  faixa(d, pi, NOMES[7]);
  enunciado(d, pi, "Ouça a parlenda e escolha a palavra que <b>fecha a rima</b>.", "p8enun");
  var L = ST.folha.p8;
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r8_" + i;
    var box = item(i + 1);
    var lin = el("div", "parlenda");
    lin.innerHTML = esc(it.t).replace("###", '<span class="lacuna">?</span>');
    box.appendChild(lin);
    box.appendChild(botaoSom("Ouvir a parlenda", (function(k){ return function(){ falar(k); }; })("parl_" + i)));
    opcoes(box, pi, id, it.op.map(function(w){
      return {v: w, rot: esc(w.toUpperCase()), aria: w, fala: "pal_" + w};
    }), it.c, "grande", "certo8_" + i, "dica8_" + i, function(b){
      var lc = lin.querySelector(".lacuna");
      if(lc){ lc.className = "lacuna cheia"; lc.innerHTML = b.textContent; }
    });
    fechaItem(d, box, id, 0);
  }
}

/* 9 — ESCREVA A PALAVRA QUE RIMA
   ⚠️ AS DUAS PORTAS (regra do Marcos): teclado na tela E teclado de verdade.
   No PC da escola tem teclado e a criança vai digitar; no celular, não tem. */
function f9(d, pi){
  faixa(d, pi, NOMES[8]);
  enunciado(d, pi, "<b>Escreva</b> a palavra que rima com a figura.", "p9enun");
  var L = ST.folha.p9;
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r9_" + i;
    var box = item(i + 1);
    box.appendChild(chamada(it.f, "rima com:"));
    (function(it2, id2, box2){
      registra(id2, pi, it2.c);
      var q = el("div", "sq vaga larga" + (ST.resp[id2] ? " ok" : ""), ST.resp[id2] ? it2.c : "");
      q.id = id2; q.setAttribute("role", "button"); q.setAttribute("tabindex", "0");
      q.setAttribute("data-qa", "vaga-" + id2);
      q.setAttribute("aria-label", "Escreva a palavra que rima com " + esc(it2.f));
      q.onclick = function(){
        if(ST.resp[id2]) return;
        sPasso();
        ativa(q, it2.c, id2, "certo9_" + it2.f, "dica9_" + it2.f);
        document.getElementById("tkDica").textContent = "Escreva a palavra que rima";
      };
      q.onkeydown = function(ev){ if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); q.onclick(); } };
      var lin = el("div", "linhaop"); lin.appendChild(q); box2.appendChild(lin);
    })(it, id, box);
    fechaItem(d, box, id, 0);
  }
}

/* 10 — A RIMA QUE EU ESCOLHI (o fecho, e ele GUARDA o que ela fez)
   ⭐ Regra 11 da pesquisa: a tela final mostra o que a CRIANÇA fez, não só a
   nota. Aqui ela monta o próprio mural de rimas, e ele fica no relatório. */
function f10(d, pi){
  faixa(d, pi, NOMES[9]);
  enunciado(d, pi, "Toque nos pares que você mais gostou. Eles vão para o seu <b>mural de rimas</b>.", "p10enun");
  var L = ST.folha.p10;
  var mural = el("div", "mural");
  for(var i = 0; i < L.length; i++){
    var it = L[i], id = "r10_" + i;
    registra(id, pi, it.par);
    (function(it2, id2){
      var cartao = el("button", "cartaorima",
        img(it2.f, "figop") + '<span class="rotop">' + esc(it2.f.toUpperCase()) + "</span>" +
        '<span class="mais">+</span>' +
        img(it2.par, "figop") + '<span class="rotop">' + esc(it2.par.toUpperCase()) + "</span>");
      cartao.setAttribute("data-qa", "mural-" + id2);
      cartao.setAttribute("aria-label", it2.f + " e " + it2.par);
      cartao.onclick = function(){
        if(ST.resp[id2]) return;
        sPasso(); falar("pal_" + it2.f);
        setTimeout(function(){ falar("pal_" + it2.par); }, 700);
        cartao.className = "cartaorima escolhido";
        acertou(id2, "certo10_" + it2.f);
      };
      if(ST.resp[id2]) cartao.className = "cartaorima escolhido";
      mural.appendChild(cartao);
    })(it, id);
  }
  d.appendChild(mural);
}
function riscoDeCircular(grade, botoes, alterna){
  var cv = document.createElement("canvas");
  cv.className = "riscocv"; grade.appendChild(cv);
  var ctx = cv.getContext("2d"), pts = [], riscando = false;
  function tamanho(){
    var r = grade.getBoundingClientRect();
    if(!r.width) return;
    cv.width = r.width; cv.height = r.height;
    cv.style.width = r.width + "px"; cv.style.height = r.height + "px";
  }
  function pinta(){
    ctx.clearRect(0, 0, cv.width, cv.height);
    if(pts.length < 2) return;
    ctx.strokeStyle = "#e0562f"; ctx.lineWidth = 5;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for(var k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y);
    ctx.stroke();
  }
  function ponto(ev){
    var r = cv.getBoundingClientRect();
    return {x: ev.clientX - r.left, y: ev.clientY - r.top};
  }
  grade.addEventListener("pointerdown", function(ev){
    if(ev.pointerType === "touch") return;      /* no dedo, tocar já resolve */
    tamanho(); riscando = true; pts = [ponto(ev)];
    cv.className = "riscocv ativo";
    try { grade.setPointerCapture(ev.pointerId); } catch(e){}
  });
  grade.addEventListener("pointermove", function(ev){
    if(!riscando) return;
    pts.push(ponto(ev)); pinta();
  });
  function fim(){
    if(!riscando) return;
    riscando = false; cv.className = "riscocv";
    var comp = 0, k;
    for(k = 1; k < pts.length; k++)
      comp += Math.abs(pts[k].x - pts[k-1].x) + Math.abs(pts[k].y - pts[k-1].y);
    if(comp > 60){
      var r0 = cv.getBoundingClientRect(), w;
      for(w in botoes){
        var rb = botoes[w].getBoundingClientRect();
        if(dentro(pts, rb.left - r0.left + rb.width / 2, rb.top - r0.top + rb.height / 2)) alterna(w);
      }
    }
    pts = []; ctx.clearRect(0, 0, cv.width, cv.height);
  }
  grade.addEventListener("pointerup", fim);
  grade.addEventListener("pointercancel", fim);
  grade.addEventListener("pointerleave", fim);
}
/* ponto dentro do rabisco: conta quantas vezes uma reta para a direita cruza o
   traço (fechando o último ponto no primeiro). Ímpar = está dentro. */
function dentro(pts, x, y){
  var n = pts.length, cruz = false, i, j;
  if(n < 3) return false;
  for(i = 0, j = n - 1; i < n; j = i++){
    var yi = pts[i].y, yj = pts[j].y, xi = pts[i].x, xj = pts[j].x;
    if(((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) cruz = !cruz;
  }
  return cruz;
}

/* ============ 4 — CIRCULE QUEM COMEÇA IGUAL (sílaba inicial) ============
   Da folha: *"circule os desenhos que se iniciam com a sílaba CA"* (d12/d02). */var LAPIS = [
  {n: "roxo",    c: "#7c3aed", claro: "#ede9fe"},
  {n: "laranja", c: "#ea580c", claro: "#ffedd5"},
  {n: "verde",   c: "#0f9d58", claro: "#dcfce7"},
  {n: "rosa",    c: "#db2777", claro: "#fce7f3"}
];
var LAPIS_ESCOLHIDO = 0;

function estojo(pai){
  var cx = el("div", "estojo");
  cx.appendChild(el("span", "rot", "Escolha a cor:"));
  LAPIS.forEach(function(L, k){
    var b = el("button", "lapis" + (k === LAPIS_ESCOLHIDO ? " esc" : ""));
    b.style.background = L.c;
    b.setAttribute("aria-label", "Canetinha " + L.n);
    b.setAttribute("data-qa", "lapis-" + L.n);
    b.onclick = function(){
      LAPIS_ESCOLHIDO = k; sPasso();
      var ir = cx.childNodes, j;
      for(j = 1; j < ir.length; j++) ir[j].className = "lapis" + (j - 1 === k ? " esc" : "");
    };
    cx.appendChild(b);
  });
  pai.appendChild(cx);
}
function montaLigar(caixa, pi, tag, pares, pagina){
  var box = el("div", "ligar"), ce = el("div", "col"), cd = el("div", "col");
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("class", "linhas");
  box.appendChild(ce); box.appendChild(cd); box.appendChild(svg); caixa.appendChild(box);
  var ordem = baralha(pares.map(function(_, i){ return i; }));
  var E = {}, D = {}, marcada = null;
  pares.forEach(function(P){ registra("l" + pi + tag + "_" + P.k, pi, P.k); });
  function centro(e, lado){
    var r = e.getBoundingClientRect(), b = box.getBoundingClientRect();
    return {x: (lado === "e" ? r.right : r.left) - b.left, y: r.top + r.height / 2 - b.top};
  }
  /* ⭐ O TRAÇO (pedido do Marcos, set/2026: *"melhore o traço que liga para
     parecer mais profissional"*). Antes era um segmento reto de ponta a ponta.
     Agora é uma CURVA suave — sai na horizontal de cada caixa e vira no meio,
     como o cabo de um painel — com um halo branco por baixo (para o traço não
     sumir quando passa por cima de outra caixa) e um pontinho cheio em cada
     ponta, que é o que dá o acabamento de "ligado". */
  function linha(a, b2, cor){
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var dx = Math.max(28, Math.abs(b2.x - a.x) * 0.45);
    var d = "M" + a.x + "," + a.y +
            " C" + (a.x + dx) + "," + a.y +
            " " + (b2.x - dx) + "," + b2.y +
            " " + b2.x + "," + b2.y;
    var halo = document.createElementNS("http://www.w3.org/2000/svg", "path");
    halo.setAttribute("d", d); halo.setAttribute("fill", "none");
    halo.setAttribute("stroke", "#ffffff"); halo.setAttribute("stroke-width", 11);
    halo.setAttribute("stroke-linecap", "round");
    var l = document.createElementNS("http://www.w3.org/2000/svg", "path");
    l.setAttribute("d", d); l.setAttribute("fill", "none");
    l.setAttribute("stroke", cor); l.setAttribute("stroke-width", 6);
    l.setAttribute("stroke-linecap", "round");
    g.appendChild(halo); g.appendChild(l);
    [a, b2].forEach(function(p){
      var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", 6);
      c.setAttribute("fill", cor); c.setAttribute("stroke", "#fff"); c.setAttribute("stroke-width", 2.5);
      g.appendChild(c);
    });
    svg.appendChild(g); return g;
  }
  function desmarca(){ if(marcada) marcada.el.className = marcada.el.className.replace(" marcada", ""); marcada = null; }
  function redesenha(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    for(var k in E) if(ST.lig["l" + pi + tag + "_" + k]) linha(centro(E[k].el, "e"), centro(D[k].el, "d"), "#15a34a");
  }
  aoAbrir(pagina, redesenha);
  window.addEventListener("resize", function(){ if(pagina.className.indexOf("viva") > -1) redesenha(); });
  function fecha(Re, Rd){
    var id = "l" + pi + tag + "_" + Re.k;
    if(Rd.k === Re.k){
      ST.lig[id] = 1; tentativa(id, true); ST.resp[id] = 1; salvar();
      Re.el.className += " feita"; Rd.el.className += " feita"; desmarca(); redesenha(); sCerto();
      falar(Re.fc); setTimeout(function(){ confereFolha(pi); }, 850);
    } else {
      tentativa(id, false); sErro();
      Rd.el.className += " treme";
      setTimeout(function(){ Rd.el.className = Rd.el.className.replace(" treme", ""); }, 500);
      falar(ST.tent[id].erros >= 2 ? Re.dica : "quase");
      if(ST.tent[id].erros >= 2 && D[Re.k].el.className.indexOf("feita") < 0) D[Re.k].el.className += " mostra";
    }
  }
  pares.forEach(function(P){
    var e = el("div", "ponta" + (ST.lig["l" + pi + tag + "_" + P.k] ? " feita" : ""), P.esq);
    e.setAttribute("role", "button"); e.setAttribute("tabindex", "0");
    e.setAttribute("data-qa", "lig" + tag + "-e-" + P.k);
    e.setAttribute("aria-label", esc(P.w));
    var R = {k: P.k, el: e, fc: P.fc, dica: P.dica};
    E[P.k] = R;
    e.addEventListener("pointerdown", function(ev){
      if(e.className.indexOf("feita") > -1) return;
      ev.preventDefault(); desmarca(); marcada = R; e.className += " marcada"; sPasso(); falar(P.fe);
    });
    e.onkeydown = function(ev){ if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); desmarca(); marcada = R; e.className += " marcada"; falar(P.fe); } };
    ce.appendChild(e);
  });
  ordem.forEach(function(j){
    var P = pares[j];
    var e = el("div", "ponta" + (ST.lig["l" + pi + tag + "_" + P.k] ? " feita" : ""), P.dir);
    e.setAttribute("role", "button"); e.setAttribute("tabindex", "0");
    e.setAttribute("data-qa", "lig" + tag + "-d-" + P.k);
    e.setAttribute("aria-label", esc(P.wd || P.k));
    var R = {k: P.k, el: e}; D[P.k] = R;
    e.addEventListener("pointerdown", function(ev){
      if(e.className.indexOf("feita") > -1) return;
      ev.preventDefault();
      if(marcada) fecha(marcada, R); else { sPasso(); falar(P.fd); falarDepois("ligue", 900); }
    });
    e.onkeydown = function(ev){ if((ev.key === "Enter" || ev.key === " ") && marcada){ ev.preventDefault(); fecha(marcada, R); } };
    cd.appendChild(e);
  });
}

/* ---------- teclado de letras (folha 8) ---------- */function ativa(q, certa, id, fc, fd){
  if(ATIVA) fechaAtiva();
  ATIVA = {q: q, val: "", certa: certa, id: id, fc: fc, fd: fd};
  q.className = "sq vaga ativa";
  q.innerHTML = '<span class="v"></span><span class="cursor"></span>';
  document.getElementById("teclado").className = "aberto";
  document.getElementById("tkDica").textContent = "Escreva a sílaba que falta";
  falar("escreva");
}
function fechaAtiva(){
  if(!ATIVA) return;
  if(!ST.resp[ATIVA.id]){ ATIVA.q.className = "sq vaga"; ATIVA.q.textContent = ""; }
  ATIVA = null; document.getElementById("teclado").className = "";
}
function digita(ch){
  if(!ATIVA) return;
  sTecla();
  if(ch === "ap") ATIVA.val = ATIVA.val.slice(0, -1);
  else if(ch === "ok") return confereSil();
  else { if(ATIVA.val.length >= 4) return; ATIVA.val += ch; }
  var v = ATIVA.q.querySelector(".v"); if(v) v.textContent = ATIVA.val;
  if(ATIVA.val.length >= ATIVA.certa.length) setTimeout(confereSil, 380);
}
function confereSil(){
  if(!ATIVA || !ATIVA.val) return;
  var A = ATIVA;
  if(A.val === A.certa){
    A.q.className = "sq ok"; A.q.textContent = A.certa;
    ATIVA = null; document.getElementById("teclado").className = "";
    acertou(A.id, A.fc);
    var it = A.q.parentNode.parentNode; if(it) it.className = "item feito";
  } else {
    A.val = ""; var v = A.q.querySelector(".v"); if(v) v.textContent = "";
    errou(A.id, A.fd);
  }
}
(function(){
  var tk = document.getElementById("tk");
  var letras = "ABCDEFGHIJLMNOPQRSTUVXZÇÃ".split("");
  letras.forEach(function(L){
    var b = el("button", null, L);
    b.setAttribute("aria-label", "Letra " + L);
    b.onclick = function(){ digita(L); };
    tk.appendChild(b);
  });
  var ap = el("button", "ap", "apagar"); ap.setAttribute("aria-label", "Apagar");
  ap.onclick = function(){ digita("ap"); }; tk.appendChild(ap);
  var ok = el("button", "ok", "OK"); ok.setAttribute("aria-label", "Confirmar");
  ok.onclick = function(){ digita("ok"); }; tk.appendChild(ok);
})();
document.addEventListener("keydown", function(ev){
  if(!ATIVA) return;
  if(document.activeElement && document.activeElement.id === "nomeIn") return;
  var k = (ev.key || "").toUpperCase();
  if(k.length === 1 && "ABCDEFGHIJLMNOPQRSTUVXZÇÃ".indexOf(k) > -1){ ev.preventDefault(); digita(k); }
  else if(ev.key === "Backspace"){ ev.preventDefault(); digita("ap"); }
  else if(ev.key === "Enter"){ ev.preventDefault(); digita("ok"); }
  else if(ev.key === "Escape"){ fechaAtiva(); }
});

/* ---------- folha pronta e navegação ---------- */
function idsDaPagina(pi){
  var ids = [], i, k, F = ST.folha;
  if(pi === 1) for(i = 0; i < F.p1.length; i++) ids.push("r1_" + i);
  if(pi === 2) for(i = 0; i < F.p2.length; i++) ids.push("r2_" + i);
  if(pi === 3) for(i = 0; i < F.p3.length; i++) ids.push("r3_" + i);
  if(pi === 4) for(i = 0; i < F.p4.length; i++) ids.push("r4_" + i);
  if(pi === 5) for(i = 0; i < F.p5.length; i++) ids.push("r5_" + i);
  if(pi === 6) for(i = 0; i < F.p6.length; i++) ids.push("r6_" + i);
  if(pi === 7) for(i = 0; i < F.p7.length; i++) for(k = 0; k < F.p7[i].length; k++)
    ids.push("l7l7g" + i + "_" + F.p7[i][k].e);
  if(pi === 8) for(i = 0; i < F.p8.length; i++) ids.push("r8_" + i);
  if(pi === 9) for(i = 0; i < F.p9.length; i++) ids.push("r9_" + i);
  if(pi === 10) for(i = 0; i < F.p10.length; i++) ids.push("r10_" + i);
  return ids;
}
function pendentes(pi){
  var ids = idsDaPagina(pi), n = 0, i;
  for(i = 0; i < ids.length; i++) if(!ST.resp[ids[i]]) n++;
  return n;
}
function confereFolha(pi){
  if(pendentes(pi) > 0 || ST.prontas[pi]) return;
  ST.prontas[pi] = 1; salvar();
  PAGEL[pi].className += " pronta"; sFesta(); confete(24);
  if(pi < PAGEL.length - 1){ falar("folhaPronta"); setTimeout(function(){ if(ST.pag === pi) vaiPara(pi + 1); }, 2400); }
  else setTimeout(fim, 1400);
  atualizaNav();
}
/* ⚠️ O nome NÃO se repete na capa (pedido do Marcos, set/2026: *"o nome ao
   digitar não precisa aparecer lá em cima na capa"*). Ele já aparece dentro do
   campo onde a criança digita; escrever de novo lá em cima era eco, e ainda
   empurrava a capa para baixo. Aqui só se mantém o campo em dia com o estado
   (importa ao retomar de onde parou). */
function espelhaNome(t){
  var i = document.getElementById("nomeIn"); if(i && i.value !== t) i.value = t;
}
function vaiPara(pi){
  calar(); fechaAtiva();
  document.getElementById("barraCapa").className = pi === 0 ? "aberta" : "";
  if(pi === 0) espelhaNome(ST.nome || "");
  document.getElementById("fim").style.display = "none";
  document.getElementById("retomar").style.display = "none";
  document.getElementById("nav").style.display = pi === 0 ? "none" : "flex";
  for(var i = 0; i < PAGEL.length; i++) PAGEL[i].className = PAGEL[i].className.replace(" viva", "");
  ST.pag = pi; salvar();
  var d = PAGEL[pi]; d.className += " viva";
  if(pi > 0) window.scrollTo(0, 0);
  if(d._aoAbrir) for(var z = 0; z < d._aoAbrir.length; z++) (function(fn){ setTimeout(fn, 60); })(d._aoAbrir[z]);
  atualizaNav();
  falarDepois(pi === 0 ? "capa" : "p" + pi + "enun", 280);
}
function atualizaNav(){
  var pi = ST.pag, total = PAGEL.length;
  document.getElementById("pg").textContent = pi === 0 ? "Capa" : "Folha " + pi + " de " + (total - 1);
  var feitas = 0, k; for(k in ST.prontas) feitas++;
  document.getElementById("progI").style.width = (feitas / (total - 1) * 100) + "%";
  document.getElementById("bAnt").disabled = pi === 0;
  var prox = document.getElementById("bProx");
  prox.style.visibility = pi === 0 ? "hidden" : "visible";
  var pend = pi > 0 ? pendentes(pi) : 0;
  prox.innerHTML = pi === total - 1 ? (pend ? "Faltam " + pend : "Ver o resultado")
    : (pend ? "Faltam " + pend + '<i class="seta dir"></i>' : 'Próxima<i class="seta dir"></i>');
  prox.className = pend ? "bt cinza" : "bt verde";
  document.getElementById("navTxt").textContent = pi === 0 ? "" : NOMES[pi - 1];
}

/* ---------- fim: boletim, medalha e relatório ---------- */
/* ⭐⭐ O FECHO A QUALQUER MOMENTO (12/set/2026).
   O Marcos fixou a sequência em no mínimo 25 folhas, e a medida deu razão a ele:
   é o que enche os 55 min da criança RÁPIDA. Só que a criança DEVAGAR leva ~85
   min nas mesmas 25 folhas — ela não termina. E até aqui o boletim, o parecer, a
   medalha e o relatório só existiam DEPOIS da última folha: quem mais precisa do
   elogio seria a única a nunca vê-lo.

   Agora a criança fecha o caderno quando quiser (botão "Terminar", na barra de
   baixo) e vê o boletim DO QUE ELA FEZ.

   ⚠️ E o boletim conta só o que ela TENTOU. Folha que ela não chegou a abrir
      aparece como "ainda não" — jamais como 0 de 8, que transformaria o fecho
      num boletim de defeitos justamente para quem foi mais devagar. */
function fim(){
  calar();
  /* quantas folhas ela chegou a tocar, e quantas ficaram para depois */
  var abertas = 0, naoAbertas = [], pp;
  for(pp = 1; pp <= NOMES.length; pp++){
    var idp = idsDaPagina(pp), algum = false, z;
    for(z = 0; z < idp.length; z++) if(ST.tent[idp[z]]) { algum = true; break; }
    if(algum) abertas++; else naoAbertas.push(pp);
  }
  var completo = naoAbertas.length === 0;
  var tf = document.getElementById("fimTit");
  if(tf) tf.textContent = completo ? "Caderno completo!" : "O seu boletim de hoje";
  var bv = document.getElementById("bVoltar");
  if(bv) bv.style.display = completo ? "none" : "";
  for(var i = 0; i < PAGEL.length; i++) PAGEL[i].className = PAGEL[i].className.replace(" viva", "");
  document.getElementById("nav").style.display = "none";
  var f = document.getElementById("fim"); f.style.display = "block";
  /* ⚠️ o denominador é o que ela TENTOU, não o caderno inteiro: a estrela tem
     de falar do trabalho dela, não do tempo que a aula tinha. */
  var tot = 0, prim = 0, pi;
  for(pi = 1; pi <= NOMES.length; pi++){
    var ids = idsDaPagina(pi);
    for(var j = 0; j < ids.length; j++){
      var t = ST.tent[ids[j]];
      if(!t) continue;
      tot++;
      if(t.erros === 0 && t.ok) prim++;
    }
  }
  var pc = tot ? prim / tot : 0;
  var cheias = pc >= .85 ? 3 : pc >= .6 ? 2 : 1, est = "", ke;
  for(ke = 0; ke < 3; ke++)
    est += '<img src="img/ri_estrela' + (ke < cheias ? "" : "_off") + '.png?v=' + VIMG + '" alt="" draggable="false">';
  document.getElementById("estrelas").innerHTML = est;
  document.getElementById("estrelas").setAttribute("aria-label", cheias + " de 3 estrelas");
  var bar = document.getElementById("barras"); bar.innerHTML = "";
  for(pi = 1; pi <= NOMES.length; pi++){
    (function(pi){
      var ids = idsDaPagina(pi), t = ids.length, p = 0, nt = 0, j;
      for(j = 0; j < ids.length; j++){
        var tt = ST.tent[ids[j]];
        if(tt) nt++;
        if(tt && tt.erros === 0 && tt.ok) p++;
      }
      /* folha que ela não abriu não vira zero: vira "ainda não" */
      if(nt === 0){
        bar.appendChild(el("div", "barra naoabriu",
          "<span>" + NOMES[pi - 1] + "</span><div class='tr'></div><b>ainda não</b>"));
        return;
      }
      var b = el("div", "barra", "<span>" + NOMES[pi - 1] + "</span><div class='tr'><i></i></div><b>" + p + "/" + nt + "</b>");
      bar.appendChild(b);
      setTimeout(function(){ b.querySelector("i").style.width = (nt ? p / nt * 100 : 0) + "%"; }, 400);
    })(pi);
  }
  /* ⭐ O PARECER DA CRIANÇA (mudança de set/2026 — ver o bloco dos OBJETIVOS).
     O currículo de Blumenau diz que a avaliação orienta *"o professor E O
     ESTUDANTE acerca de quais objetivos foram alcançados"*, e que *"mostrar o
     que sabe ou o que não sabe é pertinente, faz parte do crescimento e não da
     exclusão"*. Então ela vê o que já sabe — na linguagem dela, sem número,
     sem a palavra "errou" e sem porcentagem.
     ⚠️ A ORDEM IMPORTA: primeiro o que ela JÁ SABE, sempre; o "vale treinar" vem
     depois e no máximo dois, senão a lista vira boletim de defeitos. */
  var jaSabe = [], treinar = [], q;
  for(q = 0; q < OBJETIVOS.length; q++){
    var Oq = OBJETIVOS[q], mq = mede(Oq.f);
    /* ⚠️ objetivo que ela NÃO CHEGOU a tentar não entra no "vale treinar":
       seria cobrar dela a folha que a aula não deu tempo de alcançar. */
    if(mq.tot === 0 || !mq.tent) continue;
    var pcq = Math.round(100 * mq.prim / mq.tent);
    (pcq >= 75 ? jaSabe : treinar).push(pcq >= 75 ? Oq.ok : Oq.n.toLowerCase());
  }
  var txt = "";
  /* ⚠️ "Você JÁ ..." e não "Você já SABE ..." (set/2026, achado na leitura da
     tela de fim). Os textos dos OBJETIVOS estão escritos em terceira pessoa
     ("junta os dois pedaços", "conta as palmas") — que em português é a MESMA
     forma de "você". Com o "sabe" no meio saía "Você já sabe junta os dois
     pedaços", e era a PRIMEIRA frase que a criança lia no fim do caderno. */
  if(jaSabe.length) txt = "Você já " + jaSabe.slice(0, 3).join("; ") + ".";
  else txt = "Você começou a ouvir o fim das palavras — isso é o mais difícil!";
  if(treinar.length) txt += " Vale treinar mais: " + treinar.slice(0, 2).join(" e ") + ".";
  /* ⭐ o quanto ela andou é FATO e entra celebrado, nunca como cobrança */
  if(!completo)
    txt = "você fez " + abertas + " de " + NOMES.length + " folhas hoje — e olhe o "
        + "que já dá para ver: " + txt.charAt(0).toLowerCase() + txt.slice(1);
  /* ⚠️ DEFEITO ANTIGO, achado ao testar o fecho (12/set/2026): sem nome digitado
     a linha saía **"Você, você já entende…"** — o prefixo caía no "Você" e o
     texto do parecer também começa com "Você". Só aparecia para a criança que
     não escreve o nome na capa, que é justamente a que mais precisa que a tela
     fale direito com ela. Sem nome, não há prefixo. */
  var quem = (ST.nome || "").replace(/^\s+|\s+$/g, "");
  document.getElementById("resumo").innerHTML = quem
    ? "<b>" + esch(quem) + "</b>, " + txt.charAt(0).toLowerCase() + txt.slice(1)
    : txt.charAt(0).toUpperCase() + txt.slice(1);
  sFesta(); confete(40); falar("fim");
}
(function(){
  var m = document.getElementById("medalha"), t = null;
  function segura(){ t = setTimeout(function(){ abreRelatorio(); }, 2000); }
  function larga(){ if(t){ clearTimeout(t); t = null; } }
  m.addEventListener("pointerdown", segura);
  m.addEventListener("pointerup", larga);
  m.addEventListener("pointerleave", larga);
  m.addEventListener("pointercancel", larga);
})();
/* ============================================================
   O QUE A ATIVIDADE MEDE — e como isso vira PARECER e NOTA

   ⭐ PEDIDO DO MARCOS (set/2026): *"acho interessante ter um relatório, tipo uma
   avaliação descritiva sobre o que o aluno conseguiu dominar nesses objetivos
   das atividades"* e *"algo que dê para converter em nota"*.

   ⭐⭐ E A REGRA DA CASA MUDOU AQUI — o Marcos mandou conferir e ele tinha razão:
   *"essa regra pode ser alterada, consulta do pedagogo e do currículo seria
   interessante"*. Fui ao currículo de Blumenau e ele diz, com todas as letras:

     · a avaliação *"está a serviço de orientar o professor E O ESTUDANTE acerca
       de quais objetivos de aprendizagem foram alcançados"* — o estudante é
       destinatário da avaliação, não só o professor;
     · e, citado com aprovação (Pinto, 2016, p. 120): *"na perspectiva do sujeito
       histórico-cultural, MOSTRAR O QUE SABE OU O QUE NÃO SABE É PERTINENTE,
       faz parte do crescimento e NÃO DA EXCLUSÃO"*.

   Ou seja: esconder da criança o que ela domina não era exigência pedagógica —
   era escolha nossa, e o currículo aponta para o contrário. Então a criança
   PASSA A VER o parecer dela, na linguagem dela.

   ⚠️ O QUE NÃO MUDA É O NÚMERO. A Instrução Normativa SEMED nº 1/2017, art. 3º,
   citada no currículo, manda avaliar *"com PREPONDERÂNCIA DOS ASPECTOS
   QUALITATIVOS SOBRE OS QUANTITATIVOS"*. Então o parecer vai para a criança e a
   NOTA fica com o professor: não por medo do número, mas porque o currículo diz
   qual dos dois deve pesar na frente dela.

   ⚠️ E O CRITÉRIO DA NOTA É EXPOSTO POR EXIGÊNCIA, não por capricho: a mesma
   Instrução manda *"a exposição de critérios utilizados em cada um dos
   instrumentos avaliativos"*. Por isso a linha "1,0 de primeira, 0,6 com ajuda"
   aparece impressa no relatório.

   ⚠️ E NÃO SE CONTA TUDO IGUAL. Quem acerta de primeira e quem acerta depois de
   duas dicas não sabem a mesma coisa. Acerto de primeira vale 1,0; acerto com
   ajuda vale 0,6. O relatório mostra os dois números lado a lado, para o
   professor ver a nota E o esforço que ela custou.
   ============================================================ */
var PESO_PRIMEIRA = 1.0, PESO_COM_AJUDA = 0.6;

/* OS OBJETIVOS — e quais folhas medem cada um.
   ⚠️ Isto NÃO é a lista de folhas: é a lista do que a criança tem que SABER.
   Duas folhas podem medir a mesma coisa com gestos diferentes, e para o
   professor interessa o que ela domina, não em qual tela. */
var OBJETIVOS = [
  {n: "Perceber que duas palavras rimam", f: [1],
   ok: "ouve duas palavras e sabe dizer se terminam igual",
   nao: "ainda não separa o som do fim do resto da palavra"},
  {n: "Reconhecer a rima entre opções", f: [2, 3, 6],
   ok: "acha, entre três, a palavra que rima com a figura",
   nao: "ainda escolhe pelo desenho ou pelo sentido, não pelo som"},
  {n: "O critério: rima é o FIM, não o começo", f: [4],
   ok: "não cai na pegadinha — sabe que começar igual não é rimar",
   nao: "confunde começo com fim (o erro de achar que BOLA rima com BOLSA)"},
  {n: "Procurar o par numa lista", f: [5, 7],
   ok: "acha sozinha o par que rima no meio de várias figuras",
   nao: "reconhece a rima quando lhe mostram, mas ainda não a procura"},
  {n: "A rima na parlenda (oralidade)", f: [8],
   ok: "completa o verso com a palavra que fecha a rima",
   nao: "ainda não usa o ritmo do verso para prever a palavra"},
  {n: "Produzir a palavra que rima", f: [9],
   ok: "escreve, sem opções na tela, uma palavra que rima",
   nao: "reconhece a rima, mas ainda não a produz sozinha"}
];

/* mede um objetivo: devolve acertos de primeira, com ajuda, total e pontos */
function mede(folhas){
  var prim = 0, ajuda = 0, tot = 0, tentados = 0, k, j;
  for(k = 0; k < folhas.length; k++){
    var ids = idsDaPagina(folhas[k]);
    tot += ids.length;
    for(j = 0; j < ids.length; j++){
      var t = ST.tent[ids[j]];
      if(t) tentados++;      /* ⭐ o que ela chegou a tocar */
      if(!t || !t.ok) continue;
      if(t.erros === 0) prim++; else ajuda++;
    }
  }
  return {prim: prim, ajuda: ajuda, tot: tot, tent: tentados,
          pontos: prim * PESO_PRIMEIRA + ajuda * PESO_COM_AJUDA,
          pc: tot ? Math.round(100 * prim / tot) : 0};
}

function abreRelatorio(){
  var r = document.getElementById("relatorio");
  var linhas = "", domina = [], retomar = [], k;
  var pontos = 0, total = 0, primG = 0, ajudaG = 0, tentG = 0;
  var naoAlcancou = [];
  /* ⭐ ATÉ ONDE ELA CHEGOU — o professor precisa saber disto ANTES de ler
     qualquer porcentagem (ver a coluna "do que fez", logo abaixo). */
  var folhasFeitas = 0, fz;
  for(fz = 1; fz <= NOMES.length; fz++){
    var idf = idsDaPagina(fz), tocou = false, y;
    for(y = 0; y < idf.length; y++) if(ST.tent[idf[y]]) { tocou = true; break; }
    if(tocou) folhasFeitas++;
  }
  var inteiro = folhasFeitas >= NOMES.length;

  for(k = 0; k < OBJETIVOS.length; k++){
    var O = OBJETIVOS[k], m = mede(O.f);
    pontos += m.pontos; total += m.tot; primG += m.prim; ajudaG += m.ajuda;
    tentG += m.tent;
    /* ⚠️ 75% é a ÚNICA linha que decide, e as duas listas são complementares:
       um objetivo não pode aparecer em "domina" e em "retomar" ao mesmo tempo —
       para o professor isso não é informação, é ruído. */
    /* ⚠️⚠️ O QUE DECIDE É O QUE ELA FEZ (12/set/2026). Antes, num caderno não
       terminado, o objetivo cujas folhas ela nem alcançou entrava em "retomar"
       com 0% — e o parecer do professor dizia "precisa retomar" de uma criança
       que tinha ido bem no que deu tempo de fazer. Isso é pior que não ter
       parecer: é um julgamento errado com cara de medida.
       Objetivo que ela NÃO TOCOU não entra em lista nenhuma; os que ela tocou
       são julgados pelo desempenho DELES. */
    var pcObj = m.tent ? Math.round(100 * m.prim / m.tent) : -1;
    if(pcObj < 0) naoAlcancou.push(O.n.toLowerCase());
    else if(pcObj >= 75) domina.push(O.ok);
    else retomar.push(O.n.toLowerCase() + " (" + pcObj + "%)");
    /* ⭐ A COLUNA "DO QUE FEZ" (12/set/2026) — nasceu junto com o fecho a
       qualquer momento. Sem ela o relatório MENTE num caderno não terminado: a
       criança que fez 4 folhas de 15, e as fez bem, aparecia com 27% — o
       professor leria "precisa retomar" de quem na verdade só ficou sem tempo.
       A coluna da direita mostra o desempenho SÓ no que ela chegou a responder. */
    var pcf = m.tent ? Math.round(100 * m.prim / m.tent) : 0;
    linhas += "<tr><td>" + esch(O.n) + "</td><td>" + m.prim + "/" + m.tot +
      "</td><td><b>" + m.pc + "%</b></td><td>" +
      (m.tent ? "<b>" + pcf + "%</b> <small>(" + m.prim + "/" + m.tent + ")</small>"
              : "<small>não fez</small>") + "</td><td>" + m.ajuda + "</td></tr>";
  }

  /* ⭐ A NOTA. É de 0 a 10, com um decimal, e sai dos PONTOS — não dos acertos
     crus: 1,0 de primeira, 0,6 com ajuda. */
  /* ⚠️ A NOTA DE UM CADERNO NÃO TERMINADO SE MEDE NO QUE FOI FEITO. Dividir
     pelos itens que ela nunca viu dá uma nota que não fala dela — fala do
     relógio. Quando o caderno está completo, os dois denominadores são o
     mesmo número e nada muda. */
  var baseNota = inteiro ? total : tentG;
  var nota = baseNota ? Math.round(100 * pontos / baseNota) / 10 : 0;
  var pc = baseNota ? Math.round(100 * primG / baseNota) : 0;
  var conceito = !baseNota ? "Sem dados" :
    nota >= 8.5 ? "Dominou" : nota >= 6 ? "Está construindo" : "Precisa retomar";
  if(!inteiro) conceito += " (parcial)";

  /* ⭐ O PARECER EM PALAVRAS — a "avaliação descritiva" que o Marcos pediu.
     Não é uma frase de efeito: é a lista do que ela SABE FAZER, escrita como o
     professor escreveria no parecer bimestral. */
  var nome = esch(ST.nome || "O aluno");
  var parecer = nome + " ";
  if(domina.length && !retomar.length && !naoAlcancou.length)
    parecer += "domina a rima em todos os degraus avaliados: " + domina.join("; ") + ".";
  else if(domina.length)
    parecer += "já " + domina.join("; ") + ". Ainda precisa retomar: " + retomar.join(", ") + ".";
  else
    parecer += "está começando a construir a noção de rima. Nenhum objetivo chegou a 75% " +
      "de acerto de primeira — vale retomar oralmente, com parlendas e cantigas, antes de " +
      "voltar à tela.";


  /* ⚠️ o que a aula não deu tempo de alcançar é INFORMAÇÃO para o professor,
     nunca falha da criança — por isso frase própria, e no fim. */
  if(naoAlcancou.length)
    parecer += " Ainda não chegou a fazer (a aula acabou antes): " +
               naoAlcancou.join(", ") + ".";

  var h = "<b>Relatório do professor</b> &mdash; " + nome + " &middot; " +
    Math.round((Date.now() - (ST.inicio || Date.now())) / 60000) + " min" +
    "<div class='notao'><span class='nn'>" + nota.toFixed(1).replace(".", ",") + "</span>" +
    "<span class='nl'><b>" + conceito + "</b><br>" + primG + " de " + baseNota +
    " de primeira (" + pc + "%)<br>" + ajudaG + " com ajuda</span></div>" +
    "<p class='parecer'>" + parecer + "</p>" +
    (inteiro ? "" :
      "<p class='avisoparcial'><b>Caderno não terminado:</b> " + folhasFeitas +
      " de " + NOMES.length + " folhas. A coluna <b>%</b> conta o caderno inteiro; " +
      "a coluna <b>do que fez</b> conta só o que a criança chegou a responder — " +
      "é esta que diz como ela foi.</p>") +
    "<table><tr><th>Objetivo</th><th>De primeira</th><th>%</th>" +
    "<th>do que fez</th><th>Com ajuda</th></tr>" +
    linhas + "</table>" +
    "<p class='comonota'>Nota de 0 a 10: acerto de primeira vale 1,0 e acerto com ajuda vale 0,6. " +
    "A criança não vê este número — ele fica só aqui.</p>";
  r.innerHTML = h; r.style.display = "block"; sPasso();
}
function esch(t){
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------- retomar, chave mestra e a partida ---------- */
var CHAVE_MESTRA = "1275@";
function abreMenuProf(){
  var cx = document.getElementById("mpFolhas");
  if(!cx.childNodes.length){
    var mk = function(rot, alvo){
      var b = el("button", null, rot);
      b.onclick = function(){ fechaMenuProf(); vaiPara(alvo); };
      cx.appendChild(b);
    };
    mk("Capa", 0);
    for(var k = 1; k <= 10; k++) mk(k + ". " + NOMES[k - 1], k);
  }
  calar(); document.getElementById("menuProf").className = "aberto";
}
function fechaMenuProf(){ document.getElementById("menuProf").className = ""; }
document.getElementById("mpFechar").onclick = fechaMenuProf;
document.getElementById("menuProf").onclick = function(ev){ if(ev.target === this) fechaMenuProf(); };
document.getElementById("nomeIn").oninput = function(){
  if(this.value.indexOf(CHAVE_MESTRA) > -1){ this.value = ST.nome || ""; abreMenuProf(); return; }
  ST.nome = this.value.slice(0, 24); espelhaNome(ST.nome); salvar();
};
document.getElementById("nomeIn").onkeydown = function(ev){ if(ev.key === "Enter"){ ev.preventDefault(); this.blur(); } };
document.getElementById("bComecar").onclick = function(){ ac(); sPasso(); if(!ST.inicio) ST.inicio = Date.now(); vaiPara(1); };
document.getElementById("bAnt").onclick = function(){ sPasso(); vaiPara(Math.max(0, ST.pag - 1)); };
document.getElementById("bProx").onclick = function(){
  sPasso();
  if(ST.pag === PAGEL.length - 1 && pendentes(ST.pag) === 0) return fim();
  vaiPara(Math.min(PAGEL.length - 1, ST.pag + 1));
};
document.getElementById("bOuvir").onclick = function(){ ac(); if(ultimaFala) falar(ultimaFala); };
document.getElementById("bVoz").onclick = function(){
  vozLigada = !vozLigada; this.className = vozLigada ? "zap" : "zap off";
  if(!vozLigada) calar(); else falar("vozOn");
};
document.getElementById("bRever").onclick = function(){ sPasso(); vaiPara(1); };
document.getElementById("bRecomecar").onclick = function(){
  sPasso(); try{ localStorage.removeItem(CHAVE_LS); }catch(e){}
  ST = {pag: 0, nome: ST.nome, folha: novaFolha(), resp: {}, lig: {}, tent: {}, prontas: {}, inicio: 0};
  monta(); vaiPara(0); falarDepois("novoCaderno", 400);
};
document.getElementById("bContinuar").onclick = function(){ ac(); sPasso(); vaiPara(ST.pag || 1); };
document.getElementById("bZerar").onclick = function(){ document.getElementById("bRecomecar").onclick(); };

(function boot(){
  var velho = carregar();
  if(velho && velho.folha){
    ST = velho;
    if(!ST.resp) ST.resp = {}; if(!ST.lig) ST.lig = {}; if(!ST.tent) ST.tent = {}; if(!ST.prontas) ST.prontas = {};
    monta();
    document.getElementById("retomar").style.display = "block";
    document.getElementById("retTxt").textContent =
      (ST.nome ? ST.nome + ", você" : "Você") + " parou na folha " + (ST.pag || 1) + ": " + NOMES[(ST.pag || 1) - 1] + ".";
    document.getElementById("nav").style.display = "none";
  } else {
    ST.folha = novaFolha(); monta(); vaiPara(0);
  }
})();

/*<dossie-js>*/
/* ============================================================
   DOSSIÊ PEDAGÓGICO — o que o PROFESSOR vê quando abre a atividade

   ⭐ PEDIDO DO MARCOS (set/2026): *"preciso que quando um professor olhe e
      analise a atividade ele veja que está ótima"*.

   O buraco que isto fecha: o parecer pedagógico de cada caderno existia — mas
   morava num arquivo `.md` DENTRO DO REPOSITÓRIO, que nenhum professor abre.
   Quem olhava a atividade via um joguinho bonito e não tinha como saber se
   aquilo estava alinhado ao currículo da rede. Agora o alinhamento está DENTRO
   da atividade, a um toque — e a qualquer momento, não só no fim.

   ⚠️ E não é texto solto: cada habilidade citada aqui vem do
   `<pasta>/curriculo.json`, e o portão `_qa/pedagogo_curriculo.py` reprova se a frase
   citada não existir, palavra por palavra, no `_curriculo/blumenau.txt`, ou se
   os objetivos do relatório e os do currículo não baterem um a um. Citação de
   currículo é a única coisa que o professor NÃO tem como conferir sozinho sem
   abrir 440 páginas de PDF — por isso ela é medida.

   Abre por dois caminhos: o botão no menu do professor (chave mestra 1275@,
   vale a qualquer hora) e o botão dentro do relatório, no fim.

   Este arquivo é a FONTE: `python3 _padrao/dossie_professor.py <pasta>` injeta o CSS, o
   trecho de tela e este código no caderno. Não editar a cópia injetada.
   ============================================================ */
function dossieCita(s){
  var m = String(s || "").match(/[“"]([^”"]+)[”"]/);
  return m ? m[1] : String(s || "");
}
function dossieHTML(){
  var C = (typeof CURRICULO === "object" && CURRICULO) ? CURRICULO : null;
  if(!C) return "<p>Este caderno ainda não declarou o currículo.</p>";
  var h = "", k, o;
  h += "<p class='dfonte'><b>" + esch(C.componente) + " &middot; " + C.ano +
       "º ano.</b> " + esch(C.rede) + ". As habilidades abaixo estão " +
       "<b>copiadas do documento oficial, palavra por palavra</b> &mdash; nenhuma " +
       "foi reescrita nem resumida.</p>";
  h += "<table><tr><th>O que a atividade mede</th><th>Folhas</th>" +
       "<th>Habilidade do currículo da rede</th></tr>";
  for(k = 0; k < C.objetivos.length; k++){
    o = C.objetivos[k];
    h += "<tr><td>" + esch(o.objetivo) + "</td><td>" + o.folhas.join(", ") +
         "</td><td>&ldquo;" + esch(dossieCita(o.habilidade)) + "&rdquo;" +
         "<span class='dobj'>" + esch(o.pratica) + " &middot; " +
         esch(o.objeto) + "</span></td></tr>";
  }
  h += "</table>";

  h += "<p class='dsub'><b>A escada didática</b> &mdash; uma folha por degrau, e " +
       "nenhuma repete o gesto da anterior:</p><ol class='descada'>";
  for(k = 0; k < NOMES.length; k++) h += "<li>" + esch(NOMES[k]) + "</li>";
  h += "</ol>";

  h += "<p class='dsub'><b>Como a criança é avaliada</b></p>" +
       "<p class='dtxt'>O relatório do professor (no fim, segurando a medalha por " +
       "2 segundos) traz, por objetivo: quantos itens ela acertou <b>de primeira</b>, " +
       "quantos precisou de ajuda e a porcentagem. A partir de 75% de acerto de " +
       "primeira o objetivo conta como dominado. Sai também um parecer em palavras " +
       "&mdash; do jeito que se escreve no bimestral &mdash; e uma nota de 0 a 10 " +
       "que <b>a criança não vê</b>. Dentro da atividade não há nota, nem ranking, " +
       "nem a palavra &ldquo;errou&rdquo;: o erro responde na hora e diz o que " +
       "olhar, e a ajuda cresce a cada tentativa (dica &rarr; apoio concreto &rarr; " +
       "revelar).</p>";

  if(C.evidencia && C.evidencia.length){
    h += "<p class='dsub'><b>O que foi medido antes de publicar</b></p><ul class='dev'>";
    for(k = 0; k < C.evidencia.length; k++) h += "<li>" + esch(C.evidencia[k]) + "</li>";
    h += "</ul>";
  }
  return h;
}
function abreDossie(){
  var cx = document.getElementById("dsCorpo");
  if(!cx) return;
  if(typeof calar === "function") calar();
  cx.innerHTML = dossieHTML();
  document.getElementById("dossie").className = "aberto";
  cx.scrollTop = 0;
}
function fechaDossie(){ document.getElementById("dossie").className = ""; }
(function(){
  var b = document.getElementById("bDossie"), f = document.getElementById("dsFechar"),
      cx = document.getElementById("dossie");
  if(b) b.onclick = function(){ fechaMenuProf(); abreDossie(); };
  if(f) f.onclick = fechaDossie;
  if(cx) cx.onclick = function(ev){ if(ev.target === this) fechaDossie(); };

  /* o segundo caminho: o botão nasce DENTRO do relatório, quando ele abre.
     Fica ali e não na tela final porque o relatório é a parte que a criança
     não vê — e o dossiê é conversa de adulto. */
  if(typeof abreRelatorio === "function"){
    var antes = abreRelatorio;
    abreRelatorio = function(){
      antes.apply(this, arguments);
      var r = document.getElementById("relatorio");
      if(r && !r.querySelector(".bdossie")){
        var bt = document.createElement("button");
        bt.className = "bt bdossie";
        bt.textContent = "Dossiê pedagógico (currículo da rede)";
        bt.onclick = abreDossie;
        r.appendChild(bt);
      }
    };
  }
}());
/*</dossie-js>*/

/* ⭐ o botão "Terminar" e o "Voltar para o caderno" — ver o comentário do fim() */
(function(){
  var bt = document.getElementById("bTerminar");
  if(bt) bt.onclick = function(){
    var falta = 0, pz;
    for(pz = 1; pz <= NOMES.length; pz++) falta += pendentes(pz);
    if(falta && !confirm("Quer fechar o caderno e ver o seu boletim?\n\nVocê pode voltar depois e continuar de onde parou."))
      return;
    fim();
  };
  var bv = document.getElementById("bVoltar");
  if(bv) bv.onclick = function(){
    document.getElementById("fim").style.display = "none";
    vaiPara(ST.pag || 1);
  };
})();