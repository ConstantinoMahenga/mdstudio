document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                mobileNavToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileNavToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (link.hash && link.hash.length > 1) { // Garante que é um link de âncora interno
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        const icon = mobileNavToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                        mobileNavToggle.setAttribute('aria-label', 'Abrir menu');
                    }
                }
            });
        });
    }

    // --- Footer: Current Year ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]'); // Seleciona apenas seções com ID
    const navA = document.querySelectorAll('.main-nav a');

    function highlightNavLink() {
        let currentSectionId = '';
        const scrollYPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - (window.innerHeight * 0.4); // Ajustar o offset
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollYPosition >= sectionTop && scrollYPosition < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });
        
        // Caso especial para o topo da página (Hero)
        // Verifica se estamos acima da primeira seção real ou se a primeira seção é 'home'
        if (sections.length > 0 && scrollYPosition < (sections[0].offsetTop - (window.innerHeight * 0.5)) && sections[0].id === "home") {
             currentSectionId = "home";
        }


        navA.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${currentSectionId}`) {
                a.classList.add('active');
            }
        });
    }

    if (sections.length > 0 && navA.length > 0) { // Só executa se houver seções e links de navegação
        window.addEventListener('scroll', highlightNavLink);
        highlightNavLink(); // Chama na carga para definir o link ativo inicial
    }


    // --- Contact Form Submission (using mailto:) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir a submissão padrão do formulário

            const form = e.target;
            const nome = form.name.value.trim();
            const emailRemetente = form.email.value.trim(); // Email de quem está enviando
            const empresa = form.company.value.trim();
            const telefone = form.phone.value.trim();
            const mensagem = form.message.value.trim();

            // Validação básica no frontend
            if (!nome || !emailRemetente || !mensagem || !telefone) {
                alert('Por favor, preencha todos os campos obrigatórios (Nome, Seu Email, Telefone e Mensagem).');
                return;
            }
            
            function validateEmail(email) { // Função de validação de email
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(String(email).toLowerCase());
            }

            if (!validateEmail(emailRemetente)) {
                alert('Por favor, insira um endereço de email válido para o campo "Seu Email".');
                return;
            }

            // >>>>> IMPORTANTE: SUBSTITUA PELO SEU ENDEREÇO DE E-MAIL DE DESTINO <<<<<
            const seuEmailDestino = 'info@mdstudion.site'; 
            // >>>>> IMPORTANTE: SUBSTITUA PELO SEU ENDEREÇO DE E-MAIL DE DESTINO <<<<<


            // Crie o assunto do e-mail
            const assunto = `Contato do Site MD Studion - De: ${nome}`;

            // Crie o corpo do e-mail
            let corpoEmail = `Você recebeu uma nova mensagem do formulário de contato do site MD Studion:\n\n`;
            corpoEmail += `Nome do Remetente: ${nome}\n`;
            corpoEmail += `Email do Remetente: ${emailRemetente}\n`;
            if (empresa) {
                corpoEmail += `Empresa: ${empresa}\n`;
            }
            corpoEmail += `Telefone/WhatsApp: ${telefone}\n\n`;
            corpoEmail += `Mensagem:\n${mensagem}\n\n`;
            corpoEmail += `----------------------------------\n`;
            corpoEmail += `Este e-mail foi gerado a partir do formulário de contato do site.`;

            // Codifique os componentes para a URL mailto:
            const mailtoLink = `mailto:${seuEmailDestino}` +
                               `?subject=${encodeURIComponent(assunto)}` +
                               `&body=${encodeURIComponent(corpoEmail)}`;

            // Tente abrir o cliente de e-mail do usuário
            try {
                window.location.href = mailtoLink;
                 // Você pode adicionar um pequeno delay e então resetar o formulário se desejar,
                 // mas pode ser melhor não resetar caso o cliente de email não abra.
                 // setTimeout(() => {
                 //    form.reset();
                 // }, 1000); 
            } catch (error) {
                alert("Não foi possível abrir seu cliente de e-mail. Por favor, copie os detalhes e envie manualmente para " + seuEmailDestino);
                console.error("Erro ao tentar abrir mailto:", error);
            }
        });
    }


    // --- Scroll Animations with Intersection Observer and Data-Delay (Continuous) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px', // Sem margem
        threshold: 0.1  // Pelo menos 10% do elemento precisa estar visível
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            const delay = parseInt(entry.target.dataset.delay) || 0;

            if (entry.isIntersecting) {
                // Adiciona a classe 'is-visible' após o delay quando o elemento entra na tela
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
            } else {
                // Remove a classe 'is-visible' quando o elemento sai da tela
                // Isso permite que a animação ocorra novamente
                entry.target.classList.remove('is-visible');
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });
});