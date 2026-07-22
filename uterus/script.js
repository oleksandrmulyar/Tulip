const images = [
  "anteversio-anteflexio.png",
  "anteversio-retroflexio.png",
  "retroversio-anteflexio.png",
  "retroversio-retroflexio.png",
];

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
  const finding = document.querySelector(`#${key}-ovary-finding`);
  const details = document.querySelector(`.${key}-ovary-finding-details`);
  const invasion = document.querySelector(`.${key}-ovary-invasion`);

  const sync = () => {
    if (positionManual) positionManual.hidden = position?.value !== "manual";
    if (details) details.hidden = !finding || finding.value === "none";
    if (invasion) invasion.hidden = finding?.value !== "mass";
  };

  position?.addEventListener("change", sync);
  finding?.addEventListener("change", sync);
  sync();
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

const renderReportPreview = (reportLines = []) => {
  if (!reportPreview) return;

  const patientName = getValue("#patient-name");
  const uterusPosition = getValue("#uterus-position");
  const uterusSize = getDimensionValue("#uterus-size-length", "#uterus-size-ap", "#uterus-size-width");
  const endometriumSize = getValue("#endometrium-size");
  const previewImages = [getSurfaceDataUrl("selected"), getSurfaceDataUrl("reference")].filter(Boolean);
  const lesions = [...getAnnotationPreviewItems("myoma"), ...getAnnotationPreviewItems("formation")];
  const ovaryLines = [buildOvaryLine("Правий", "right"), buildOvaryLine("Лівий", "left")].filter(Boolean);
  const lesionHtml = lesions.map((item) => `
    <div class="report-preview-lesion">
      <div class="report-preview-lesion-title"><span class="report-preview-dot" style="--myoma-color:${escapeHtml(item.color)}"></span>${escapeHtml(item.type === "myoma" ? `Міома ${item.number}:` : `Утвір ${item.number}:`)}</div>
      ${item.size ? `<p>${escapeHtml(item.size)} мм</p>` : ""}
      ${item.label ? `<p><strong>${escapeHtml(item.label)}</strong></p>` : ""}
      ${item.wall !== "—" ? `<p>Стінка: ${escapeHtml(item.wall)}</p>` : ""}
      ${item.location !== "—" ? `<p>Локалізація/опис: ${escapeHtml(item.location)}</p>` : ""}
    </div>`).join("");

  reportPreview.innerHTML = `
    <div class="report-preview-image">
      <h3>МРТ матки — звіт</h3>
      <div class="report-preview-images">${previewImages.map((src, index) => `<img src="${escapeHtml(src)}" alt="Зображення матки з позначками ${index + 1}" />`).join("")}</div>
    </div>
    <div class="report-preview-text">
      ${patientName ? `<p><strong>${escapeHtml(patientName)}</strong></p>` : ""}
      ${(uterusPosition || uterusSize) ? `<p><strong>Матка:</strong>${uterusPosition ? `<br>${escapeHtml(uterusPosition)}` : ""}${uterusSize ? `<br>${escapeHtml(uterusSize)} мм` : ""}</p>` : ""}
      ${endometriumSize ? `<p><strong>Ендометрій:</strong> ${escapeHtml(endometriumSize)} мм</p>` : ""}
      ${reportLines.length ? `<div class="report-preview-section"><p><strong>Текст звіту:</strong></p>${reportLines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>` : ""}
      ${lesionHtml || `<p class="report-preview-section"><strong>Ураження:</strong> —</p>`}
      ${ovaryLines.length ? `<div class="report-preview-ovaries"><p><strong>Яєчники:</strong></p>${ovaryLines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>` : ""}
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

const buildOvaryLine = (sideLabel, key) => {
  const size = getDimensionValue(`#${key}-ovary-size-length`, `#${key}-ovary-size-width`, `#${key}-ovary-size-depth`);
  const positionValue = getValue(`#${key}-ovary-position`);
  const position = positionValue === "manual" ? getValue(`#${key}-ovary-position-text`) : positionValue;
  const structure = getValue(`#${key}-ovary-structure`);
  const findingValue = getValue(`#${key}-ovary-finding`);
  const findingText = getValue(`#${key}-ovary-finding-text`);
  const findingSize = getDimensionValue(`#${key}-ovary-finding-size-length`, `#${key}-ovary-finding-size-width`, `#${key}-ovary-finding-size-depth`);
  const invasion = findingValue === "mass" ? getValue(`#${key}-ovary-invasion`) : "";
  const notes = getValue(`#${key}-ovary-notes`);
  const parts = [];

  if (position) parts.push(position);
  if (size) parts.push(`розміри ${size} мм`);
  if (structure) parts.push(structure);
  if (findingValue === "none") {
    parts.push("без вогнищевих змін та патологічних включень");
  } else if (findingValue) {
    const findingParts = [findingValue === "mass" ? "утвір" : findingValue === "other" ? "інше" : findingValue];
    if (findingText) findingParts.push(findingText);
    if (findingSize) findingParts.push(`розміри ${findingSize} мм`);
    if (invasion) findingParts.push(invasion);
    parts.push(findingParts.join(": "));
  }
  if (notes) parts.push(notes);

  return parts.length ? `${sideLabel} яєчник: ${parts.join("; ")}.` : "";
};

const buildReportLines = () => {
  const lines = [];
  const patientName = getValue("#patient-name");
  const uterusPosition = getValue("#uterus-position");
  const uterusSize = getDimensionValue("#uterus-size-length", "#uterus-size-ap", "#uterus-size-width");
  const endometriumSize = getValue("#endometrium-size");
  const additionalNotes = getValue("#additional-notes");

  if (patientName) lines.push(`ПІБ: ${patientName}.`);
  if (uterusPosition) lines.push(`Матка у положенні: ${uterusPosition}.`);
  if (uterusSize) lines.push(`Розміри матки: ${uterusSize} мм.`);
  if (endometriumSize) lines.push(`Ендометрій: ${endometriumSize} мм.`);
  if (additionalNotes) lines.push(`Додатково: ${additionalNotes}.`);

  lines.push(...buildAnnotationReportLines("myoma", "Міоми"));
  lines.push(...buildAnnotationReportLines("formation", "Інші ураження"));

  const ovaryLines = [buildOvaryLine("Правий", "right"), buildOvaryLine("Лівий", "left")].filter(Boolean);
  if (ovaryLines.length) lines.push("Яєчники:", ...ovaryLines);

  return lines;
};

const generateReport = () => {
  renderReportPreview(buildReportLines());
};

setupConditionalFields("right");
setupConditionalFields("left");
renderGallery();
renderFromUrl();

addMyomaButton.addEventListener("click", () => addAnnotation("myoma"));
addFormationButton.addEventListener("click", () => addAnnotation("formation"));
downloadImageButtons.forEach((button) => {
  button.addEventListener("click", () => downloadSurfaceImage(button.dataset.downloadSurface));
});
const wrapCanvasText = (context, text, x, y, maxWidth, lineHeight) => {
  const words = String(text).split(" ");
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (context.measureText(next).width > maxWidth && current) {
      context.fillText(current, x, y);
      y += lineHeight;
      current = word;
    } else {
      current = next;
    }
  });

  if (current) {
    context.fillText(current, x, y);
    y += lineHeight;
  }

  return y;
};

