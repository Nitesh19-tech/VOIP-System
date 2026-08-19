import { useState } from "react";
import {
  X,
  Upload,
} from "lucide-react";


export default function UploadNumbersModal({
  open,
  onClose,
  onImport,
  carriers = [],
  importing = false,
}) {

  const [carrier, setCarrier] =
    useState("");

  const [service, setService] =
    useState("");

  const [isTestNumber, setIsTestNumber] =
    useState(false);

  const [file, setFile] =
    useState(null);

  const [maxCalls, setMaxCalls] =
    useState(0);

  const [maxDuration, setMaxDuration] =
    useState(0);


  // =====================================================
  // SERVICE OPTIONS
  // Previous Panel
  // =====================================================

  const services = [
    {
      value: "ConferenceCut",
      label: "ConferenceCut",
    },
    {
      value: "Playback",
      label: "Playback",
    },
    {
      value: "PlaybackLoop",
      label: "PlaybackLoop",
    },
    {
      value: "Reject",
      label: "Reject",
    },
  ];


  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {

    if (importing) {
      return;
    }

    setCarrier("");
    setService("");
    setIsTestNumber(false);
    setFile(null);
    setMaxCalls(0);
    setMaxDuration(0);

    onClose();
  };


  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (e) => {

    const selectedFile =
      e.target.files?.[0] || null;


    if (!selectedFile) {

      setFile(null);

      return;
    }


    const allowedExtensions = [
      ".csv",
      ".xlsx",
      ".xls",
    ];


    const fileName =
      selectedFile.name.toLowerCase();


    const validExtension =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(extension)
      );


    if (!validExtension) {

      alert(
        "Please select CSV, XLSX or XLS file."
      );

      e.target.value = "";

      setFile(null);

      return;
    }


    const maxSize =
      20 * 1024 * 1024;


    if (selectedFile.size > maxSize) {

      alert(
        "File size must be less than 20 MB."
      );

      e.target.value = "";

      setFile(null);

      return;
    }


    setFile(selectedFile);
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!carrier) {

      alert(
        "Please select carrier."
      );

      return;
    }


    if (!file) {

      alert(
        "Please select CSV file."
      );

      return;
    }


    const payload = {

      carrier,

      service,

      is_test_number:
        isTestNumber,

      file,

      daily_max_call:
        Number(maxCalls) || 0,

      daily_max_duration:
        Number(maxDuration) || 0,

    };


    await onImport(payload);
  };


  if (!open) {
    return null;
  }


  return (

    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        p-0
        sm:p-4
      "
    >

      <div
        className="
          flex
          max-h-[95vh]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-xl
          bg-white
          shadow-2xl
          dark:bg-slate-900
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            px-7
            py-6
            dark:border-slate-800
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-slate-800
              dark:text-white
            "
          >
            Upload Numbers
          </h2>


          <button
            type="button"
            onClick={handleClose}
            disabled={importing}
            className="
              rounded-lg
              p-1
              text-slate-600
              transition
              hover:bg-slate-100
              hover:text-slate-900
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >

            <X size={18} />

          </button>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            flex
            min-h-0
            flex-1
            flex-col
          "
        >

          {/* =================================================
              BODY
          ================================================= */}

          <div
            className="
              overflow-y-auto
              px-7
              py-8
            "
          >

            <div
              className="
                grid
                grid-cols-1
                gap-8
                md:grid-cols-2
              "
            >

              {/* =================================================
                  LEFT COLUMN
              ================================================= */}

              <div className="space-y-5">

                {/* CARRIER */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-base
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Select Carrier
                  </label>


                  <select
                    value={carrier}
                    onChange={(e) =>
                      setCarrier(
                        e.target.value
                      )
                    }
                    disabled={importing}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      focus:border-blue-500
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-white
                      dark:disabled:bg-slate-800
                    "
                  >

                    <option value="">
                      Please Select
                    </option>


                    {carriers.map(
                      (item) => (

                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* TEST NUMBER */}

                <div>

                  <label
                    className="
                      mb-1
                      block
                      text-base
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Make 1 Test Number
                  </label>


                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-1
                      text-sm
                      text-slate-700
                      dark:text-slate-300
                    "
                  >

                    <input
                      type="checkbox"
                      checked={
                        isTestNumber
                      }
                      onChange={(e) =>
                        setIsTestNumber(
                          e.target.checked
                        )
                      }
                      disabled={importing}
                      className="
                        h-4
                        w-4
                      "
                    />

                    Yes

                  </label>

                </div>


                {/* CSV */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-base
                      text-slate-700
                      dark:text-slate-200
                    "
                  >

                    Upload CSV:

                    <button
                      type="button"
                      className="
                        ml-1
                        text-sky-500
                        hover:underline
                      "
                      onClick={() => {

                        // Sample download can be
                        // connected later to backend.
                        alert(
                          "Sample CSV download will be connected here."
                        );

                      }}
                    >
                      Download Sample
                    </button>

                  </label>


                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={
                      handleFileChange
                    }
                    disabled={importing}
                    className="
                      block
                      w-full
                      cursor-pointer
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      text-sm
                      text-slate-700
                      file:mr-4
                      file:border-0
                      file:bg-slate-100
                      file:px-4
                      file:py-3
                      hover:file:bg-slate-200
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-slate-300
                      dark:file:bg-slate-800
                    "
                  />


                  {file && (

                    <p
                      className="
                        mt-2
                        truncate
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Selected: {file.name}
                    </p>

                  )}

                </div>

              </div>


              {/* =================================================
                  RIGHT COLUMN
              ================================================= */}

              <div className="space-y-5">

                {/* SERVICE */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-base
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Numbers Service
                  </label>


                  <select
                    value={service}
                    onChange={(e) =>
                      setService(
                        e.target.value
                      )
                    }
                    disabled={importing}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      focus:border-blue-500
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-white
                      dark:disabled:bg-slate-800
                    "
                  >

                    <option value="">
                      Select Service
                    </option>


                    {services.map(
                      (item) => (

                        <option
                          key={
                            item.value
                          }
                          value={
                            item.value
                          }
                        >
                          {item.label}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* SERVICE VARIABLES */}

                <div>

                  <label
                    className="
                      block
                      text-base
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Service Variables
                  </label>

                </div>


                {/* MAX CALL */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-base
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Maximum Calls in Day
                  </label>


                  <input
                    type="number"
                    min="0"
                    value={maxCalls}
                    onChange={(e) =>
                      setMaxCalls(
                        e.target.value
                      )
                    }
                    disabled={importing}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      focus:border-blue-500
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-white
                      dark:disabled:bg-slate-800
                    "
                  />

                </div>


                {/* MAX DURATION */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-base
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Maximum Duration in Day(Seconds)
                  </label>


                  <input
                    type="number"
                    min="0"
                    value={maxDuration}
                    onChange={(e) =>
                      setMaxDuration(
                        e.target.value
                      )
                    }
                    disabled={importing}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      focus:border-blue-500
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-white
                      dark:disabled:bg-slate-800
                    "
                  />

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              justify-end
              gap-4
              border-t
              border-slate-200
              px-7
              py-6
              dark:border-slate-800
            "
          >

            <button
              type="button"
              onClick={handleClose}
              disabled={importing}
              className="
                rounded-lg
                px-5
                py-3
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >
              Close
            </button>


            <button
              type="submit"
              disabled={
                importing ||
                !carrier ||
                !file
              }
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-sky-500
                px-6
                py-3
                font-medium
                text-white
                shadow
                transition
                hover:bg-sky-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <Upload size={18} />

              {importing
                ? "Uploading..."
                : "Add"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}