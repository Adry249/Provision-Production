// ========== FORM & DATABASE ==========

const SUPABASE_URL = "https://gnkdiueognmmxhsuqudg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdua2RpdWVvZ25tbXhoc3VxdWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzI1NzcsImV4cCI6MjA5NzEwODU3N30.zZZAcrYu9xlJOJIluggkg1E3oCDlgCeo9ildOgwtRhU";

document.getElementById("fsubmit").addEventListener("click", async function () {
  const btn = document.getElementById("fsubmit");
  const name = document.getElementById("fname").value.trim();
  const contact = document.getElementById("fcontact").value.trim();
  const phone = document.getElementById("fphone").value.trim();
  const pkg = document.getElementById("fpackage").value;
  const message = document.getElementById("fmessage").value.trim();

  if (name === "") {
    showFieldError("fname", "Введите имя");
    return;
  }
  if (name.length < 2) {
    showFieldError("fname", "Имя слишком короткое");
    return;
  }
  if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(name)) {
    showFieldError("fname", "Имя содержит недопустимые символы");
    return;
  }
  if (contact === "") {
    showFieldError("fcontact", "Введите Instagram");
    return;
  }
  if (!contact.startsWith("@")) {
    showFieldError("fcontact", "Instagram должен начинаться с @");
    return;
  }
  if (contact.length < 3) {
    showFieldError("fcontact", "Некорректный Instagram");
    return;
  }
  if (phone === "") {
    showFieldError("fphone", "Введите номер телефона");
    return;
  }
  if (!/^(\+373\s?|0)\d{8}$/.test(phone)) {
    showFieldError("fphone", "Некорректный номер телефона");
    return;
  }
  if (pkg === "") {
    showFieldError("fpackage", "Выберите пакет");
    return;
  }
  if (message === "") {
    showFieldError("fmessage", "Опишите ваш проект");
    return;
  }
  if (message.length < 5) {
    showFieldError("fmessage", "Сообщение слишком короткое");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Отправка...";

  // FORMSPREE
  try {
    const formspreeRes = await fetch("https://formspree.io/f/mnjyllwr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "Новая заявка с сайта Provision Production",
        Имя: name,
        Instagram: contact,
        Телефон: phone,
        Пакет: pkg,
        "Описание проекта": message,
      }),
    });

    // SUPABASE
    await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name,
        instagram: contact,
        phone,
        package: pkg,
        message,
        status: "nou",
      }),
    });

    if (formspreeRes.ok) {
      document.getElementById("formWrap").style.display = "none";
      document.getElementById("formSuccess").classList.add("show");
    } else {
      alert("Ошибка отправки.");
      btn.disabled = false;
      btn.textContent = "Отправить заявку ↗";
    }
  } catch (error) {
    console.error(error);
    alert("Ошибка соединения.");
    btn.disabled = false;
    btn.textContent = "Отправить заявку ↗";
  }
});

function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  field.style.borderColor = "#e05454";
  field.focus();
  const errEl = document.getElementById(fieldId + "-error");
  if (errEl) {
    errEl.textContent = msg;
    errEl.style.display = "block";
  }
  field.addEventListener(
    "input",
    function () {
      field.style.borderColor = "";
      if (errEl) errEl.style.display = "none";
    },
    { once: true },
  );
}
