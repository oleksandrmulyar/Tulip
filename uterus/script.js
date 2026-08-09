const images = [
  "anteversio-anteflexio.png",
  "anteversio-retroflexio.png",
  "retroversio-anteflexio.png",
  "retroversio-retroflexio.png",
];

const REPORT_ANATOMY_IMAGE = "anatomy.jpg";

const defaultFigoText = "1";
const annotationConfigs = {
  myoma: {
    listId: "myoma-list",
    defaultText: defaultFigoText,
    inputClass: "figo-input",
    markerClass: "myoma-marker",
    numberLabel: "утворення",
    deleteLabel: "утворення",
  },
  formation: {
    listId: "formation-list",
    defaultText: "",
    placeholderText: "Назва утвору",
    defaultShape: "округле",
    inputClass: "annotation-label-input",
    markerClass: "myoma-marker formation-marker",
    numberLabel: "утвору",
    deleteLabel: "утвір",
  },
};
const shapePresets = {
  "округле": { key: "round", width: 58, height: 58 },
  "овальне": { key: "oval", width: 82, height: 52 },
  "продовгувате": { key: "elongated", width: 96, height: 38 },
  "лінійне": { key: "linear", width: 120, height: 16 },
};
const markerStartPositions = {
  selected: { x: 50, y: 50 },
  reference: { x: 50, y: 50 },
};
const markerDefaultSize = 58;
const markerMinSize = 16;
const markerMaxSize = 320;
const markerMinHeight = 8;
const markerResizeEdgeWidth = 12;
const myomaColors = [
  "#d93f5c",
  "#2f80ed",
  "#27ae60",
  "#f2994a",
  "#9b51e0",
  "#00a6a6",
  "#eb5757",
  "#6fcf97",
];

const gallery = document.querySelector("#gallery");
const galleryView = document.querySelector("#gallery-view");
const detailView = document.querySelector("#detail-view");
const detailImage = document.querySelector("#detail-image");
const addMyomaButton = document.querySelector("#add-myoma");
const addFormationButton = document.querySelector("#add-formation");
const annotationLists = Object.fromEntries(
  Object.entries(annotationConfigs).map(([type, config]) => [type, document.querySelector(`#${config.listId}`)]),
);
const markerSurfaces = document.querySelectorAll("[data-marker-surface]");
const downloadImageButtons = document.querySelectorAll("[data-download-surface]");
const reportButton = document.querySelector("#generate-report");
const downloadReportButton = document.querySelector("#download-report-image");
const reportPreview = document.querySelector("#report-preview");
const figoReferenceButton = document.querySelector("#figo-reference-button");
const figoReferenceDialog = document.querySelector("#figo-reference-dialog");
const figoReferenceBackdrop = document.querySelector("#figo-reference-backdrop");
const figoReferenceClose = document.querySelector("#figo-reference-close");

const setFigoReferenceOpen = (isOpen) => {
  figoReferenceDialog.hidden = !isOpen;
  figoReferenceBackdrop.hidden = !isOpen;
  document.body.style.overflow = isOpen ? "hidden" : "";
  figoReferenceButton.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    figoReferenceClose.focus();
  } else {
    figoReferenceButton.focus();
  }
};

figoReferenceButton?.addEventListener("click", () => setFigoReferenceOpen(true));
figoReferenceClose?.addEventListener("click", () => setFigoReferenceOpen(false));
figoReferenceBackdrop?.addEventListener("click", () => setFigoReferenceOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !figoReferenceDialog?.hidden) {
    setFigoReferenceOpen(false);
  }
});

const annotationCounters = { myoma: 0, formation: 0 };

const getCaptionParts = (fileName) => fileName.replace(/\.png$/i, "").split("-");
const positionLabels = {
  "anteversio-anteflexio.png": "anteversio-anteflexio",
  "anteversio-retroflexio.png": "anteversio-retroflexio",
  "retroversio-anteflexio.png": "retroversio-anteflexio",
  "retroversio-retroflexio.png": "retroversio-retroflexio",
};

const getCaptionText = (fileName) => positionLabels[fileName] || getCaptionParts(fileName).join(" ");

const createCaption = (fileName) => {
  const caption = document.createElement("span");
  caption.className = "caption";

  getCaptionParts(fileName).forEach((part, index) => {
    if (index > 0) {
      caption.append(document.createElement("br"));
    }

    caption.append(part);
  });

  return caption;
};

const getImageUrl = (fileName) => `${window.location.pathname}?image=${encodeURIComponent(fileName)}`;

const renderGallery = () => {
  images.forEach((fileName) => {
    const card = document.createElement("a");
    card.className = "image-card";
    card.href = getImageUrl(fileName);
    card.setAttribute("aria-label", `Відкрити ${getCaptionText(fileName)}`);

    card.addEventListener("click", (event) => {
      event.preventDefault();
      openImage(fileName);
    });

    const image = document.createElement("img");
    image.src = fileName;
    image.alt = getCaptionText(fileName);
    image.loading = "lazy";

    card.append(image, createCaption(fileName));
    gallery.append(card);
  });
};