const drawCanvasReportSection = (context, title, lines, x, y, maxWidth, color = "#0f172a") => {
  context.fillStyle = color;
  context.font = "700 18px sans-serif";
  y = wrapCanvasText(context, title, x, y, maxWidth, 24);
  context.font = "16px sans-serif";
  lines.forEach((line) => {
    y = wrapCanvasText(context, line, x, y + 4, maxWidth, 23);
  });
  return y + 12;
};

const downloadReportImage = () => {
  generateReport();
  const canvas = document.createElement("canvas");
  canvas.width = 653;
  canvas.height = 643;
  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#00112d";
  context.font = "700 22px sans-serif";
  context.fillText("МРТ матки — звіт", 10, 50);

  [renderSurfaceToCanvas("selected"), renderSurfaceToCanvas("reference")].filter(Boolean).forEach((source, index) => {
    const y = 78 + index * 264;
    context.strokeStyle = "#dddddd";
    context.strokeRect(10, y, 260, 253);
    context.drawImage(source, 20, y + 10, 240, 233);
  });

  const x = 292;
  const maxWidth = 340;
  let y = 44;
  const patientName = getValue("#patient-name");
  if (patientName) y = drawCanvasReportSection(context, patientName, [], x, y, maxWidth);
  const uterusPosition = getValue("#uterus-position");
  const uterusSize = getDimensionValue("#uterus-size-length", "#uterus-size-ap", "#uterus-size-width");
  const uterusLines = [uterusPosition, uterusSize ? `${uterusSize} мм` : ""].filter(Boolean);
  if (uterusLines.length) y = drawCanvasReportSection(context, "Матка:", uterusLines, x, y, maxWidth);
  const endometriumSize = getValue("#endometrium-size");
  if (endometriumSize) y = drawCanvasReportSection(context, `Ендометрій: ${endometriumSize} мм`, [], x, y, maxWidth);

  [...getAnnotationPreviewItems("myoma"), ...getAnnotationPreviewItems("formation")].forEach((item) => {
    const title = item.type === "myoma" ? `● Міома ${item.number}:` : `● Утвір ${item.number}:`;
    const lines = [item.size ? `${item.size} мм` : "", item.label, item.wall !== "—" ? `Стінка: ${item.wall}` : "", item.location !== "—" ? `Стінка: ${item.location}` : ""].filter(Boolean);
    y = drawCanvasReportSection(context, title, lines, x, y, maxWidth, item.color);
  });

  const ovaryLines = [buildOvaryLine("Правий", "right"), buildOvaryLine("Лівий", "left")].filter(Boolean);
  if (ovaryLines.length) y = drawCanvasReportSection(context, "Яєчники:", ovaryLines, x, y, maxWidth);

  const link = document.createElement("a");
  link.download = `${getPatientFileBase()}_${getDownloadDatePart()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

reportButton?.addEventListener("click", generateReport);
downloadReportButton?.addEventListener("click", downloadReportImage);
window.addEventListener("popstate", renderFromUrl);
