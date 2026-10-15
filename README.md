# 🔒 LockStudy One™ — Smart Study Lockbox

Caixa inteligente de estudos com simulação de hardware embarcado, trava eletromagnética por solenoide, indução sem fio Qi 15W, cronômetro de foco e gestão de matérias e agenda.

---

## 🚀 Como resolver o erro e subir para o GitHub Pages

### O que causou o erro no GitHub Actions?
1. O comando `npm ci` falhou nos primeiros 15s porque o repositório não possuía o arquivo `package-lock.json`.
2. Havia um conflito de versão do `esbuild` com o Vite no `package.json`.

**Tudo isso já foi corrigido e testado com sucesso!**

---

### Passo 1: Enviar a correção para o GitHub

No terminal do seu projeto, execute apenas estes comandos:

```bash
git add .
git commit -m "fix: adiciona package-lock.json e workflow resiliente"
git push
```

---

### Passo 2: Confirmar se o GitHub Pages está ativado

1. No seu repositório no GitHub (`github.com/luisglemosf-bit/APP-de-estudos`), clique em **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages** (dentro da seção *Code and automation*).
3. Na opção **Source** (Origem do Build and deployment):
   - Certifique-se de que está selecionado **"GitHub Actions"**.

Assim que você fizer o `git push`, o GitHub iniciará a compilação e o site ficará verde (sucesso) e no ar em:
👉 `https://luisglemosf-bit.github.io/APP-de-estudos/`