const renderDetail = (fileName) => {
  galleryView.hidden = true;
  detailView.hidden = false;

  detailImage.src = fileName;
  detailImage.alt = getCaptionText(fileName);
  document.title = `${getCaptionText(fileName)} — Вибір положення матки`;
  const positionInput = document.querySelector("#uterus-position");
  if (positionInput) positionInput.value = getCaptionText(fileName);
};


const getSafeFilePart = (value, fallback = "image") =>
  (value || fallback)
    .replace(/\.png$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ_-]+/giu, "-")
    .replace(/^-+|-+$/g, "") || fallback;

const getFileNameFromImageSource = (source) => {
  const pathName = new URL(source, window.location.href).pathname;
  return decodeURIComponent(pathName.split("/").pop() || "image");
};

const getDownloadDatePart = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
};

const getPatientFileBase = () => {
  const value = getValue("#patient-name");
  if (!value) return "report";

  try {
    return value.replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "") || "report";
  } catch (_) {
    return value.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "report";
  }
};

const drawRoundedRect = (context, x, y, width, height, radius) => {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
};

const getImageDrawBox = (image, stageWidth, stageHeight) => {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const stageRatio = stageWidth / stageHeight;

  if (imageRatio > stageRatio) {
    const width = stageWidth;
    const height = width / imageRatio;
    return { x: 0, y: (stageHeight - height) / 2, width, height };
  }

  const height = stageHeight;
  const width = height * imageRatio;
  return { x: (stageWidth - width) / 2, y: 0, width, height };
};

