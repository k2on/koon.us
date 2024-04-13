"use client"
import React, { useEffect, useState } from 'react'
import { GoogleMap, MarkerF, PolygonF, useJsApiLoader } from '@react-google-maps/api';
import { env } from '@/env';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { v4 } from 'uuid';
import { RouterOutputs } from '@/trpc/shared';
import { api } from '@/trpc/react';
import { Card, CardHeader } from '@/components/ui/card';
import { UploadButton } from '@/utils/uploadthing';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 34.67656996152723, 
  lng: -82.83642988916701
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS,
  })

  const { data } = api.maps.getCollege.useQuery();
  const { mutate } = api.maps.saveBuilding.useMutation();

  const [map, setMap] = useState(null)

  const [points, setPoints] = useState<google.maps.LatLng[]>([]);
  const [buildingId, setBuildingId] = useState<string>();
  const [buildingName, setBuildingName] = useState("");


  const [floors, setFloors] = useState<RouterOutputs["maps"]["getCollege"]["buildings"][number]["floors"]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (points.length < 3) return;

        const id = v4();
        setBuildingId(id);
        setFloors([{
            id: v4(),
            label: "",
            buildingId: id,
            imageUrl: "",
        }])
      } else if (e.key == "u" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const newPoints = [...points];
        newPoints.pop();
        setPoints(newPoints);
      } else if (e.key == "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPoints([]);
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [points])

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);

    // setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <>
        <Dialog open={!!buildingId} onOpenChange={(_v) => setBuildingId(undefined)}>
          <DialogContent className="sm:max-w-[825px]">
            <DialogHeader>
              <DialogTitle>Edit building</DialogTitle>
              <DialogDescription>
                Make changes to your building here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue=""
                  className="col-span-3"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                />
              </div>
            </div>
            Floors
            <div className='grid grid-cols-4'>
                {floors.length > 0
                ? floors.map((f, i) => <Card>
                    <Input placeholder="Floor name" value={f.label} onChange={(e) => {
                        const newFloors = [...floors];

                        newFloors[i] = {...f, ...{
                            label: e.target.value,
                        }}
                        setFloors(newFloors)
                    }} />
                    {f.imageUrl && <img src={f.imageUrl} />}
                    
                    <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          console.log("Files: ", res);

                            const newFloors = [...floors];

                            newFloors[i] = {...f, ...{
                                imageUrl: res[0]!.url,
                            }}
                            setFloors(newFloors)
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                    <Button variant="destructive">Delete</Button>
                </Card>)
                : <span>No floors</span>}
                <Card className='flex items-center justify-center' onClick={() => {
                    if (!buildingId) return;
                    const newFloors = [...floors];
                    newFloors.push({
                        id: v4(),
                        label: "",
                        buildingId: buildingId,
                        imageUrl: "",
                    })
                    setFloors(newFloors)
                }}>+ New Floor</Card>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                  if (!data) return;
                  if (!buildingId) return;

                  mutate({
                      building: {
                          id: buildingId,
                          collegeId: data.id,
                          name: buildingName,
                          removedAt: new Date(),
                      },
                      points: points.map(p => ({
                        id: v4(),
                        lat: p.lat(),
                        lng: p.lng(),
                      })),
                      floors: floors,
                  })

              }} variant="destructive">Delete</Button>
              <Button onClick={() => {
                  if (!data) return;
                  if (!buildingId) return;

                  mutate({
                      building: {
                          id: buildingId,
                          collegeId: data.id,
                          name: buildingName,
                          removedAt: null,
                      },
                      points: points.map(p => ({
                        id: v4(),
                        lat: p.lat(),
                        lng: p.lng(),
                      })),
                      floors: floors,
                  })
              }} type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={(e) => {
            if (!e.latLng) return;
            setPoints([...points, e.latLng])
        }}
      >
        {points.map((p, i) => <MarkerF draggable position={p} onDrag={(e) => {
            if (!e.latLng) return;
            const newPoints = [...points];
            newPoints[i] = e.latLng;
            setPoints(newPoints);
        }} />)}
        {points.length > 2 && <PolygonF path={points} />}
        {data?.buildings.map(b => <PolygonF onClick={() => {
            setBuildingName(b.name);
            setFloors(b.floors);
            setBuildingId(b.id);
        }} path={b.points} />)}
      </GoogleMap>
    </>
  ) : <></>
}

export default React.memo(MyComponent)
