import { Box } from "@mui/material";
import { t } from "i18next";
import { createSearchParams, useNavigate } from "react-router-dom";
import ButtonMUI from "@mui/material/Button";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { useState } from "react";
import { ADMINISTRATOR, OFFICER } from "../utils/constant.js";

const DeleteAndMaybeRemoveButton = (
  id: string,
  relativePathOfAction: string,
  actionFunction: (id: string) => void
) => {
  let navigate = useNavigate();
  const user = useSelector(selectUser);
  const [showModal, setShowModal] = useState(false);
  const [selectedGraveId, setSelectedGraveId] = useState<string>();
  return (
    <Box sx={{ display: "flex", gap: "1rem" }}>
      <ButtonMUI
        variant="contained"
        onClick={() => {
          navigate({
            pathname: relativePathOfAction,
            search: createSearchParams({
              id: id.toString(),
            }).toString(),
          });
        }}
      >
        {t("details")}
      </ButtonMUI>
      {(user?.role === OFFICER || user?.role === ADMINISTRATOR) && (
        <ButtonMUI
          variant="contained"
          color="secondary"
          onClick={() => actionFunction(id.toString())}
        >
          {t("delete")}
        </ButtonMUI>
      )}
    </Box>
  );
};

export { DeleteAndMaybeRemoveButton };