const drawMarkerToCanvas = (context, marker, scale) => {
  const x = (Number(marker.dataset.x) / 100) * context.canvas.width;
  const y = (Number(marker.dataset.y) / 100) * context.canvas.height;
  const width = Number(marker.dataset.width || markerDefaultSize) * scale;
  const height = Number(marker.dataset.height || marker.dataset.width || markerDefaultSize) * scale;
  const color = marker.dataset.myomaColor || getComputedStyle(marker).getPropertyValue("--myoma-color") || "#b64f6a";
  const angle = Number(marker.dataset.angle || 0);

  context.save();
  context.translate(x, y);
  context.rotate((angle * Math.PI) / 180);
  context.fillStyle = color.trim();
  drawRoundedRect(context, -width / 2, -height / 2, width, height, Math.max(width, height) / 2);
  context.fill();

  const label = marker.querySelector(".marker-label")?.textContent.trim() || marker.textContent.trim();
  if (label) {
    context.fillStyle = "#fff";
    context.font = `900 ${Math.max(12, Math.min(width, height) * 0.22)}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label, 0, 0, width * 0.82);
  }

  context.restore();
};

const renderSurfaceToCanvas = (surfaceName) => {
  const stage = document.querySelector(`[data-marker-surface="${surfaceName}"]`);
  const image = stage?.querySelector("img");

  if (!stage || !image?.complete || !image.naturalWidth || !image.naturalHeight) {
    return;
  }

  const stageRect = stage.getBoundingClientRect();
  const scale = image.naturalWidth / stageRect.width;
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = Math.round(stageRect.height * scale);

  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const drawBox = getImageDrawBox(image, canvas.width, canvas.height);
  context.drawImage(image, drawBox.x, drawBox.y, drawBox.width, drawBox.height);

  stage.querySelectorAll(".myoma-marker").forEach((marker) => drawMarkerToCanvas(context, marker, scale));

  return canvas;
};

const downloadSurfaceImage = (surfaceName) => {
  const canvas = renderSurfaceToCanvas(surfaceName);
  const image = document.querySelector(`[data-marker-surface="${surfaceName}"] img`);

  if (!canvas || !image) return;

  const link = document.createElement("a");
  const imageName = getSafeFilePart(getFileNameFromImageSource(image.currentSrc || image.src));
  link.download = `${getPatientFileBase()}_${imageName}_${getDownloadDatePart()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

const openImage = (fileName) => {
  if (!images.includes(fileName)) {
    return;
  }

  renderDetail(fileName);
  window.history.pushState({ image: fileName }, "", getImageUrl(fileName));
};

const renderFromUrl = () => {
  const selectedImage = new URLSearchParams(window.location.search).get("image");

  if (images.includes(selectedImage)) {
    renderDetail(selectedImage);
    return;
  }

  galleryView.hidden = false;
  detailView.hidden = true;
  detailImage.removeAttribute("src");
  detailImage.alt = "";
  document.title = "Вибір положення матки";
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateMarkerPosition = (marker, x, y) => {
  marker.dataset.x = x;
  marker.dataset.y = y;
  marker.style.left = `${x}%`;
  marker.style.top = `${y}%`;
};

const updateMarkerSize = (marker, width, height = width) => {
  const forceCircle = marker.dataset.forceCircle === "true";
  const nextWidth = clamp(width, markerMinSize, markerMaxSize);
  const nextHeight = forceCircle ? nextWidth : clamp(height, markerMinHeight, markerMaxSize);

  marker.dataset.width = nextWidth;
  marker.dataset.height = nextHeight;
  marker.dataset.size = nextWidth;
  marker.style.setProperty("--marker-width", `${nextWidth}px`);
  marker.style.setProperty("--marker-height", `${nextHeight}px`);
  marker.style.setProperty("--marker-size", `${Math.max(nextWidth, nextHeight)}px`);
};

const updateMarkerAngle = (marker, angle) => {
  const normalizedAngle = ((Number(angle) % 360) + 360) % 360;
  marker.dataset.angle = normalizedAngle;
  marker.style.setProperty("--marker-angle", `${normalizedAngle}deg`);
};

const getShapePreset = (shape) => shapePresets[shape] ?? shapePresets["округле"];

const applyMarkerShape = (marker, shape, preserveSize = false) => {
  const preset = getShapePreset(shape);

  marker.dataset.shape = preset.key;
  marker.dataset.forceCircle = String(Boolean(preset.forceCircle));
  marker.classList.toggle("is-linear-shape", preset.key === "linear");

  if (!preserveSize) {
    updateMarkerSize(marker, preset.width, preset.height);
  } else if (preset.forceCircle) {
    const size = Math.max(Number(marker.dataset.width) || preset.width, Number(marker.dataset.height) || preset.height);
    updateMarkerSize(marker, size, size);
  }
};

const isPointerOnMarkerEdge = (marker, event) => {
  const rect = marker.getBoundingClientRect();
  const edgeDistance = Math.min(
    Math.abs(event.clientX - rect.left),
    Math.abs(event.clientX - rect.right),
    Math.abs(event.clientY - rect.top),
    Math.abs(event.clientY - rect.bottom),
  );

  return edgeDistance <= markerResizeEdgeWidth;
};

const rotateMarkerFromPointer = (marker, event) => {
  const rect = marker.parentElement.getBoundingClientRect();
  const centerX = rect.left + (Number(marker.dataset.x) / 100) * rect.width;
  const centerY = rect.top + (Number(marker.dataset.y) / 100) * rect.height;
  updateMarkerAngle(marker, Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI) + 90);
};

const resizeMarkerFromPointer = (marker, event) => {
  const stage = marker.parentElement;
  const stageRect = stage.getBoundingClientRect();
  const centerX = stageRect.left + (Number(marker.dataset.x) / 100) * stageRect.width;
  const centerY = stageRect.top + (Number(marker.dataset.y) / 100) * stageRect.height;
  const nextWidth = Math.abs(event.clientX - centerX) * 2;
  const nextHeight = Math.abs(event.clientY - centerY) * 2;

  if (marker.dataset.forceCircle === "true") {
    updateMarkerSize(marker, Math.hypot(event.clientX - centerX, event.clientY - centerY) * 2);
    return;
  }

  updateMarkerSize(marker, nextWidth, nextHeight);
};

const makeMarkerInteractive = (marker) => {
  marker.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    marker.setPointerCapture(event.pointerId);

    if (event.target?.classList?.contains("marker-rotate-handle")) {
      marker.dataset.action = "rotate";
      marker.classList.add("is-rotating");
      rotateMarkerFromPointer(marker, event);
      return;
    }

    if (isPointerOnMarkerEdge(marker, event)) {
      marker.dataset.action = "resize";
      marker.classList.add("is-resizing");
      marker.classList.remove("is-resize-ready");
      return;
    }

    marker.dataset.action = "drag";
    marker.classList.add("is-dragging");
  });

  marker.addEventListener("pointermove", (event) => {
    if (!marker.hasPointerCapture(event.pointerId)) {
      marker.classList.toggle("is-resize-ready", isPointerOnMarkerEdge(marker, event));
      return;
    }

    if (marker.dataset.action === "resize") {
      resizeMarkerFromPointer(marker, event);
      return;
    }

    if (marker.dataset.action === "rotate") {
      rotateMarkerFromPointer(marker, event);
      return;
    }

    const stage = marker.parentElement;
    const rect = stage.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

    updateMarkerPosition(marker, x, y);
  });

  marker.addEventListener("pointerleave", () => {
    if (!marker.dataset.action) {
      marker.classList.remove("is-resize-ready");
    }
  });

  const stopInteraction = (event) => {
    if (marker.hasPointerCapture(event.pointerId)) {
      marker.releasePointerCapture(event.pointerId);
    }

    delete marker.dataset.action;
    marker.classList.remove("is-dragging", "is-resizing", "is-rotating", "is-resize-ready");
  };

  marker.addEventListener("pointerup", stopInteraction);
  marker.addEventListener("pointercancel", stopInteraction);
};

const getMyomaRows = (type = "myoma") => [...annotationLists[type].querySelectorAll("tr[data-myoma-id]")];

const getMyomaMarkers = (myomaId) =>
  document.querySelectorAll(`.myoma-marker[data-myoma-id="${myomaId}"]`);

const getAnnotationGlobalIndex = (annotationNumber, type = "myoma") =>
  type === "formation" ? getMyomaRows("myoma").length + annotationNumber : annotationNumber;

const getMyomaColor = (annotationNumber, type = "myoma") => myomaColors[(getAnnotationGlobalIndex(annotationNumber, type) - 1) % myomaColors.length];

const getUsedAnnotationColors = () =>
  [...document.querySelectorAll("#myoma-list .color-input, #formation-list .color-input")].map((input) => input.value.toLowerCase());

const getNextAnnotationColor = (annotationNumber, type = "myoma") => {
  const usedColors = new Set(getUsedAnnotationColors());
  return myomaColors.find((color) => !usedColors.has(color.toLowerCase())) || getMyomaColor(annotationNumber, type);
};

const applyAnnotationColor = (myomaId, color, type = "myoma") => {
  getMyomaMarkers(myomaId).forEach((marker) => {
    marker.style.setProperty("--myoma-color", color);
    marker.dataset.myomaColor = color;
  });

  const row = annotationLists[type].querySelector(`tr[data-myoma-id="${myomaId}"]`);
  row?.style.setProperty("--myoma-color", color);
};

const setMyomaColor = (myomaId, myomaNumber, type = "myoma") => {
  const row = annotationLists[type].querySelector(`tr[data-myoma-id="${myomaId}"]`);
  const colorInput = row?.querySelector(".color-input");
  const color = colorInput?.value || getMyomaColor(myomaNumber, type);

  if (colorInput && !colorInput.value) {
    colorInput.value = color;
  }

  applyAnnotationColor(myomaId, color, type);
};

const setMarkerLabel = (marker, myomaNumber, category) => {
  marker.dataset.annotationNumber = myomaNumber;
  marker.innerHTML = "";
  const labelElement = document.createElement("span");
  labelElement.className = "marker-label";
  labelElement.textContent = category;
  const rotateHandle = document.createElement("span");
  rotateHandle.className = "marker-rotate-handle";
  rotateHandle.setAttribute("aria-hidden", "true");
  marker.append(labelElement, rotateHandle);

  const markerLabel = category ? `${category} ${myomaNumber}` : `Позначка ${myomaNumber}`;

  marker.setAttribute(
    "aria-label",
    `${markerLabel}. Перетягніть позначку, потягніть за край для розміру або за ручку над позначкою для кута нахилу.`,
  );
};

const createMarker = (myomaId, myomaNumber, category, surface, type = "myoma", shape = "округле") => {
  const config = annotationConfigs[type];
  const marker = document.createElement("button");
  marker.className = config.markerClass;
  marker.type = "button";
  marker.dataset.myomaId = myomaId;
  marker.dataset.annotationType = type;
  marker.dataset.surface = surface.dataset.markerSurface;
  setMarkerLabel(marker, myomaNumber, category);
  updateMarkerAngle(marker, 0);

  const startPosition = markerStartPositions[marker.dataset.surface];
  updateMarkerPosition(marker, startPosition.x, startPosition.y);
  applyMarkerShape(marker, shape);
  makeMarkerInteractive(marker);

  surface.append(marker);
  return marker;
};

const formatFigoLabel = (value) => {
  const figoText = value.trim().replace(/^FIGO\s*/i, "");

  return `FIGO${figoText}`;
};


const getRowValue = (row, type) => {
  const config = annotationConfigs[type];
  const control = row.querySelector(`.${config.inputClass}`);

  return control?.value ?? config.defaultText;
};

const formatAnnotationLabel = (value, type) => {
  if (type === "myoma") {
    return formatFigoLabel(value);
  }

  return value.trim();
};

const updateAnnotationCategory = (annotationId, annotationNumber, input, type) => {
  const row = input.closest("tr[data-myoma-id]");
  const currentNumber = row?.querySelector("[data-myoma-number-cell]")?.textContent ?? annotationNumber;
  const category = formatAnnotationLabel(input.value, type);

  getMyomaMarkers(annotationId).forEach((marker) => {
    if (marker.dataset.annotationType !== type) return;
    setMarkerLabel(marker, currentNumber, category);
  });
};

const createCategoryControl = (annotationId, annotationNumber, initialText, type) => {
  const config = annotationConfigs[type];
  const input = document.createElement("input");
  input.className = config.inputClass;
  input.type = "text";
  input.value = initialText;
  input.setAttribute("aria-label", type === "myoma" ? `Текст після FIGO для утворення ${annotationNumber}` : `Назва для ${config.numberLabel} ${annotationNumber}`);
  input.setAttribute("placeholder", type === "myoma" ? "1 або 2-3" : config.placeholderText);

  input.addEventListener("input", () => updateAnnotationCategory(annotationId, annotationNumber, input, type));
  input.addEventListener("change", () => updateAnnotationCategory(annotationId, annotationNumber, input, type));

  return input;
};

const createColorControl = (annotationId, annotationNumber, type) => {
  const input = document.createElement("input");
  input.className = "color-input";
  input.type = "color";
  input.value = getNextAnnotationColor(annotationNumber, type);
  input.setAttribute("aria-label", `Колір для ${annotationConfigs[type].numberLabel} ${annotationNumber}`);

  input.addEventListener("input", () => applyAnnotationColor(annotationId, input.value, type));
  input.addEventListener("change", () => applyAnnotationColor(annotationId, input.value, type));

  return input;
};

const renumberAnnotations = (type = "myoma") => {
  const config = annotationConfigs[type];

  getMyomaRows(type).forEach((row, index) => {
    const annotationNumber = index + 1;
    const category = formatAnnotationLabel(getRowValue(row, type), type);

    row.querySelector("[data-myoma-number-cell]").textContent = annotationNumber;
    row.querySelector(`.${config.inputClass}`)?.setAttribute("aria-label", type === "myoma" ? `Текст після FIGO для утворення ${annotationNumber}` : `Назва для ${config.numberLabel} ${annotationNumber}`);
    row.querySelector(".color-input")?.setAttribute("aria-label", `Колір для ${config.numberLabel} ${annotationNumber}`);
    row.querySelector(".delete-myoma-button").setAttribute("aria-label", `Видалити ${config.deleteLabel} ${annotationNumber}`);
    setMyomaColor(row.dataset.myomaId, annotationNumber, type);

    getMyomaMarkers(row.dataset.myomaId).forEach((marker) => {
      if (marker.dataset.annotationType === type) {
        setMarkerLabel(marker, annotationNumber, category);
      }
    });
  });
};

const deleteAnnotation = (row, type) => {
  getMyomaMarkers(row.dataset.myomaId).forEach((marker) => marker.remove());
  row.remove();
  renumberAnnotations(type);
};

const createDeleteButton = (row, annotationNumber, type) => {
  const config = annotationConfigs[type];
  const button = document.createElement("button");
  button.className = "delete-myoma-button";
  button.type = "button";
  button.textContent = "×";
  button.setAttribute("aria-label", `Видалити ${config.deleteLabel} ${annotationNumber}`);

  button.addEventListener("click", () => deleteAnnotation(row, type));

  return button;
};

const addAnnotation = (type = "myoma") => {
  annotationCounters[type] += 1;
  const config = annotationConfigs[type];
  const annotationId = `${type}-${annotationCounters[type]}`;
  const annotationNumber = getMyomaRows(type).length + 1;
  const initialText = config.defaultText;
  const initialShape = config.defaultShape ?? "округле";
  const category = formatAnnotationLabel(initialText, type);

  const row = document.createElement("tr");
  row.dataset.myomaId = annotationId;
  row.dataset.annotationType = type;

  const numberCell = document.createElement("td");
  numberCell.dataset.myomaNumberCell = "";
  numberCell.textContent = annotationNumber;

  const categoryCell = document.createElement("td");
  categoryCell.append(createCategoryControl(annotationId, annotationNumber, initialText, type));


  const sizeCell = document.createElement("td");
  const sizeRow = document.createElement("div");
  sizeRow.className = "dimension-row annotation-dimension-row";
  ["довжина", "ширина", "товщина"].forEach((label) => {
    const sizeInput = document.createElement("input");
    sizeInput.className = "report-input dimension-input annotation-size-input";
    sizeInput.type = "number";
    sizeInput.inputMode = "decimal";
    sizeInput.placeholder = label;
    sizeInput.setAttribute("aria-label", `${label} для ${config.numberLabel} ${annotationNumber}`);
    sizeRow.append(sizeInput);
  });
  sizeCell.append(sizeRow);

  const locationCell = document.createElement("td");
  const wallSelect = document.createElement("select");
  wallSelect.className = "report-input annotation-wall-select";
  wallSelect.setAttribute("aria-label", `Стінка для ${config.numberLabel} ${annotationNumber}`);
  ["", "передня", "задня", "ліва бокова", "права бокова", "дно матки", "шийка матки", "інше"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value || "Оберіть стінку";
    wallSelect.append(option);
  });
  const locationInput = document.createElement("input");
  locationInput.className = "report-input annotation-location-input";
  locationInput.type = "text";
  locationInput.placeholder = type === "myoma" ? "додаткова локалізація" : "опис або інша локалізація";
  locationInput.setAttribute("aria-label", `Локалізація або опис для ${config.numberLabel} ${annotationNumber}`);
  const locationStack = document.createElement("div");
  locationStack.className = "annotation-location-stack";
  locationStack.append(wallSelect, locationInput);
  locationCell.append(locationStack);

  const colorCell = document.createElement("td");
  colorCell.append(createColorControl(annotationId, annotationNumber, type));

  const actionCell = document.createElement("td");
  actionCell.className = "myoma-action-cell";
  actionCell.append(createDeleteButton(row, annotationNumber, type));

  row.append(numberCell);
  row.append(categoryCell);
  row.append(sizeCell, locationCell);
  row.append(colorCell, actionCell);
  annotationLists[type].append(row);

  markerSurfaces.forEach((surface) => createMarker(annotationId, annotationNumber, category, surface, type, initialShape));
  setMyomaColor(annotationId, annotationNumber, type);
};

