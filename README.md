# 🔒 LockStudy One™ — Smart Study Lockbox

Caixa inteligente de estudos com simulação de hardware embarcado, trava eletromagnética por solenoide, indução sem fio Qi 15W, cronômetro de foco e gestão de matérias e agenda.

---

## 🚀 Como hospedar no GitHub Pages (Tudo Automático)

O projeto já está **100% configurado** com o GitHub Actions em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) e com `base: './'` no [`vite.config.ts`](vite.config.ts). Qualquer repositório criado no GitHub funcionará de primeira sem quebrar imagens ou scripts!

### Passo 1: Subir o código para o GitHub

No terminal da sua máquina, execute:

```bash
# 1. Inicialize o repositório Git (caso ainda não tenha iniciado)
git init
git add .
git commit -m "feat: LockStudy One app pronto para hospedagem"

# 2. Renomeie a branch para main
git branch -M main

# 3. Adicione o seu repositório remoto do GitHub
# (Substitua SEU-USUARIO e SEU-REPOSITORIO pelo seu nome e nome do repositório)
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# 4. Envie o código
git push -u origin main
```

---

### Passo 2: Ativar o GitHub Pages no seu repositório

1. No seu repositório no GitHub, clique na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages** (dentro da seção *Code and automation*).
3. Na opção **Source** (Origem do Build and deployment):
   - Mude de *"Deploy from a branch"* para **"GitHub Actions"**.

🎉 **Pronto!** O GitHub vai rodar o workflow automaticamente e, em cerca de 1 minuto, fornecerá o link público do seu site (ex: `https://seu-usuario.github.io/seu-repositorio/`).

---

## 🛠️ Tecnologias Utilizadas
- **React 19 & TypeScript**
- **Vite** com builds otimizados e caminhos relativos para hospedagem estática
- **Tailwind CSS** para estilização de interface dark/hardware
- **Web Audio API** para síntese sonora acústica em tempo real (sem arquivos de áudio externos)
- **Local Storage API** para persistência de matérias, agenda e estatísticas de estudo
