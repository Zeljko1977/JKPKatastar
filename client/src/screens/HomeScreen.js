import React, { useState, useEffect, useRef } from "react";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { Autocomplete } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { Map, GoogleApiWrapper, Marker, Polygon } from "google-maps-react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  getGravesError,
  getGravesStatus,
  fetchGravesForCemetary,
  selectAllGraves,
} from "../features/gravesSlice";
import {
  getAllGraveTypes,
  selectAllGraveTypes,
} from "../features/graveTypesSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getSelectedCemetery } from "../utils/cemeterySelector";

const mapStyles = {
  width: "70%",
  height: "70%",
  position: "relative",
  top: "50px",
};

const getSizeOfMarker = (zoom) => {
  //console.log(zoom);
  switch (zoom) {
    case 20:
      return 16;
    case 19:
      return 9;
    case 18:
      return 6;
    case 17:
      return 4;
    default:
      return 2;
  }
};

const iconBaseFree =
  "http://maps.google.com/mapfiles/kml/paddle/grn-blank-lv.png";
const iconBaseFull =
  "http://maps.google.com/mapfiles/kml/paddle/red-circle-lv.png";

const HomeScreen = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const graves = useSelector(selectAllGraves);
  const graveTypes = useSelector(selectAllGraveTypes);
  const gravesStatus = useSelector(getGravesStatus);
  const error = useSelector(getGravesError);

  const [graveTypeIds, setGraveTypeIds] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(19);
  const [selectedGrave, setSelectedGrave] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const mapRef = useRef(null);
  let navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  // const selectedCemetery = location.state?.cemetery;
  const [selectedCemetery, setCemeteryId] = React.useState(
    getSelectedCemetery()
  );
  //|| location.state?.sender === "ADDGraveSreen"
  useEffect(() => {
    if (!localStorage.getItem("selected-cemetery")) {
      navigate("/landing");
    } else {
      if (gravesStatus === "idle") {
        console.log("UPAO");
        dispatch(fetchGravesForCemetary(selectedCemetery?._id));
        dispatch(getAllGraveTypes());
      }
    }
  }, [gravesStatus, dispatch]);
  /*   useEffect(() => {
    if (location.state?.sender === "ADDGraveSreen") {
      dispatch(fetchGraves());
    }
  }, []); */

  useEffect(() => {
    if (mapRef.current) {
      // Dohvatite trenutni zoom nivo
      const newZoom = mapRef.current.map.getZoom();
      console.log("SETTING OF INITIAL ZOOM: ", newZoom);
      setCurrentZoom(newZoom);

      // Dodajte slušač za promene zoom nivoa
      mapRef.current.map.addListener("zoom_changed", () => {
        console.log("ZOOM CHANGED");
        const updatedZoom = mapRef.current.map.getZoom();
        console.log(updatedZoom);
        setCurrentZoom(updatedZoom);
      });
    }
    return () => {
      if (mapRef.current && mapRef.current.map.removeListener) {
        mapRef.current.map.removeListener("zoom_changed");
      }
    };
  }, []);

  const onClickHandler = (grave) => {
    setSelectedGrave(grave);
    setShowModal(true);
  };
  const onCloseHandler = () => {
    setShowModal(false);
    setSelectedGrave(null);
  };

  if (gravesStatus === "loading") {
    return <Loader />;
  }

  if (gravesStatus === "failed") {
    return (
      <Message variant="danger">
        <div>Error: {error}</div>
      </Message>
    );
  }

  function getStatData(graveType, graves) {
    // console.log(graves);
    // console.log(graveType);
    let fileteredGraves = graves.filter(
      (grave) => grave.graveType === graveType._id
    );
    let numberOfFilteredGraves = fileteredGraves.length;
    let filteredFreeGraves = fileteredGraves.filter(
      (grave) => grave.status === "FREE"
    );
    let numberOffilteredFreeGraves = filteredFreeGraves.length;
    let numberOfOccupiedGraves =
      numberOfFilteredGraves - numberOffilteredFreeGraves;
    return {
      graveType: graveType.name,
      numberOfFilteredGraves,
      numberOffilteredFreeGraves,
      numberOfOccupiedGraves,
    };
  }

  const rows = graveTypes.map((graveType) => getStatData(graveType, graves));

  const handleChangeGraveType = (event, value) => {
    let slelectedGraveTypeIds = value.map((graveType) => graveType._id);
    setGraveTypeIds(slelectedGraveTypeIds);
  };

  return (
    <>
      <div
        style={{
          height: "50vw",
          width: "100%",
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>
          {t("home-screen.cemetery")}: {selectedCemetery?.name}
        </h3>
        {/* <TableContainer
          component={Paper}
          style={{
            width: "70%",
          }}
        > */}
        <Table sx={{ width: "50%", margin: "10px" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t("home-screen.grave-type")}</TableCell>
              <TableCell align="right">
                {t("home-screen.number-of-graves")}
              </TableCell>
              <TableCell align="right">
                {t("home-screen.number-of-free-graves")}
              </TableCell>
              <TableCell align="right">
                {t("home-screen.number-of-occupied-graves")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.graveType}
                </TableCell>
                <TableCell align="right">
                  {row.numberOfFilteredGraves}
                </TableCell>
                <TableCell align="right">
                  {row.numberOffilteredFreeGraves}
                </TableCell>
                <TableCell align="right">
                  {row.numberOfOccupiedGraves}
                </TableCell>
              </TableRow>
            ))}
            <TableRow
              key={0}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {t("home-screen.total")}
              </TableCell>
              <TableCell align="right">{graves.length}</TableCell>
              <TableCell align="right">
                {graves.filter((grave) => grave.status === "FREE").length}
              </TableCell>
              <TableCell align="right">
                {graves.filter((grave) => grave.status === "OCCUPIED").length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Button
          variant="contained"
          onClick={() => {
            navigate({
              pathname: "/graves-table-crud",
            });
          }}
        >
          {t("home-screen.table-view")}
        </Button>
        <br />
        <FormControl
          margin="normal"
          fullWidth
          sx={{ gridArea: "cemetery", width: "400px" }}
        >
          <Autocomplete
            onChange={handleChangeGraveType}
            multiple
            options={graveTypes}
            getOptionLabel={(option) =>
              `${option.name} - ${option.description}`
            }
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={t("home-screen.selection-grave-type")}
                placeholder={t("home-screen.selection-grave-type")}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <MenuItem
                {...props}
                key={option._id}
                value={option._id}
                sx={{ justifyContent: "space-between" }}
              >
                {option.name} - {option.description}
                {selected ? <CheckIcon color="info" /> : null}
              </MenuItem>
            )}
          />
        </FormControl>
        <br />
        <Map
          containerStyle={mapStyles}
          ref={mapRef}
          zoom={selectedCemetery?.zoom}
          google={props.google}
          initialCenter={{
            lat: selectedCemetery?.LAT,
            lng: selectedCemetery?.LON,
          }}
          mapType="satellite"
        >
          {graves
            .filter((grave) => {
              return (
                graveTypeIds.length === 0 ||
                graveTypeIds.some((id) => id === grave.graveType)
              );
            })
            .map((grave) => {
              console.log(grave.status);
              const iconUrl =
                grave.status === "FREE" ? iconBaseFree : iconBaseFull;
              return (
                <Marker
                  key={grave._id}
                  position={{ lat: grave.LAT, lng: grave.LON }}
                  icon={{
                    url: iconUrl,
                    scaledSize: new props.google.maps.Size(
                      getSizeOfMarker(currentZoom),
                      getSizeOfMarker(currentZoom)
                    ),
                    rotation: 45,
                  }}
                  onClick={() => onClickHandler(grave)}
                />
              );
            })}
        </Map>
        {selectedGrave && (
          <Modal show={showModal} onHide={onCloseHandler} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{t("home-screen.grave-information")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("home-screen.field")}</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedGrave.field}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("home-screen.row")}</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedGrave.row}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("home-screen.number")}</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedGrave.number}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("home-screen.grave-type")}</Form.Label>
                      <Form.Control
                        type="text"
                        value={
                          graveTypes.find(
                            (graveType) =>
                              selectedGrave.graveType === graveType._id
                          ).name
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("home-screen.availability")}</Form.Label>
                      <Form.Control
                        type="text"
                        value={t(
                          `home-screen.${selectedGrave.status.toLowerCase()}`
                        )}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col>
                  <br />
                  <Button
                    onClick={() => {
                      navigate({
                        pathname: "/single-grave",
                        search: createSearchParams({
                          id: selectedGrave._id,
                        }).toString(),
                      });
                    }}
                  >
                    {t("home-screen.details")}
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  );
};
export default GoogleApiWrapper({
  apiKey: "AIzaSyACV2yMJcx_aByY3PwY1b59WvppbM9_ovc",
})(HomeScreen);