const getValue = (selector) => document.querySelector(selector)?.value.trim() || "";

const getDimensionValue = (...selectors) => selectors.map(getValue).filter(Boolean).join("×");

const setupConditionalFields = (key) => {
  const position = document.querySelector(`#${key}-ovary-position`);
  const positionManual = document.querySelector(`.${key}-ovary-position-manual`);

  const sync = () => {
    if (positionManual) positionManual.hidden = position?.value !== "manual";
  };

  position?.addEventListener("change", sync);
  sync();
};

const setupOvaryFindingEntry = (entry) => {
  const finding = entry.querySelector(".ovary-finding");
  const details = entry.querySelector(".ovary-finding-details");
  const sync = () => {
    details.hidden = finding.value === "none";
  };

  finding.addEventListener("change", sync);
  entry.querySelector(".delete-ovary-finding")?.addEventListener("click", () => entry.remove());
  sync();
};

const addOvaryFinding = (key) => {
  const container = document.querySelector(`#${key}-ovary-findings`);
  const template = container?.querySelector(".ovary-finding-entry");
  if (!container || !template) return;

  const entry = template.cloneNode(true);
  entry.querySelectorAll("input").forEach((input) => { input.value = ""; });
  entry.querySelector(".ovary-finding").value = "mass";
  entry.querySelector(".delete-ovary-finding").hidden = false;
  container.append(entry);
  setupOvaryFindingEntry(entry);
};


const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

const getAnnotationPreviewItems = (type) => {
  const config = annotationConfigs[type];
  return getMyomaRows(type).map((row, index) => {
    const number = index + 1;
    const label = formatAnnotationLabel(getRowValue(row, type), type);
    const size = [...row.querySelectorAll(".annotation-size-input")].map((input) => input.value.trim()).filter(Boolean).join("×");
    const wall = row.querySelector(".annotation-wall-select")?.value.trim() || "—";
    const location = row.querySelector(".annotation-location-input")?.value.trim() || "—";
    const color = row.querySelector(".color-input")?.value || getMyomaColor(number, type);
    return { number, label, size, wall, location, color, type };
  });
};

const getSurfaceDataUrl = (surfaceName) => renderSurfaceToCanvas(surfaceName)?.toDataURL("image/png") || "";

const renderOvaryLine = (line) => {
  const labelMatch = line.match(/^((?:Правий|Лівий) яєчник):(.*)$/u);
  if (!labelMatch) return `<p>${escapeHtml(line)}</p>`;

  return `<p><strong><em>${escapeHtml(labelMatch[1])}</em></strong>:${escapeHtml(labelMatch[2])}</p>`;
};

const renderReportPreview = () => {
  if (!reportPreview) return;

  const patientName = getValue("#patient-name");
  const uterusPosition = getValue("#uterus-position");
  const uterusSize = getDimensionValue("#uterus-size-length", "#uterus-size-ap", "#uterus-size-width");
  const endometriumSize = getValue("#endometrium-size");
  const myometriumSize = getValue("#myometrium-size");
  const additionalNotes = getValue("#additional-notes");
  const previewImages = [getSurfaceDataUrl("selected"), getSurfaceDataUrl("reference")].filter(Boolean);
  const lesions = [...getAnnotationPreviewItems("myoma"), ...getAnnotationPreviewItems("formation")];
  const ovaryLines = [buildOvaryLines("Правий", "right"), buildOvaryLines("Лівий", "left")].flat();
  const lesionHtml = lesions.map((item) => `
    <div class="report-preview-lesion">
      <div class="report-preview-lesion-title"><span class="report-preview-dot" style="--myoma-color:${escapeHtml(item.color)}"></span>${escapeHtml(item.type === "myoma" ? `Міома ${item.number}:` : `Утвір ${item.number}:`)}</div>
      ${item.size ? `<p>${escapeHtml(item.size)} мм</p>` : ""}
      ${item.label ? `<p><strong>${escapeHtml(item.label)}</strong></p>` : ""}
      ${item.wall !== "—" ? `<p>Стінка: ${escapeHtml(item.wall)}</p>` : ""}
      ${item.location !== "—" ? `<p>Додатково: ${escapeHtml(item.location)}</p>` : ""}
    </div>`).join("");

  reportPreview.innerHTML = `
    <div class="report-preview-image">
      <div class="report-preview-images">
        ${previewImages.map((src, index) => `<img src="${escapeHtml(src)}" alt="Зображення матки з позначками ${index + 1}" />`).join("")}
        <img src="${REPORT_ANATOMY_IMAGE}" alt="Анатомія матки" />
      </div>
    </div>
    <div class="report-preview-text">
      ${patientName ? `<p><strong>${escapeHtml(patientName)}</strong></p>` : ""}
      ${(uterusPosition || uterusSize) ? `<p><strong>Матка:</strong>${uterusPosition ? `<br>${escapeHtml(uterusPosition)}` : ""}${uterusSize ? `<br>${escapeHtml(uterusSize)} мм` : ""}</p>` : ""}
      ${endometriumSize ? `<p><strong>Ендометрій:</strong> ${escapeHtml(endometriumSize)} мм</p>` : ""}
      ${myometriumSize ? `<p><strong>Міометрій:</strong> ${escapeHtml(myometriumSize)} мм</p>` : ""}
      ${additionalNotes ? `<p><strong>Додатково:</strong> ${escapeHtml(additionalNotes)}</p>` : ""}
      ${lesionHtml}
      ${ovaryLines.length ? `<div class="report-preview-ovaries"><p><strong>Яєчники:</strong></p>${ovaryLines.map(renderOvaryLine).join("")}</div>` : ""}
    </div>`;
};

const buildAnnotationReportLines = (type, title) => {
  const config = annotationConfigs[type];
  const lines = getMyomaRows(type).map((row, index) => {
    const number = index + 1;
    const label = formatAnnotationLabel(getRowValue(row, type), type);
    const size = [...row.querySelectorAll(".annotation-size-input")].map((input) => input.value.trim()).filter(Boolean).join("×");
    const wall = row.querySelector(".annotation-wall-select")?.value.trim();
    const location = row.querySelector(".annotation-location-input")?.value.trim();
    const parts = [type === "formation" && !label ? `${number})` : `${number}) ${label || config.numberLabel}`];

    if (size) parts.push(`розміри ${size} мм`);
    if (wall) parts.push(wall);
    if (location) parts.push(location);

    return parts.join("; ") + ".";
  });

  return lines.length ? [`${title}:`, ...lines] : [];
};

const buildOvaryLines = (sideLabel, key) => {
  const size = getDimensionValue(`#${key}-ovary-size-length`, `#${key}-ovary-size-width`, `#${key}-ovary-size-depth`);
  const positionValue = getValue(`#${key}-ovary-position`);
  const position = positionValue === "manual" ? getValue(`#${key}-ovary-position-text`) : positionValue;
  const structure = getValue(`#${key}-ovary-structure`);
  const notes = getValue(`#${key}-ovary-notes`);
  const ovaryParts = [];

  if (position) ovaryParts.push(position);
  if (size) ovaryParts.push(`розміри ${size} мм`);
  if (structure) ovaryParts.push(structure);
  const findingEntries = [...document.querySelectorAll(`#${key}-ovary-findings .ovary-finding-entry`)];
  const hasSpecificFinding = findingEntries.some((entry) => entry.querySelector(".ovary-finding")?.value !== "none");
  const findingLines = [];
  findingEntries.forEach((entry) => {
    const findingValue = entry.querySelector(".ovary-finding")?.value || "";
    if (findingValue === "none") {
      if (!hasSpecificFinding) ovaryParts.push("без вогнищевих змін та патологічних включень");
      return;
    }

    const findingText = entry.querySelector(".ovary-finding-text")?.value.trim() || "";
    const findingSize = [...entry.querySelectorAll(".ovary-finding-size")].map((input) => input.value.trim()).filter(Boolean).join("×");
    const findingParts = [];
    if (findingValue !== "other") findingParts.push(findingValue === "mass" ? "утвір" : findingValue);
    if (findingText) findingParts.push(findingText);
    if (findingSize) findingParts.push(`розміри ${findingSize} мм`);
    if (findingParts.length) findingLines.push(`Утворення ${findingLines.length + 1}: ${findingParts.join(": ")}.`);
  });
  if (notes) ovaryParts.push(notes);

  const ovaryLine = ovaryParts.length ? `${sideLabel} яєчник: ${ovaryParts.join("; ")}.` : "";
  return [ovaryLine, ...findingLines].filter(Boolean);
};

const buildReportLines = () => {
  const lines = [];
  const patientName = getValue("#patient-name");
  const uterusPosition = getValue("#uterus-position");
  const uterusSize = getDimensionValue("#uterus-size-length", "#uterus-size-ap", "#uterus-size-width");
  const endometriumSize = getValue("#endometrium-size");
  const myometriumSize = getValue("#myometrium-size");
  const additionalNotes = getValue("#additional-notes");

  if (patientName) lines.push(`ПІБ: ${patientName}.`);
  if (uterusPosition) lines.push(`Матка у положенні: ${uterusPosition}.`);
  if (uterusSize) lines.push(`Розміри матки: ${uterusSize} мм.`);
  if (endometriumSize) lines.push(`Ендометрій: ${endometriumSize} мм.`);
  if (myometriumSize) lines.push(`Міометрій: ${myometriumSize} мм.`);
  if (additionalNotes) lines.push(`Додатково: ${additionalNotes}.`);

  lines.push(...buildAnnotationReportLines("myoma", "Міоми"));
  lines.push(...buildAnnotationReportLines("formation", "Інші ураження"));

  const ovaryLines = [buildOvaryLines("Правий", "right"), buildOvaryLines("Лівий", "left")].flat();
  if (ovaryLines.length) lines.push("Яєчники:", ...ovaryLines);

  return lines;
};

const generateReport = () => {
  renderReportPreview(buildReportLines());
};

setupConditionalFields("right");
setupConditionalFields("left");
document.querySelectorAll(".ovary-finding-entry").forEach(setupOvaryFindingEntry);
document.querySelectorAll(".add-ovary-finding").forEach((button) => {
  button.addEventListener("click", () => addOvaryFinding(button.dataset.ovaryKey));
});
renderGallery();
renderFromUrl();

addMyomaButton.addEventListener("click", () => addAnnotation("myoma"));
addFormationButton.addEventListener("click", () => addAnnotation("formation"));
downloadImageButtons.forEach((button) => {
  button.addEventListener("click", () => downloadSurfaceImage(button.dataset.downloadSurface));
});
const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

const copyComputedStyles = (source, target) => {
  const sourceElements = [source, ...source.querySelectorAll("*")];
  const targetElements = [target, ...target.querySelectorAll("*")];

  sourceElements.forEach((element, index) => {
    const computedStyle = window.getComputedStyle(element);
    const targetStyle = targetElements[index].style;

    for (const property of computedStyle) {
      targetStyle.setProperty(property, computedStyle.getPropertyValue(property), computedStyle.getPropertyPriority(property));
    }
  });
};

const replaceCloneImagesWithDataUrls = (source, clone) => {
  const sourceImages = [...source.querySelectorAll("img")];
  const cloneImages = [...clone.querySelectorAll("img")];

  sourceImages.forEach((image, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d").drawImage(image, 0, 0);
    cloneImages[index].src = canvas.toDataURL("image/png");
  });
};

const svgToDataUrl = (svg) => {
  const bytes = new TextEncoder().encode(svg);
  let binary = "";
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return `data:image/svg+xml;base64,${window.btoa(binary)}`;
};

const renderReportPreviewToCanvas = async () => {
  if (document.fonts?.ready) await document.fonts.ready;
  await Promise.all([...reportPreview.querySelectorAll("img")].map((image) => (
    image.complete && image.naturalWidth ? Promise.resolve() : loadImage(image.currentSrc || image.src)
  )));

  const bounds = reportPreview.getBoundingClientRect();
  const width = Math.ceil(bounds.width);
  const height = Math.ceil(bounds.height);
  const clone = reportPreview.cloneNode(true);
  copyComputedStyles(reportPreview, clone);
  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.margin = "0";
  replaceCloneImagesWithDataUrls(reportPreview, clone);

  const markup = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${markup}</foreignObject></svg>`;
  // A data URL keeps the SVG and its inlined images in the same origin. Blob
  // URLs make a foreignObject canvas "unclean" in WebKit, which prevents the
  // otherwise correctly rendered report from being encoded as a PNG.
  const reportImage = await loadImage(svgToDataUrl(svg));
  const pixelRatio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const context = canvas.getContext("2d");
  context.scale(pixelRatio, pixelRatio);
  context.drawImage(reportImage, 0, 0, width, height);

  return canvas;
};

const canvasToBlob = (canvas) => new Promise((resolve, reject) => {
  if (typeof canvas.toBlob !== "function") {
    try {
      const [header, encodedData] = canvas.toDataURL("image/png").split(",");
      const mimeType = header.match(/data:([^;]+)/)?.[1] || "image/png";
      const binaryData = window.atob(encodedData);
      const bytes = new Uint8Array(binaryData.length);

      for (let index = 0; index < binaryData.length; index += 1) {
        bytes[index] = binaryData.charCodeAt(index);
      }

      resolve(new Blob([bytes], { type: mimeType }));
    } catch (error) {
      reject(error);
    }
    return;
  }

  canvas.toBlob((blob) => {
    if (blob) resolve(blob);
    else reject(new Error("Браузер не зміг створити PNG-файл звіту."));
  }, "image/png");
});

const saveBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  // WebKit needs the object URL to remain alive until it has processed the click.
  // Slow mobile browsers may not start reading the object URL immediately.
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
};

const downloadReportImage = async () => {
  const defaultLabel = downloadReportButton.textContent;
  downloadReportButton.disabled = true;
  downloadReportButton.textContent = "Готуємо файл…";

  try {
    generateReport();
    const canvas = await renderReportPreviewToCanvas();
    const blob = await canvasToBlob(canvas);
    saveBlob(blob, `${getPatientFileBase()}_${getDownloadDatePart()}.png`);
  } catch (error) {
    console.error("Не вдалося скачати звіт:", error);
    window.alert("Не вдалося створити фото звіту. Оновіть сторінку та спробуйте ще раз.");
  } finally {
    downloadReportButton.disabled = false;
    downloadReportButton.textContent = defaultLabel;
  }
};

reportButton?.addEventListener("click", generateReport);
downloadReportButton?.addEventListener("click", downloadReportImage);
window.addEventListener("popstate", renderFromUrl);
